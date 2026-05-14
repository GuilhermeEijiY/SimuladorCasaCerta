import { CreateSimulationDto } from "./simulation.dto";
import { SimulationRepository } from "./simulation.repository";
import { calculateSac } from "./engines/financing-sac.engine";
import { calculatePrice } from "./engines/financing-price.engine";
import { calculateConsortium } from "./engines/consortium.engine";
import { calculateRecommendation } from "./engines/recommendation.engine";

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

    const simulation = await repository.create({
      userId,
      input: data,
      sac,
      price,
      consortium,
      recommendation,
    });

    return simulation;
  }

  async list(userId: string) {
    return repository.findByUserId(userId);
  }
}
