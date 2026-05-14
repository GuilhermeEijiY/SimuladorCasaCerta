export interface SacInput {
  financedAmount: number;
  interestRate: number;
  termMonths: number;
}

export interface SacOutput {
  firstInstallment: number;
  lastInstallment: number;
  totalCost: number;
  totalInterest: number;
}

export function calculateSac(input: SacInput): SacOutput {
  const { financedAmount, interestRate, termMonths } = input;

  const amortization = financedAmount / termMonths;
  let totalCost = 0;
  let totalInterest = 0;
  let balance = financedAmount;
  let firstInstallment = 0;
  let lastInstallment = 0;

  for (let k = 1; k <= termMonths; k++) {
    const interest = balance * interestRate;
    const installment = amortization + interest;

    totalInterest += interest;
    totalCost += installment;
    balance -= amortization;

    if (k === 1) firstInstallment = installment;
    if (k === termMonths) lastInstallment = installment;
  }

  return {
    firstInstallment: Math.round(firstInstallment * 100) / 100,
    lastInstallment: Math.round(lastInstallment * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}
