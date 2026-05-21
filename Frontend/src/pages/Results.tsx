import { useLocation, useNavigate } from "react-router-dom";
import { Simulation } from "../api/simulation.api";
import { Button } from "../components/ui/Button";
import { generatePdf } from "../utils/generate-pdf";

function currency(value: string | number) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const simulation = location.state?.simulation as Simulation | undefined;

  if (!simulation) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Nenhuma simulação encontrada.</p>
          <Button onClick={() => navigate("/simulacao")}>Fazer Simulação</Button>
        </div>
      </div>
    );
  }

  const sac = simulation.financingResults.find((r) => r.financingType === "SAC")!;
  const price = simulation.financingResults.find((r) => r.financingType === "PRICE")!;
  const consortium = simulation.consortiumResult;
  const rec = simulation.recommendation;
  const isRecommended = (option: string) => rec.recommendedOption === option;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultado da Simulação</h1>
        <p className="text-gray-500 mb-8">
          Imóvel de {currency(simulation.propertyValue)} com entrada de {currency(simulation.downPayment)}
        </p>

        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-3xl">&#9733;</span>
            <div>
              <h2 className="text-lg font-bold text-emerald-800 mb-1">
                Recomendação: {rec.recommendedOption.replace("FINANCING_", "Financiamento ").replace("CONSORTIUM", "Consórcio")}
              </h2>
              <p className="text-emerald-700">{rec.reason}</p>
              <p className="text-sm text-emerald-600 mt-2">
                Economia estimada: {currency(rec.savingsEstimate)}
              </p>
            </div>
          </div>
        </div>

        {rec.aiReason && (
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">&#129302;</span>
              <h3 className="text-lg font-bold text-gray-900">Análise do Consultor IA</h3>
            </div>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {rec.aiReason}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`bg-white rounded-xl shadow-sm p-6 border-2 ${isRecommended("FINANCING_SAC") ? "border-emerald-500" : "border-gray-100"}`}>
            {isRecommended("FINANCING_SAC") && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-3 inline-block">MELHOR OPÇÃO</span>
            )}
            <h3 className="text-xl font-bold text-blue-600 mb-4">Financiamento SAC</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Primeira parcela</span>
                <span className="font-semibold">{currency(sac.firstInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Última parcela</span>
                <span className="font-semibold">{currency(sac.lastInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total de juros</span>
                <span className="font-semibold text-red-500">{currency(sac.totalInterest)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700 font-medium">Custo total</span>
                <span className="font-bold text-lg">{currency(sac.totalCost)}</span>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm p-6 border-2 ${isRecommended("FINANCING_PRICE") ? "border-emerald-500" : "border-gray-100"}`}>
            {isRecommended("FINANCING_PRICE") && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-3 inline-block">MELHOR OPÇÃO</span>
            )}
            <h3 className="text-xl font-bold text-indigo-600 mb-4">Financiamento PRICE</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Parcela fixa</span>
                <span className="font-semibold">{currency(price.firstInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Última parcela</span>
                <span className="font-semibold">{currency(price.lastInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total de juros</span>
                <span className="font-semibold text-red-500">{currency(price.totalInterest)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700 font-medium">Custo total</span>
                <span className="font-bold text-lg">{currency(price.totalCost)}</span>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm p-6 border-2 ${isRecommended("CONSORTIUM") ? "border-emerald-500" : "border-gray-100"}`}>
            {isRecommended("CONSORTIUM") && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-3 inline-block">MELHOR OPÇÃO</span>
            )}
            <h3 className="text-xl font-bold text-teal-600 mb-4">Consórcio</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Parcela mensal</span>
                <span className="font-semibold">{currency(consortium.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taxa adm. total</span>
                <span className="font-semibold">{currency(consortium.adminFeeTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contemplação estimada</span>
                <span className="font-semibold">{consortium.estimatedContemplation} meses</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700 font-medium">Custo total</span>
                <span className="font-bold text-lg">{currency(consortium.totalCost)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pontuação comparativa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Financiamento</span>
                <span className="font-semibold">{Number(rec.scoreFinancing).toFixed(1)} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${Math.min(Number(rec.scoreFinancing), 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Consórcio</span>
                <span className="font-semibold">{Number(rec.scoreConsortium).toFixed(1)} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-teal-500 h-3 rounded-full"
                  style={{ width: `${Math.min(Number(rec.scoreConsortium), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate("/simulacao")} variant="secondary">
            Nova Simulação
          </Button>
          <Button onClick={() => generatePdf(simulation)}>
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
