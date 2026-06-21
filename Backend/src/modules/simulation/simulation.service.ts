import { CreateSimulationDto } from "./simulation.dto";
import { SimulationRepository } from "./simulation.repository";
import { calculateSac } from "./engines/financing-sac.engine";
import { calculatePrice } from "./engines/financing-price.engine";
import { calculateConsortium } from "./engines/consortium.engine";
import { calculateRecommendation } from "./engines/recommendation.engine";
import { generateAiRecommendation } from "./engines/ai-recommendation.engine";
import { calculateScenarios } from "./engines/scenarios.engine";

const repository = new SimulationRepository();

export class SimulationService {
  async execute(userId: string, data: CreateSimulationDto) {
    const financedAmount = data.propertyValue - data.downPayment;

    const sac = calculateSac({
      financedAmount,
      interestRate: data.interestRate,
      termMonths: data.termMonths,
      extraAmortizationValue: data.extraAmortizationValue,
      amortizationStrategy: data.amortizationStrategy,
    });

    const price = calculatePrice({
      financedAmount,
      interestRate: data.interestRate,
      termMonths: data.termMonths,
      extraAmortizationValue: data.extraAmortizationValue,
      amortizationStrategy: data.amortizationStrategy,
    });

    const consortium = calculateConsortium({
      creditValue: financedAmount,
      adminFee: data.adminFee,
      termMonths: data.termMonths,
      bidValue: data.bidValue,
      consortiumIndex: data.consortiumIndex,
    });

    const scenarios = calculateScenarios({
      financedAmount,
      interestRate: data.interestRate,
      termMonths: data.termMonths,
      adminFee: data.adminFee,
      bidValue: data.bidValue,
      consortiumIndex: data.consortiumIndex,
      extraAmortizationValue: data.extraAmortizationValue,
    });

    const recommendation = calculateRecommendation({
      sac,
      price,
      consortium,
      monthlyIncome: data.monthlyIncome,
      urgency: data.urgency,
      scenariosInsights: scenarios.insights,
    });

    const chartData = sac.monthlyData.map((sacData) => {
      const month = sacData.month;

      const foundConsortium = consortium.monthlyData.find(
        (c) => c.month === month
      );
      const fallbackConsortium =
        consortium.monthlyData[consortium.monthlyData.length - 1];
      const consortiumCost =
        foundConsortium?.accumulatedCost ??
        fallbackConsortium?.accumulatedCost ??
        0;

      const foundPrice = price.monthlyData.find((p) => p.month === month);
      const fallbackPrice = price.monthlyData[price.monthlyData.length - 1];
      const priceCost =
        foundPrice?.accumulatedCost ?? fallbackPrice?.accumulatedCost ?? 0;

      return {
        month,
        sac: sacData.accumulatedCost,
        price: priceCost,
        consortium: consortiumCost,
      };
    });

    let aiReason: string | null = null;
    try {
      if (
        process.env.GROQ_API_KEY &&
        process.env.GROQ_API_KEY !== "mock-key-para-passar-o-erro"
      ) {
        aiReason = await generateAiRecommendation({
          sac,
          price,
          consortium,
          recommendation,
          scenarios,
          monthlyIncome: data.monthlyIncome,
          urgency: data.urgency,
          objective: data.objective,
          propertyValue: data.propertyValue,
          downPayment: data.downPayment,
          termMonths: data.termMonths,
        });
      }
    } catch (err) {
      console.error("Erro ao gerar recomendação IA ignorado.");
    }

    const { monthlyData: _, ...cleanSac } = sac;
    const { monthlyData: __, ...cleanPrice } = price;
    const { monthlyData: ___, ...cleanConsortium } = consortium;

    const simulation = await repository.create({
      userId,
      input: data,
      sac: cleanSac as any,
      price: cleanPrice as any,
      consortium: cleanConsortium as any,
      recommendation,
      aiReason,
      chartData,
      scenarios,
      recommendationFactors: recommendation.factors,
      decisiveFactor: recommendation.decisiveFactor || null,
    });

    return simulation;
  }

  async list(userId: string) {
    return repository.findByUserId(userId);
  }
}
