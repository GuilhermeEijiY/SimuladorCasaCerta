import { z } from "zod";

export const createSimulationSchema = z.object({
  propertyValue: z.number().positive(),
  downPayment: z.number().min(0),
  monthlyIncome: z.number().positive(),
  interestRate: z.number().positive(),
  termMonths: z.number().int().positive(),
  adminFee: z.number().positive(),
  bidValue: z.number().min(0).default(0),
  objective: z.enum(["MORADIA", "INVESTIMENTO", "MUDANCA"]),
  urgency: z.enum(["BAIXA", "MEDIA", "ALTA"]),
  extraAmortizationValue: z.number().min(0).default(0),
  amortizationStrategy: z
    .enum(["PRAZO", "PRESTACAO", "NENHUM"])
    .default("NENHUM"),
  consortiumIndex: z.enum(["INCC", "IPCA", "FIXO"]).default("FIXO"),
});

export type CreateSimulationDto = z.infer<typeof createSimulationSchema>;
