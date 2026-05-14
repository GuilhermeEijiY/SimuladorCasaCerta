export interface PriceInput {
  financedAmount: number;
  interestRate: number;
  termMonths: number;
}

export interface PriceOutput {
  fixedInstallment: number;
  totalCost: number;
  totalInterest: number;
}

export function calculatePrice(input: PriceInput): PriceOutput {
  const { financedAmount, interestRate, termMonths } = input;

  const factor = Math.pow(1 + interestRate, termMonths);
  const fixedInstallment = financedAmount * (interestRate * factor) / (factor - 1);

  const totalCost = fixedInstallment * termMonths;
  const totalInterest = totalCost - financedAmount;

  return {
    fixedInstallment: Math.round(fixedInstallment * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}
