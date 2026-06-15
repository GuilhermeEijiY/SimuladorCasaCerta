import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Simulation, listSimulations } from "../api/simulation.api";
import { Button } from "../components/ui/Button";

function currency(value: string | number) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function optionLabel(option: string) {
  return option.replace("FINANCING_", "Financiamento ").replace("CONSORTIUM", "Consórcio");
}

export function History() {
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listSimulations()
      .then(setSimulations)
      .catch(() => setError("Erro ao carregar histórico."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return(
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <span className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Histórico</h1>
            <p className="text-gray-500">Suas simulações anteriores</p>
          </div>
          <Button onClick={() => navigate("/simulacao")}>Nova Simulação</Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {simulations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-400 mb-4">Nenhuma simulação realizada ainda.</p>
            <Button onClick={() => navigate("/simulacao")}>Fazer Primeira Simulação</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {simulations.map((sim) => (
              <div
                key={sim.id}
                onClick={() => navigate("/resultado", { state: { simulation: sim } })}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white bg-brand-500 px-2 py-1 rounded">
                      {optionLabel(sim.recommendation.recommendedOption)}
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(sim.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className="text-sm text-brand-600 font-semibold">
                    Economia: {currency(sim.recommendation.savingsEstimate)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block">Imóvel</span>
                    <span className="font-semibold text-gray-800">{currency(sim.propertyValue)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Entrada</span>
                    <span className="font-semibold text-gray-800">{currency(sim.downPayment)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Renda</span>
                    <span className="font-semibold text-gray-800">{currency(sim.monthlyIncome)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Prazo</span>
                    <span className="font-semibold text-gray-800">{sim.termMonths} meses</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
