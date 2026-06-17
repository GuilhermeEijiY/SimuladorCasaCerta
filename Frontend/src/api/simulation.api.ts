import { api } from "./client";

export interface SimulationInput {
  propertyValue: number;
  downPayment: number;
  monthlyIncome: number;
  interestRate: number;
  termMonths: number;
  adminFee: number;
  bidValue: number;
  objective: "MORADIA" | "INVESTIMENTO" | "MUDANCA";
  urgency: "BAIXA" | "MEDIA" | "ALTA";
  extraAmortizationValue?: number;
  amortizationStrategy?: "PRAZO" | "PRESTACAO" | "NENHUM";
  consortiumIndex?: "INCC" | "IPCA" | "FIXO";
}

export interface ChartDataPoint {
  month: number;
  sac: number;
  price: number;
  consortium: number;
}

export interface FinancingResult {
  id: string;
  financingType: string;
  financedAmount: string;
  firstInstallment: string;
  lastInstallment: string;
  totalCost: string;
  totalInterest: string;
  timeSavedMonths?: number;
  savingsWithAmortization?: string;
}

export interface ConsortiumResult {
  id: string;
  creditValue: string;
  monthlyPayment: string;
  adminFeeTotal: string;
  bidValue: string;
  estimatedContemplation: number;
  totalCost: string;
  readjustmentEstimate?: string;
}

export interface Recommendation {
  id: string;
  recommendedOption: string;
  reason: string;
  aiReason: string | null;
  scoreFinancing: string;
  scoreConsortium: string;
  savingsEstimate: string;
}

export interface RecommendationFactor {
  name: string;
  weight: number;
  scoreFinancing: number;
  scoreConsortium: number;
  favors: "FINANCIAMENTO" | "CONSORCIO" | "NEUTRO";
  explanation: string;
}

export interface Scenario {
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

export interface ScenariosBlock {
  scenarios: Scenario[];
  insights: ScenariosInsights;
}

export interface Simulation {
  id: string;
  propertyValue: string;
  downPayment: string;
  monthlyIncome: string;
  termMonths: number;
  objective: string;
  urgency: string;
  createdAt: string;
  financingResults: FinancingResult[];
  consortiumResult: ConsortiumResult;
  recommendation: Recommendation;
  chartData?: ChartDataPoint[];
  scenarios?: ScenariosBlock;
  recommendationFactors?: RecommendationFactor[];
  decisiveFactor?: string;
}

export async function createSimulation(input: SimulationInput) {
  const { data } = await api.post<{ simulation: Simulation }>(
    "/simulations",
    input
  );
  return data.simulation;
}

export async function listSimulations() {
  const { data } = await api.get<{ simulations: Simulation[] }>("/simulations");
  return data.simulations;
}
