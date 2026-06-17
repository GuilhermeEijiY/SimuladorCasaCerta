export interface ConsortiumInput {
  creditValue: number;
  adminFee: number;
  termMonths: number;
  bidValue: number;
  consortiumIndex?: "INCC" | "IPCA" | "FIXO";
}

export interface MonthlyData {
  month: number;
  accumulatedCost: number;
}

export interface ConsortiumOutput {
  monthlyPayment: number;
  totalCost: number;
  adminFeeTotal: number;
  estimatedContemplation: number;
  readjustmentEstimate?: number;
  monthlyData: MonthlyData[];
}

export function calculateConsortium(input: ConsortiumInput): ConsortiumOutput {
  const {
    creditValue,
    adminFee,
    termMonths,
    bidValue,
    consortiumIndex = "FIXO",
  } = input;

  const basePayment = creditValue / termMonths;
  const adminFeeMonthly = creditValue * adminFee;
  const reserveFund = (creditValue * 0.01) / termMonths;
  let monthlyPayment = basePayment + adminFeeMonthly + reserveFund;

  let totalCost = 0;
  const monthlyData: MonthlyData[] = [{ month: 0, accumulatedCost: 0 }];

  const annualAdjustment =
    consortiumIndex === "INCC" ? 0.06 : consortiumIndex === "IPCA" ? 0.045 : 0;
  const originalTotalCost = monthlyPayment * termMonths;

  for (let k = 1; k <= termMonths; k++) {
    if (k > 1 && (k - 1) % 12 === 0 && annualAdjustment > 0) {
      monthlyPayment = monthlyPayment * (1 + annualAdjustment);
    }

    totalCost += monthlyPayment;
    monthlyData.push({
      month: k,
      accumulatedCost: Math.round(totalCost * 100) / 100,
    });
  }

  const adminFeeTotal = adminFeeMonthly * termMonths;
  const contemplationRatio = 1 - bidValue / creditValue;
  const estimatedContemplation = Math.max(
    3,
    Math.round(termMonths * contemplationRatio)
  );

  const readjustmentEstimate =
    totalCost > originalTotalCost ? totalCost : undefined;

  return {
    monthlyPayment: Math.round(basePayment + adminFeeMonthly + reserveFund),
    totalCost: Math.round(totalCost * 100) / 100,
    adminFeeTotal: Math.round(adminFeeTotal * 100) / 100,
    estimatedContemplation,
    readjustmentEstimate: readjustmentEstimate
      ? Math.round(readjustmentEstimate * 100) / 100
      : undefined,
    monthlyData,
  };
}
