import { calculateSac } from "./financing-sac.engine";
import { calculatePrice } from "./financing-price.engine";
import { calculateConsortium } from "./consortium.engine";

export interface ScenariosInput {
  financedAmount: number;
  interestRate: number;
  termMonths: number;
  adminFee: number;
  bidValue: number;
  consortiumIndex: "INCC" | "IPCA" | "FIXO";
  extraAmortizationValue: number;
}

export interface ScenarioResult {
  id: string;
  modality: "SAC" | "PRICE" | "CONSORTIUM";
  label: string;
  description: string;
  totalCost: number;
  firstInstallment: number;
  lastInstallment: number;
  timeSavedMonths?: number;
  savingsVsBaseline: number;
}

export interface ScenariosInsights {
  amortizationImpactSac: number;
  amortizationImpactPrice: number;
  bestAmortizationStrategy: "PRAZO" | "PRESTACAO" | "NENHUMA";
  bestAmortizationModality: "SAC" | "PRICE" | "EMPATE";
  rateSensitivity: number;
  consortiumIndexImpact: number;
}

export interface ScenariosOutput {
  scenarios: ScenarioResult[];
  insights: ScenariosInsights;
}

const RATE_DELTA = 0.001;

function resolveExtraValue(input: ScenariosInput): number {
  if (input.extraAmortizationValue > 0) return input.extraAmortizationValue;
  return Math.max(100, Math.round((input.financedAmount / input.termMonths) * 0.1));
}

export function calculateScenarios(input: ScenariosInput): ScenariosOutput {
  const extra = resolveExtraValue(input);

  const sacBase = calculateSac({
    financedAmount: input.financedAmount,
    interestRate: input.interestRate,
    termMonths: input.termMonths,
  });

  const priceBase = calculatePrice({
    financedAmount: input.financedAmount,
    interestRate: input.interestRate,
    termMonths: input.termMonths,
  });

  const sacPrazo = calculateSac({
    financedAmount: input.financedAmount,
    interestRate: input.interestRate,
    termMonths: input.termMonths,
    extraAmortizationValue: extra,
    amortizationStrategy: "PRAZO",
  });

  const sacPrestacao = calculateSac({
    financedAmount: input.financedAmount,
    interestRate: input.interestRate,
    termMonths: input.termMonths,
    extraAmortizationValue: extra,
    amortizationStrategy: "PRESTACAO",
  });

  const pricePrazo = calculatePrice({
    financedAmount: input.financedAmount,
    interestRate: input.interestRate,
    termMonths: input.termMonths,
    extraAmortizationValue: extra,
    amortizationStrategy: "PRAZO",
  });

  const pricePrestacao = calculatePrice({
    financedAmount: input.financedAmount,
    interestRate: input.interestRate,
    termMonths: input.termMonths,
    extraAmortizationValue: extra,
    amortizationStrategy: "PRESTACAO",
  });

  const sacRateUp = calculateSac({
    financedAmount: input.financedAmount,
    interestRate: input.interestRate + RATE_DELTA,
    termMonths: input.termMonths,
  });

  const sacRateDown = calculateSac({
    financedAmount: input.financedAmount,
    interestRate: Math.max(0.0001, input.interestRate - RATE_DELTA),
    termMonths: input.termMonths,
  });

  const consortiumFixo = calculateConsortium({
    creditValue: input.financedAmount,
    adminFee: input.adminFee,
    termMonths: input.termMonths,
    bidValue: input.bidValue,
    consortiumIndex: "FIXO",
  });

  const consortiumIncc = calculateConsortium({
    creditValue: input.financedAmount,
    adminFee: input.adminFee,
    termMonths: input.termMonths,
    bidValue: input.bidValue,
    consortiumIndex: "INCC",
  });

  const consortiumIpca = calculateConsortium({
    creditValue: input.financedAmount,
    adminFee: input.adminFee,
    termMonths: input.termMonths,
    bidValue: input.bidValue,
    consortiumIndex: "IPCA",
  });

  const scenarios: ScenarioResult[] = [
    {
      id: "sac-base",
      modality: "SAC",
      label: "SAC base",
      description: "Tabela SAC sem amortização extra",
      totalCost: sacBase.totalCost,
      firstInstallment: sacBase.firstInstallment,
      lastInstallment: sacBase.lastInstallment,
      savingsVsBaseline: 0,
    },
    {
      id: "sac-amort-prazo",
      modality: "SAC",
      label: "SAC com amortização no prazo",
      description: `Aporte mensal de R$${extra} reduzindo o prazo total`,
      totalCost: sacPrazo.totalCost,
      firstInstallment: sacPrazo.firstInstallment,
      lastInstallment: sacPrazo.lastInstallment,
      timeSavedMonths: sacPrazo.timeSavedMonths,
      savingsVsBaseline: Math.round((sacBase.totalCost - sacPrazo.totalCost) * 100) / 100,
    },
    {
      id: "sac-amort-prestacao",
      modality: "SAC",
      label: "SAC com amortização na prestação",
      description: `Aporte mensal de R$${extra} reduzindo o valor das parcelas`,
      totalCost: sacPrestacao.totalCost,
      firstInstallment: sacPrestacao.firstInstallment,
      lastInstallment: sacPrestacao.lastInstallment,
      timeSavedMonths: sacPrestacao.timeSavedMonths,
      savingsVsBaseline: Math.round((sacBase.totalCost - sacPrestacao.totalCost) * 100) / 100,
    },
    {
      id: "price-base",
      modality: "PRICE",
      label: "PRICE base",
      description: "Tabela PRICE sem amortização extra",
      totalCost: priceBase.totalCost,
      firstInstallment: priceBase.firstInstallment,
      lastInstallment: priceBase.lastInstallment,
      savingsVsBaseline: 0,
    },
    {
      id: "price-amort-prazo",
      modality: "PRICE",
      label: "PRICE com amortização no prazo",
      description: `Aporte mensal de R$${extra} reduzindo o prazo total`,
      totalCost: pricePrazo.totalCost,
      firstInstallment: pricePrazo.firstInstallment,
      lastInstallment: pricePrazo.lastInstallment,
      timeSavedMonths: pricePrazo.timeSavedMonths,
      savingsVsBaseline: Math.round((priceBase.totalCost - pricePrazo.totalCost) * 100) / 100,
    },
    {
      id: "price-amort-prestacao",
      modality: "PRICE",
      label: "PRICE com amortização na prestação",
      description: `Aporte mensal de R$${extra} reduzindo o valor das parcelas`,
      totalCost: pricePrestacao.totalCost,
      firstInstallment: pricePrestacao.firstInstallment,
      lastInstallment: pricePrestacao.lastInstallment,
      timeSavedMonths: pricePrestacao.timeSavedMonths,
      savingsVsBaseline: Math.round((priceBase.totalCost - pricePrestacao.totalCost) * 100) / 100,
    },
    {
      id: "sac-taxa-mais",
      modality: "SAC",
      label: "SAC com juros +0,1% a.m.",
      description: "Sensibilidade do SAC a um aumento de 0,1% ao mês na taxa",
      totalCost: sacRateUp.totalCost,
      firstInstallment: sacRateUp.firstInstallment,
      lastInstallment: sacRateUp.lastInstallment,
      savingsVsBaseline: Math.round((sacBase.totalCost - sacRateUp.totalCost) * 100) / 100,
    },
    {
      id: "sac-taxa-menos",
      modality: "SAC",
      label: "SAC com juros -0,1% a.m.",
      description: "Sensibilidade do SAC a uma redução de 0,1% ao mês na taxa",
      totalCost: sacRateDown.totalCost,
      firstInstallment: sacRateDown.firstInstallment,
      lastInstallment: sacRateDown.lastInstallment,
      savingsVsBaseline: Math.round((sacBase.totalCost - sacRateDown.totalCost) * 100) / 100,
    },
    {
      id: "consorcio-fixo",
      modality: "CONSORTIUM",
      label: "Consórcio sem reajuste",
      description: "Consórcio com índice fixo, sem reajuste anual",
      totalCost: consortiumFixo.totalCost,
      firstInstallment: consortiumFixo.monthlyPayment,
      lastInstallment: consortiumFixo.monthlyPayment,
      savingsVsBaseline: 0,
    },
    {
      id: "consorcio-incc",
      modality: "CONSORTIUM",
      label: "Consórcio com INCC",
      description: "Consórcio reajustado pelo INCC (estimativa 6% a.a.)",
      totalCost: consortiumIncc.totalCost,
      firstInstallment: consortiumIncc.monthlyPayment,
      lastInstallment: consortiumIncc.monthlyPayment,
      savingsVsBaseline: Math.round((consortiumFixo.totalCost - consortiumIncc.totalCost) * 100) / 100,
    },
    {
      id: "consorcio-ipca",
      modality: "CONSORTIUM",
      label: "Consórcio com IPCA",
      description: "Consórcio reajustado pelo IPCA (estimativa 4,5% a.a.)",
      totalCost: consortiumIpca.totalCost,
      firstInstallment: consortiumIpca.monthlyPayment,
      lastInstallment: consortiumIpca.monthlyPayment,
      savingsVsBaseline: Math.round((consortiumFixo.totalCost - consortiumIpca.totalCost) * 100) / 100,
    },
  ];

  const amortizationImpactSac = Math.round(
    Math.max(sacBase.totalCost - sacPrazo.totalCost, sacBase.totalCost - sacPrestacao.totalCost) * 100,
  ) / 100;

  const amortizationImpactPrice = Math.round(
    Math.max(priceBase.totalCost - pricePrazo.totalCost, priceBase.totalCost - pricePrestacao.totalCost) * 100,
  ) / 100;

  const sacBestStrategyCost = Math.min(sacPrazo.totalCost, sacPrestacao.totalCost);
  const priceBestStrategyCost = Math.min(pricePrazo.totalCost, pricePrestacao.totalCost);

  const bestAmortizationStrategy: ScenariosInsights["bestAmortizationStrategy"] =
    amortizationImpactSac === 0 && amortizationImpactPrice === 0
      ? "NENHUMA"
      : sacPrazo.totalCost <= sacPrestacao.totalCost &&
          pricePrazo.totalCost <= pricePrestacao.totalCost
        ? "PRAZO"
        : "PRESTACAO";

  const bestAmortizationModality: ScenariosInsights["bestAmortizationModality"] =
    Math.abs(sacBestStrategyCost - priceBestStrategyCost) < 1
      ? "EMPATE"
      : sacBestStrategyCost < priceBestStrategyCost
        ? "SAC"
        : "PRICE";

  const rateSensitivity = Math.round((sacRateUp.totalCost - sacRateDown.totalCost) * 100) / 100;

  const consortiumIndexImpact = Math.round(
    Math.max(
      consortiumIncc.totalCost - consortiumFixo.totalCost,
      consortiumIpca.totalCost - consortiumFixo.totalCost,
    ) * 100,
  ) / 100;

  return {
    scenarios,
    insights: {
      amortizationImpactSac,
      amortizationImpactPrice,
      bestAmortizationStrategy,
      bestAmortizationModality,
      rateSensitivity,
      consortiumIndexImpact,
    },
  };
}
