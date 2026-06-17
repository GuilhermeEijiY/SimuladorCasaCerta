import { SacOutput } from "./financing-sac.engine";
import { PriceOutput } from "./financing-price.engine";
import { ConsortiumOutput } from "./consortium.engine";
import { ScenariosOutput } from "./scenarios.engine";

export interface RecommendationInput {
  sac: SacOutput;
  price: PriceOutput;
  consortium: ConsortiumOutput;
  monthlyIncome: number;
  urgency: "BAIXA" | "MEDIA" | "ALTA";
  scenariosInsights?: ScenariosOutput["insights"];
}

export interface RecommendationFactor {
  name: string;
  weight: number;
  scoreFinancing: number;
  scoreConsortium: number;
  favors: "FINANCIAMENTO" | "CONSORCIO" | "NEUTRO";
  explanation: string;
}

export interface RecommendationOutput {
  recommendedOption: "FINANCING_SAC" | "FINANCING_PRICE" | "CONSORTIUM";
  reason: string;
  scoreFinancing: number;
  scoreConsortium: number;
  savingsEstimate: number;
  factors: RecommendationFactor[];
  decisiveFactor: string;
}

const WEIGHTS = {
  cost: 0.3,
  income: 0.25,
  urgency: 0.2,
  predictability: 0.15,
  flexibility: 0.1,
};

function brl(value: number): string {
  return `R$${value.toFixed(0)}`;
}

function favorsOf(
  scoreFinancing: number,
  scoreConsortium: number,
): "FINANCIAMENTO" | "CONSORCIO" | "NEUTRO" {
  const diff = scoreFinancing - scoreConsortium;
  if (Math.abs(diff) < 3) return "NEUTRO";
  return diff > 0 ? "FINANCIAMENTO" : "CONSORCIO";
}

export function calculateRecommendation(
  input: RecommendationInput,
): RecommendationOutput {
  const { sac, price, consortium, monthlyIncome, urgency, scenariosInsights } = input;

  const bestFinancing = sac.totalCost <= price.totalCost ? sac : price;
  const bestFinancingType = sac.totalCost <= price.totalCost ? "SAC" : "PRICE";
  const financingInstallment =
    bestFinancingType === "SAC" ? sac.firstInstallment : price.fixedInstallment;
  const financingTotalCost = bestFinancing.totalCost;

  const costScoreFinancing =
    100 - (financingTotalCost / (financingTotalCost + consortium.totalCost)) * 100;
  const costScoreConsortium =
    100 - (consortium.totalCost / (financingTotalCost + consortium.totalCost)) * 100;

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

  const amortizationPotential = scenariosInsights
    ? Math.max(
        scenariosInsights.amortizationImpactSac,
        scenariosInsights.amortizationImpactPrice,
      )
    : 0;
  const flexibilityFinancing = amortizationPotential > 0 ? 70 : 50;
  const flexibilityConsortium = 70;

  const factors: RecommendationFactor[] = [
    {
      name: "Custo total",
      weight: WEIGHTS.cost,
      scoreFinancing: Math.round(costScoreFinancing * 100) / 100,
      scoreConsortium: Math.round(costScoreConsortium * 100) / 100,
      favors: favorsOf(costScoreFinancing, costScoreConsortium),
      explanation: `Financiamento ${bestFinancingType} custa ${brl(financingTotalCost)} no total; consórcio custa ${brl(consortium.totalCost)}. Diferença de ${brl(Math.abs(financingTotalCost - consortium.totalCost))}.`,
    },
    {
      name: "Comprometimento de renda",
      weight: WEIGHTS.income,
      scoreFinancing: Math.round(incomeScoreFinancing * 100) / 100,
      scoreConsortium: Math.round(incomeScoreConsortium * 100) / 100,
      favors: favorsOf(incomeScoreFinancing, incomeScoreConsortium),
      explanation: `Parcela do financiamento ocupa ${incomeRatioFinancing.toFixed(1)}% da renda; parcela do consórcio ocupa ${incomeRatioConsortium.toFixed(1)}%. O ideal é manter abaixo de 30%.`,
    },
    {
      name: "Urgência",
      weight: WEIGHTS.urgency,
      scoreFinancing: urgencyScoreFinancing,
      scoreConsortium: urgencyScoreConsortium,
      favors: favorsOf(urgencyScoreFinancing, urgencyScoreConsortium),
      explanation:
        urgency === "ALTA"
          ? "Urgência alta favorece o financiamento, que entrega o imóvel imediatamente, enquanto o consórcio depende de contemplação."
          : urgency === "MEDIA"
            ? "Urgência média acomoda ambos: financiamento é mais rápido, mas o consórcio pode antecipar a contemplação via lance."
            : "Urgência baixa permite esperar a contemplação do consórcio, sem pressão por acesso imediato.",
    },
    {
      name: "Previsibilidade",
      weight: WEIGHTS.predictability,
      scoreFinancing: predictabilityFinancing,
      scoreConsortium: predictabilityConsortium,
      favors: favorsOf(predictabilityFinancing, predictabilityConsortium),
      explanation:
        bestFinancingType === "PRICE"
          ? "PRICE tem parcelas fixas, ideal para planejamento financeiro estável. O consórcio sofre reajuste anual pelo índice."
          : "SAC tem parcelas decrescentes, o que reduz o comprometimento ao longo do tempo. O consórcio sofre reajuste anual pelo índice.",
    },
    {
      name: "Flexibilidade",
      weight: WEIGHTS.flexibility,
      scoreFinancing: flexibilityFinancing,
      scoreConsortium: flexibilityConsortium,
      favors: favorsOf(flexibilityFinancing, flexibilityConsortium),
      explanation:
        amortizationPotential > 0
          ? `Amortizar parcelas extras no financiamento pode economizar até ${brl(amortizationPotential)} ao longo do contrato. O consórcio depende de lances para antecipar a contemplação.`
          : "Financiamento permite amortização extraordinária. O consórcio depende de lances para antecipar contemplação.",
    },
  ];

  const scoreFinancing = factors.reduce(
    (sum, f) => sum + f.scoreFinancing * f.weight,
    0,
  );
  const scoreConsortium = factors.reduce(
    (sum, f) => sum + f.scoreConsortium * f.weight,
    0,
  );

  const recommendedOption: RecommendationOutput["recommendedOption"] =
    scoreFinancing >= scoreConsortium
      ? bestFinancingType === "SAC"
        ? "FINANCING_SAC"
        : "FINANCING_PRICE"
      : "CONSORTIUM";

  const savingsEstimate = Math.abs(financingTotalCost - consortium.totalCost);

  const rankedFactors = [...factors].sort((a, b) => {
    const gapA = Math.abs(a.scoreFinancing - a.scoreConsortium) * a.weight;
    const gapB = Math.abs(b.scoreFinancing - b.scoreConsortium) * b.weight;
    return gapB - gapA;
  });

  const topFactor = rankedFactors[0] as RecommendationFactor;
  const decisiveFactor = topFactor.name;
  const winnerLabel =
    recommendedOption === "CONSORTIUM"
      ? "consórcio"
      : `financiamento ${bestFinancingType}`;

  const opposingFactor = rankedFactors.find((f) => {
    if (f.favors === "NEUTRO") return false;
    if (recommendedOption === "CONSORTIUM" && f.favors === "FINANCIAMENTO") return true;
    if (recommendedOption !== "CONSORTIUM" && f.favors === "CONSORCIO") return true;
    return false;
  });

  let reason = `Recomendamos o ${winnerLabel} principalmente por "${decisiveFactor}": ${topFactor.explanation}`;
  if (opposingFactor) {
    reason += ` Por outro lado, "${opposingFactor.name}" pesa contra esta escolha: ${opposingFactor.explanation}`;
  }
  reason += ` A diferença de custo total entre as modalidades é estimada em ${brl(savingsEstimate)}.`;

  return {
    recommendedOption,
    reason,
    scoreFinancing: Math.round(scoreFinancing * 100) / 100,
    scoreConsortium: Math.round(scoreConsortium * 100) / 100,
    savingsEstimate: Math.round(savingsEstimate * 100) / 100,
    factors,
    decisiveFactor,
  };
}
