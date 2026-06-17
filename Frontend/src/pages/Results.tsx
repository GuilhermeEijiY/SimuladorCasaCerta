import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Simulation } from "../api/simulation.api";
import { Button } from "../components/ui/Button";
import { generatePdf } from "../utils/generate-pdf";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function currency(value: string | number) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const STRATEGY_LABEL: Record<string, string> = {
  PRAZO: "Reduzir prazo",
  PRESTACAO: "Reduzir prestação",
  NENHUMA: "Nenhuma",
};

const MODALITY_LABEL: Record<string, string> = {
  SAC: "SAC",
  PRICE: "PRICE",
  CONSORTIUM: "Consórcio",
  EMPATE: "Empate",
};

const FACTOR_BADGE: Record<string, string> = {
  FINANCIAMENTO: "bg-blue-50 text-blue-700",
  CONSORCIO: "bg-teal-50 text-teal-700",
  NEUTRO: "bg-gray-100 text-gray-600",
};

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const simulation = location.state?.simulation as Simulation | undefined;

  if (!simulation) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Nenhuma simulação encontrada.</p>
          <Button onClick={() => navigate("/simulacao")}>
            Fazer Simulação
          </Button>
        </div>
      </div>
    );
  }

  const sac = simulation.financingResults.find(
    (r) => r.financingType === "SAC"
  )!;
  const price = simulation.financingResults.find(
    (r) => r.financingType === "PRICE"
  )!;
  const consortium = simulation.consortiumResult;
  const rec = simulation.recommendation;
  const isRecommended = (option: string) => rec.recommendedOption === option;

  const chartData = simulation.chartData || [];

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resultado da Simulação
        </h1>
        <p className="text-gray-500 mb-8">
          Imóvel de {currency(simulation.propertyValue || 0)} com entrada de{" "}
          {currency(simulation.downPayment || 0)}
        </p>

        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-3xl">&#9733;</span>
            <div>
              <h2 className="text-lg font-bold text-emerald-800 mb-1">
                Recomendação:{" "}
                {rec.recommendedOption
                  .replace("FINANCING_", "Financiamento ")
                  .replace("CONSORTIUM", "Consórcio")}
              </h2>
              <p className="text-emerald-700">{rec.reason}</p>
              <p className="text-sm text-emerald-600 mt-2">
                Economia estimada: {currency(rec.savingsEstimate || 0)}
              </p>
            </div>
          </div>
        </div>

        {rec.aiReason && (
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">&#129302;</span>
              <h3 className="text-lg font-bold text-gray-900">
                Análise do Consultor IA
              </h3>
            </div>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {rec.aiReason}
            </div>
          </div>
        )}

        {/* BLOCO NOVO: GRÁFICO COMPARATIVO */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Evolução do Custo Acumulado
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Meses",
                      position: "insideBottomRight",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    tickFormatter={(val) => `R$ ${val / 1000}k`}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: any) => currency(value)}
                    labelFormatter={(label) => `Mês ${label}`}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="sac"
                    name="Financiamento SAC"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    name="Financiamento PRICE"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="consortium"
                    name="Consórcio"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(sac.timeSavedMonths || consortium.readjustmentEstimate) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {sac.timeSavedMonths ? (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl shadow-sm">
                <h4 className="font-bold text-blue-900 text-lg">
                  Impacto da Amortização
                </h4>
                <p className="text-sm text-blue-800 mt-2">
                  Com os pagamentos extras, você quitará o financiamento SAC{" "}
                  <strong>{sac.timeSavedMonths} meses mais cedo</strong>.
                </p>
                <p className="text-sm text-blue-800 font-semibold mt-1">
                  Economia de juros estimada:{" "}
                  {currency(sac.savingsWithAmortization || 0)}
                </p>
              </div>
            ) : (
              <div />
            )}

            {consortium.readjustmentEstimate ? (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-r-xl shadow-sm">
                <h4 className="font-bold text-orange-900 text-lg">
                  Previsão de Reajuste (INCC/IPCA)
                </h4>
                <p className="text-sm text-orange-800 mt-2">
                  Considerando o índice escolhido, o valor final estimado do
                  consórcio subirá para{" "}
                  <strong>{currency(consortium.readjustmentEstimate)}</strong>{" "}
                  ao longo do tempo.
                </p>
              </div>
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
              isRecommended("FINANCING_SAC")
                ? "border-emerald-500"
                : "border-gray-100"
            }`}
          >
            {isRecommended("FINANCING_SAC") && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-3 inline-block">
                MELHOR OPÇÃO
              </span>
            )}
            <h3 className="text-xl font-bold text-blue-600 mb-4">
              Financiamento SAC
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Primeira parcela</span>
                <span className="font-semibold">
                  {currency(sac.firstInstallment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Última parcela</span>
                <span className="font-semibold">
                  {currency(sac.lastInstallment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total de juros</span>
                <span className="font-semibold text-red-500">
                  {currency(sac.totalInterest)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700 font-medium">Custo total</span>
                <span className="font-bold text-lg">
                  {currency(sac.totalCost)}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
              isRecommended("FINANCING_PRICE")
                ? "border-emerald-500"
                : "border-gray-100"
            }`}
          >
            {isRecommended("FINANCING_PRICE") && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-3 inline-block">
                MELHOR OPÇÃO
              </span>
            )}
            <h3 className="text-xl font-bold text-indigo-600 mb-4">
              Financiamento PRICE
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Parcela fixa</span>
                <span className="font-semibold">
                  {currency(price.firstInstallment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Última parcela</span>
                <span className="font-semibold">
                  {currency(price.lastInstallment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total de juros</span>
                <span className="font-semibold text-red-500">
                  {currency(price.totalInterest)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700 font-medium">Custo total</span>
                <span className="font-bold text-lg">
                  {currency(price.totalCost)}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
              isRecommended("CONSORTIUM")
                ? "border-emerald-500"
                : "border-gray-100"
            }`}
          >
            {isRecommended("CONSORTIUM") && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-3 inline-block">
                MELHOR OPÇÃO
              </span>
            )}
            <h3 className="text-xl font-bold text-teal-600 mb-4">Consórcio</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Parcela mensal</span>
                <span className="font-semibold">
                  {currency(consortium.monthlyPayment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taxa adm. total</span>
                <span className="font-semibold">
                  {currency(consortium.adminFeeTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contemplação est.</span>
                <span className="font-semibold">
                  {consortium.estimatedContemplation} meses
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700 font-medium">Custo total</span>
                <span className="font-bold text-lg">
                  {currency(consortium.totalCost)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {simulation.recommendationFactors &&
          simulation.recommendationFactors.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fatores da Decisão
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {simulation.decisiveFactor ? (
                  <>
                    Fator decisivo:{" "}
                    <span className="font-semibold text-gray-700">
                      {simulation.decisiveFactor}
                    </span>
                  </>
                ) : (
                  "Pontuação por dimensão de avaliação."
                )}
              </p>
              <div className="space-y-5">
                {simulation.recommendationFactors.map((f) => {
                  const total = f.scoreFinancing + f.scoreConsortium || 1;
                  const finPct = (f.scoreFinancing / total) * 100;
                  const isDecisive = simulation.decisiveFactor === f.name;
                  return (
                    <div key={f.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${
                              isDecisive ? "text-emerald-700" : "text-gray-800"
                            }`}
                          >
                            {f.name}
                            {isDecisive && (
                              <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                DECISIVO
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-gray-400">
                            peso {Math.round(f.weight * 100)}%
                          </span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            FACTOR_BADGE[f.favors] ?? FACTOR_BADGE.NEUTRO
                          }`}
                        >
                          {f.favors === "FINANCIAMENTO"
                            ? "favorece financiamento"
                            : f.favors === "CONSORCIO"
                            ? "favorece consórcio"
                            : "neutro"}
                        </span>
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
                        <div
                          className="bg-blue-500"
                          style={{ width: `${finPct}%` }}
                          title={`Financiamento: ${f.scoreFinancing.toFixed(0)}`}
                        />
                        <div
                          className="bg-teal-500"
                          style={{ width: `${100 - finPct}%` }}
                          title={`Consórcio: ${f.scoreConsortium.toFixed(0)}`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        {f.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {simulation.scenarios && simulation.scenarios.scenarios.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Cenários Alternativos
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Compare estratégias de amortização, sensibilidade à taxa de juros
              e reajuste do consórcio.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-700 font-medium uppercase">
                  Amortização no SAC pode economizar até
                </p>
                <p className="text-lg font-bold text-blue-900 mt-1">
                  {currency(simulation.scenarios.insights.amortizationImpactSac)}
                </p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-xs text-indigo-700 font-medium uppercase">
                  Amortização no PRICE pode economizar até
                </p>
                <p className="text-lg font-bold text-indigo-900 mt-1">
                  {currency(
                    simulation.scenarios.insights.amortizationImpactPrice
                  )}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <p className="text-xs text-emerald-700 font-medium uppercase">
                  Melhor estratégia
                </p>
                <p className="text-lg font-bold text-emerald-900 mt-1">
                  {STRATEGY_LABEL[
                    simulation.scenarios.insights.bestAmortizationStrategy
                  ] ??
                    simulation.scenarios.insights.bestAmortizationStrategy}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Modalidade:{" "}
                  {MODALITY_LABEL[
                    simulation.scenarios.insights.bestAmortizationModality
                  ] ??
                    simulation.scenarios.insights.bestAmortizationModality}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-purple-700 font-medium uppercase">
                  Sensibilidade à taxa (±0,1%)
                </p>
                <p className="text-lg font-bold text-purple-900 mt-1">
                  {currency(simulation.scenarios.insights.rateSensitivity)}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-xs text-orange-700 font-medium uppercase">
                  Impacto do reajuste no consórcio
                </p>
                <p className="text-lg font-bold text-orange-900 mt-1">
                  {currency(
                    simulation.scenarios.insights.consortiumIndexImpact
                  )}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
                    <th className="py-2 pr-4 font-medium">Cenário</th>
                    <th className="py-2 pr-4 font-medium">Modalidade</th>
                    <th className="py-2 pr-4 font-medium text-right">
                      Custo total
                    </th>
                    <th className="py-2 pr-4 font-medium text-right">
                      Economia vs base
                    </th>
                    <th className="py-2 font-medium text-right">
                      Tempo economizado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {simulation.scenarios.scenarios.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 pr-4">
                        <div className="font-medium text-gray-800">
                          {s.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {s.description}
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-gray-600">
                        {MODALITY_LABEL[s.modality] ?? s.modality}
                      </td>
                      <td className="py-2 pr-4 text-right font-semibold text-gray-800">
                        {currency(s.totalCost)}
                      </td>
                      <td
                        className={`py-2 pr-4 text-right font-semibold ${
                          s.savingsVsBaseline > 0
                            ? "text-emerald-600"
                            : s.savingsVsBaseline < 0
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        {s.savingsVsBaseline === 0
                          ? "—"
                          : currency(s.savingsVsBaseline)}
                      </td>
                      <td className="py-2 text-right text-gray-600">
                        {s.timeSavedMonths
                          ? `${s.timeSavedMonths} meses`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate("/simulacao")} variant="secondary">
            Nova Simulação
          </Button>
          <Button onClick={() => generatePdf(simulation)}>Exportar PDF</Button>
        </div>
      </div>
    </div>
  );
}
