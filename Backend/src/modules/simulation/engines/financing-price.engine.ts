export interface PriceInput {
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

export interface PriceOutput {
  firstInstallment: number;
  fixedInstallment: number;
  lastInstallment: number;
  totalCost: number;
  totalInterest: number;
  timeSavedMonths?: number;
  savingsWithAmortization?: number;
  monthlyData: MonthlyData[];
}

export function calculatePrice(input: PriceInput): PriceOutput {
  const {
    financedAmount,
    interestRate,
    termMonths,
    extraAmortizationValue = 0,
    amortizationStrategy = "NENHUM",
  } = input;

  const baseFactor = Math.pow(1 + interestRate, termMonths);
  const baseInstallment =
    (financedAmount * interestRate * baseFactor) / (baseFactor - 1);
  const baseTotalCost = baseInstallment * termMonths;

  let installment = baseInstallment;
  let balance = financedAmount;
  let totalCost = 0;
  let totalInterest = 0;
  let firstInstallment = installment;
  let lastInstallment = installment;
  let actualMonths = 0;

  const monthlyData: MonthlyData[] = [{ month: 0, accumulatedCost: 0 }];

  for (let k = 1; k <= termMonths; k++) {
    if (balance <= 0.01) break;

    const interest = balance * interestRate;
    let amortization = installment - interest;

    if (amortization > balance) {
      amortization = balance;
      installment = amortization + interest;
    }

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

    if (amortizationStrategy === "PRESTACAO" && balance > 0.01) {
      const remainingMonths = termMonths - actualMonths;
      if (remainingMonths > 0) {
        const newFactor = Math.pow(1 + interestRate, remainingMonths);
        installment = (balance * interestRate * newFactor) / (newFactor - 1);
      }
    }
  }

  const timeSavedMonths = termMonths - actualMonths;
  const savingsWithAmortization = baseTotalCost - totalCost;

  for (let i = actualMonths + 1; i <= termMonths; i++) {
    monthlyData.push({
      month: i,
      accumulatedCost: Math.round(totalCost * 100) / 100,
    });
  }

  return {
    firstInstallment: Math.round(firstInstallment * 100) / 100,
    fixedInstallment: Math.round(baseInstallment * 100) / 100,
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
