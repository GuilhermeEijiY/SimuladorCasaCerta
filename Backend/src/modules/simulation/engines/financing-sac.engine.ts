export interface SacInput {
  financedAmount: number;
  interestRate: number;
  termMonths: number;
  extraAmortizationValue?: number;
  amortizationStrategy?: "PRAZO" | "PRESTACAO" | "NENHUM";
}

export interface MonthlyData {
  month: number;
  accumulatedCost: number;
}

export interface SacOutput {
  firstInstallment: number;
  lastInstallment: number;
  totalCost: number;
  totalInterest: number;
  timeSavedMonths?: number;
  savingsWithAmortization?: number;
  monthlyData: MonthlyData[];
}

export function calculateSac(input: SacInput): SacOutput {
  const {
    financedAmount,
    interestRate,
    termMonths,
    extraAmortizationValue = 0,
    amortizationStrategy = "NENHUM",
  } = input;

  let amortization = financedAmount / termMonths;
  let totalCost = 0;
  let totalInterest = 0;
  let balance = financedAmount;
  let firstInstallment = 0;
  let lastInstallment = 0;
  let actualMonths = 0;
  const monthlyData: MonthlyData[] = [{ month: 0, accumulatedCost: 0 }];

  const baseTotalInterest =
    (financedAmount * interestRate * (termMonths + 1)) / 2;

  for (let k = 1; k <= termMonths; k++) {
    if (balance <= 0.01) break;

    const interest = balance * interestRate;
    let installment = amortization + interest;

    let currentExtra = 0;
    if (amortizationStrategy !== "NENHUM" && extraAmortizationValue > 0) {
      currentExtra = Math.min(extraAmortizationValue, balance - amortization);
      if (currentExtra < 0) currentExtra = 0;
    }

    totalInterest += interest;
    totalCost += installment + currentExtra;
    balance -= amortization + currentExtra;
    actualMonths++;

    if (k === 1) firstInstallment = installment;
    lastInstallment = installment;

    monthlyData.push({
      month: actualMonths,
      accumulatedCost: Math.round(totalCost * 100) / 100,
    });

    if (amortizationStrategy === "PRESTACAO" && balance > 0) {
      amortization = balance / (termMonths - actualMonths);
    }
  }

  const timeSavedMonths = termMonths - actualMonths;
  const savingsWithAmortization = baseTotalInterest - totalInterest;

  for (let i = actualMonths + 1; i <= termMonths; i++) {
    monthlyData.push({
      month: i,
      accumulatedCost: Math.round(totalCost * 100) / 100,
    });
  }

  return {
    firstInstallment: Math.round(firstInstallment * 100) / 100,
    lastInstallment: Math.round(lastInstallment * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    timeSavedMonths: timeSavedMonths > 0 ? timeSavedMonths : undefined,
    savingsWithAmortization:
      savingsWithAmortization > 0
        ? Math.round(savingsWithAmortization * 100) / 100
        : undefined,
    monthlyData,
  };
}
