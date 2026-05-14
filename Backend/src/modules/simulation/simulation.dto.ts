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
});

export type CreateSimulationDto = z.infer<typeof createSimulationSchema>;
