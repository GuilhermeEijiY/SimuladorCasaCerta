import { prisma } from "../../config/database";
import { CreateSimulationDto } from "./simulation.dto";
import { SacOutput } from "./engines/financing-sac.engine";
import { PriceOutput } from "./engines/financing-price.engine";
import { ConsortiumOutput } from "./engines/consortium.engine";
import { RecommendationOutput } from "./engines/recommendation.engine";

interface PersistSimulationData {
  userId: string;
  input: CreateSimulationDto;
  sac: SacOutput;
  price: PriceOutput;
  consortium: ConsortiumOutput;
  recommendation: RecommendationOutput;
}

export class SimulationRepository {
  async create(data: PersistSimulationData) {
    const financedAmount = data.input.propertyValue - data.input.downPayment;

    return prisma.simulation.create({
      data: {
        userId: data.userId,
        propertyValue: data.input.propertyValue,
        downPayment: data.input.downPayment,
        monthlyIncome: data.input.monthlyIncome,
        interestRate: data.input.interestRate,
        termMonths: data.input.termMonths,
        adminFee: data.input.adminFee,
        bidValue: data.input.bidValue,
        objective: data.input.objective,
        urgency: data.input.urgency,
        financingResults: {
          createMany: {
            data: [
              {
                financingType: "SAC",
                financedAmount,
                firstInstallment: data.sac.firstInstallment,
                lastInstallment: data.sac.lastInstallment,
                totalCost: data.sac.totalCost,
                totalInterest: data.sac.totalInterest,
              },
              {
                financingType: "PRICE",
                financedAmount,
                firstInstallment: data.price.fixedInstallment,
                lastInstallment: data.price.fixedInstallment,
                totalCost: data.price.totalCost,
                totalInterest: data.price.totalInterest,
              },
            ],
          },
        },
        consortiumResult: {
          create: {
            creditValue: financedAmount,
            monthlyPayment: data.consortium.monthlyPayment,
            adminFeeTotal: data.consortium.adminFeeTotal,
            bidValue: data.input.bidValue,
            estimatedContemplation: data.consortium.estimatedContemplation,
            totalCost: data.consortium.totalCost,
          },
        },
        recommendation: {
          create: {
            recommendedOption: data.recommendation.recommendedOption,
            reason: data.recommendation.reason,
            scoreFinancing: data.recommendation.scoreFinancing,
            scoreConsortium: data.recommendation.scoreConsortium,
            savingsEstimate: data.recommendation.savingsEstimate,
          },
        },
      },
      include: {
        financingResults: true,
        consortiumResult: true,
        recommendation: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.simulation.findMany({
      where: { userId },
      include: {
        financingResults: true,
        consortiumResult: true,
        recommendation: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
