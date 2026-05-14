import { SacOutput } from "./financing-sac.engine";
import { PriceOutput } from "./financing-price.engine";
import { ConsortiumOutput } from "./consortium.engine";

export interface RecommendationInput {
  sac: SacOutput;
  price: PriceOutput;
  consortium: ConsortiumOutput;
  monthlyIncome: number;
  urgency: "BAIXA" | "MEDIA" | "ALTA";
}

export interface RecommendationOutput {
  recommendedOption: "FINANCING_SAC" | "FINANCING_PRICE" | "CONSORTIUM";
  reason: string;
  scoreFinancing: number;
  scoreConsortium: number;
  savingsEstimate: number;
}

export function calculateRecommendation(input: RecommendationInput): RecommendationOutput {
  const { sac, price, consortium, monthlyIncome, urgency } = input;

  const bestFinancing = sac.totalCost <= price.totalCost ? sac : price;
  const bestFinancingType = sac.totalCost <= price.totalCost ? "SAC" : "PRICE";
  const financingInstallment = bestFinancingType === "SAC" ? sac.firstInstallment : price.fixedInstallment;

  const costScoreFinancing = 100 - (bestFinancing.totalCost / (bestFinancing.totalCost + consortium.totalCost)) * 100;
  const costScoreConsortium = 100 - (consortium.totalCost / (bestFinancing.totalCost + consortium.totalCost)) * 100;

  const incomeRatioFinancing = (financingInstallment / monthlyIncome) * 100;
  const incomeRatioConsortium = (consortium.monthlyPayment / monthlyIncome) * 100;
  const incomeScoreFinancing = Math.max(0, 100 - incomeRatioFinancing * 2);
  const incomeScoreConsortium = Math.max(0, 100 - incomeRatioConsortium * 2);

  let urgencyScoreFinancing: number;
  let urgencyScoreConsortium: number;
  if (urgency === "ALTA") {
    urgencyScoreFinancing = 100;
    urgencyScoreConsortium = 20;
  } else if (urgency === "MEDIA") {
    urgencyScoreFinancing = 70;
    urgencyScoreConsortium = 50;
  } else {
    urgencyScoreFinancing = 40;
    urgencyScoreConsortium = 80;
  }

  const predictabilityFinancing = bestFinancingType === "PRICE" ? 90 : 60;
  const predictabilityConsortium = 80;

  const flexibilityFinancing = 50;
  const flexibilityConsortium = 70;

  const scoreFinancing =
    costScoreFinancing * 0.3 +
    incomeScoreFinancing * 0.25 +
    urgencyScoreFinancing * 0.2 +
    predictabilityFinancing * 0.15 +
    flexibilityFinancing * 0.1;

  const scoreConsortium =
    costScoreConsortium * 0.3 +
    incomeScoreConsortium * 0.25 +
    urgencyScoreConsortium * 0.2 +
    predictabilityConsortium * 0.15 +
    flexibilityConsortium * 0.1;

  const recommendedOption = scoreFinancing >= scoreConsortium
    ? (bestFinancingType === "SAC" ? "FINANCING_SAC" : "FINANCING_PRICE")
    : "CONSORTIUM";

  const savingsEstimate = Math.abs(bestFinancing.totalCost - consortium.totalCost);

  let reason: string;
  if (recommendedOption === "CONSORTIUM") {
    reason = `Considerando sua renda de R$${monthlyIncome.toFixed(0)} e urgência ${urgency.toLowerCase()}, o consórcio apresenta menor custo total com economia estimada de R$${savingsEstimate.toFixed(0)}.`;
  } else {
    reason = `Considerando sua renda de R$${monthlyIncome.toFixed(0)} e urgência ${urgency.toLowerCase()}, o financiamento ${bestFinancingType} oferece acesso imediato ao imóvel com parcelas compatíveis com seu perfil.`;
  }

  return {
    recommendedOption,
    reason,
    scoreFinancing: Math.round(scoreFinancing * 100) / 100,
    scoreConsortium: Math.round(scoreConsortium * 100) / 100,
    savingsEstimate: Math.round(savingsEstimate * 100) / 100,
  };
}
