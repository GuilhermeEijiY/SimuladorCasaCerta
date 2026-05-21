import { CreateSimulationDto } from "./simulation.dto";
import { SimulationRepository } from "./simulation.repository";
import { calculateSac } from "./engines/financing-sac.engine";
import { calculatePrice } from "./engines/financing-price.engine";
import { calculateConsortium } from "./engines/consortium.engine";
import { calculateRecommendation } from "./engines/recommendation.engine";
import { generateAiRecommendation } from "./engines/ai-recommendation.engine";

const repository = new SimulationRepository();

export class SimulationService {
  async execute(userId: string, data: CreateSimulationDto) {
    const financedAmount = data.propertyValue - data.downPayment;

    const sac = calculateSac({
      financedAmount,
      interestRate: data.interestRate,
      termMonths: data.termMonths,
    });

    const price = calculatePrice({
      financedAmount,
      interestRate: data.interestRate,
      termMonths: data.termMonths,
    });

    const consortium = calculateConsortium({
      creditValue: financedAmount,
      adminFee: data.adminFee,
      termMonths: data.termMonths,
      bidValue: data.bidValue,
    });

    const recommendation = calculateRecommendation({
      sac,
      price,
      consortium,
      monthlyIncome: data.monthlyIncome,
      urgency: data.urgency,
    });

    let aiReason: string | null = null;
    try {
      aiReason = await generateAiRecommendation({
        sac,
        price,
        consortium,
        recommendation,
        monthlyIncome: data.monthlyIncome,
        urgency: data.urgency,
        objective: data.objective,
        propertyValue: data.propertyValue,
        downPayment: data.downPayment,
        termMonths: data.termMonths,
      });
    } catch (err) {
      console.error("Erro ao gerar recomendação IA:", err);
    }

    const simulation = await repository.create({
      userId,
      input: data,
      sac,
      price,
      consortium,
      recommendation,
      aiReason,
    });

    return simulation;
  }

  async list(userId: string) {
    return repository.findByUserId(userId);
  }
}
