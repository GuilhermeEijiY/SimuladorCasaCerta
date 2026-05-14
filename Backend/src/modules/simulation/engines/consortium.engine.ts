export interface ConsortiumInput {
  creditValue: number;
  adminFee: number;
  termMonths: number;
  bidValue: number;
}

export interface ConsortiumOutput {
  monthlyPayment: number;
  totalCost: number;
  adminFeeTotal: number;
  estimatedContemplation: number;
}

export function calculateConsortium(input: ConsortiumInput): ConsortiumOutput {
  const { creditValue, adminFee, termMonths, bidValue } = input;

  const basePayment = creditValue / termMonths;
  const adminFeeMonthly = creditValue * adminFee;
  const reserveFund = (creditValue * 0.01) / termMonths;
  const monthlyPayment = basePayment + adminFeeMonthly + reserveFund;

  const adminFeeTotal = adminFeeMonthly * termMonths;
  const totalCost = monthlyPayment * termMonths;

  const contemplationRatio = 1 - bidValue / creditValue;
  const estimatedContemplation = Math.max(3, Math.round(termMonths * contemplationRatio));

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    adminFeeTotal: Math.round(adminFeeTotal * 100) / 100,
    estimatedContemplation,
  };
}
