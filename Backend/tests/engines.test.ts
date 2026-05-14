import { calculateSac } from "../src/modules/simulation/engines/financing-sac.engine";
import { calculatePrice } from "../src/modules/simulation/engines/financing-price.engine";
import { calculateConsortium } from "../src/modules/simulation/engines/consortium.engine";
import { calculateRecommendation } from "../src/modules/simulation/engines/recommendation.engine";

describe("Engine SAC", () => {
  it("deve calcular financiamento SAC corretamente", () => {
    const result = calculateSac({
      financedAmount: 280000,
      interestRate: 0.0095,
      termMonths: 360,
    });

    expect(result.firstInstallment).toBeGreaterThan(result.lastInstallment);
    expect(result.totalCost).toBeGreaterThan(280000);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.firstInstallment).toBeCloseTo(3437.78, 0);
  });

  it("deve ter última parcela menor que a primeira", () => {
    const result = calculateSac({
      financedAmount: 200000,
      interestRate: 0.01,
      termMonths: 240,
    });

    expect(result.lastInstallment).toBeLessThan(result.firstInstallment);
  });
});

describe("Engine PRICE", () => {
  it("deve calcular financiamento PRICE corretamente", () => {
    const result = calculatePrice({
      financedAmount: 280000,
      interestRate: 0.0095,
      termMonths: 360,
    });

    expect(result.fixedInstallment).toBeGreaterThan(0);
    expect(result.totalCost).toBeGreaterThan(280000);
    expect(result.totalInterest).toBe(result.totalCost - 280000);
  });

  it("deve ter custo total maior que SAC para mesmos inputs", () => {
    const inputs = { financedAmount: 280000, interestRate: 0.0095, termMonths: 360 };
    const sac = calculateSac(inputs);
    const price = calculatePrice(inputs);

    expect(price.totalCost).toBeGreaterThan(sac.totalCost);
  });
});

describe("Engine Consórcio", () => {
  it("deve calcular consórcio corretamente", () => {
    const result = calculateConsortium({
      creditValue: 280000,
      adminFee: 0.0018,
      termMonths: 200,
      bidValue: 30000,
    });

    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.adminFeeTotal).toBeGreaterThan(0);
    expect(result.estimatedContemplation).toBeGreaterThanOrEqual(3);
  });

  it("deve reduzir contemplação com lance maior", () => {
    const semLance = calculateConsortium({
      creditValue: 280000,
      adminFee: 0.0018,
      termMonths: 200,
      bidValue: 0,
    });

    const comLance = calculateConsortium({
      creditValue: 280000,
      adminFee: 0.0018,
      termMonths: 200,
      bidValue: 50000,
    });

    expect(comLance.estimatedContemplation).toBeLessThan(semLance.estimatedContemplation);
  });
});

describe("Engine Recomendação", () => {
  const sac = calculateSac({ financedAmount: 280000, interestRate: 0.0095, termMonths: 360 });
  const price = calculatePrice({ financedAmount: 280000, interestRate: 0.0095, termMonths: 360 });
  const consortium = calculateConsortium({ creditValue: 280000, adminFee: 0.0018, termMonths: 200, bidValue: 30000 });

  it("deve recomendar financiamento quando urgência é alta", () => {
    const result = calculateRecommendation({
      sac,
      price,
      consortium,
      monthlyIncome: 8000,
      urgency: "ALTA",
    });

    expect(result.recommendedOption).toContain("FINANCING");
    expect(result.scoreFinancing).toBeGreaterThan(0);
    expect(result.reason).toBeTruthy();
  });

  it("deve favorecer consórcio quando urgência é baixa e custo é menor", () => {
    const result = calculateRecommendation({
      sac,
      price,
      consortium,
      monthlyIncome: 8000,
      urgency: "BAIXA",
    });

    expect(result.scoreConsortium).toBeGreaterThan(0);
    expect(result.savingsEstimate).toBeGreaterThan(0);
  });

  it("deve sempre gerar justificativa textual", () => {
    const result = calculateRecommendation({
      sac,
      price,
      consortium,
      monthlyIncome: 12000,
      urgency: "MEDIA",
    });

    expect(result.reason.length).toBeGreaterThan(20);
  });
});
