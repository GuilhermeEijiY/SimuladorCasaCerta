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
}

export interface FinancingResult {
  id: string;
  financingType: string;
  financedAmount: string;
  firstInstallment: string;
  lastInstallment: string;
  totalCost: string;
  totalInterest: string;
}

export interface ConsortiumResult {
  id: string;
  creditValue: string;
  monthlyPayment: string;
  adminFeeTotal: string;
  bidValue: string;
  estimatedContemplation: number;
  totalCost: string;
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

export interface Simulation {
  id: string;
  propertyValue: string;
  downPayment: string;
  monthlyIncome: string;
  objective: string;
  urgency: string;
  createdAt: string;
  financingResults: FinancingResult[];
  consortiumResult: ConsortiumResult;
  recommendation: Recommendation;
}

export async function createSimulation(input: SimulationInput) {
  const { data } = await api.post<{ simulation: Simulation }>("/simulations", input);
  return data.simulation;
}

export async function listSimulations() {
  const { data } = await api.get<{ simulations: Simulation[] }>("/simulations");
  return data.simulations;
}
