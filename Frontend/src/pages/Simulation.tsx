import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSimulation } from "../hooks/useSimulation";
import { SimulationInput } from "../api/simulation.api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function Simulation() {
  const navigate = useNavigate();
  const { simulate, loading, error } = useSimulation();

  const [form, setForm] = useState<SimulationInput>({
    propertyValue: 350000,
    downPayment: 70000,
    monthlyIncome: 8000,
    interestRate: 0.0095,
    termMonths: 360,
    adminFee: 0.0018,
    bidValue: 0,
    objective: "MORADIA",
    urgency: "MEDIA",
  });

  function update(field: keyof SimulationInput, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await simulate(form);
    if (result) {
      navigate("/resultado", { state: { simulation: result } });
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Simulação</h1>
        <p className="text-gray-500 mb-8">
          Preencha os dados abaixo para comparar financiamento e consórcio.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Valor do imóvel (R$)"
              type="number"
              value={form.propertyValue}
              onChange={(e) => update("propertyValue", Number(e.target.value))}
              min={1}
              required
            />
            <Input
              label="Entrada (R$)"
              type="number"
              value={form.downPayment}
              onChange={(e) => update("downPayment", Number(e.target.value))}
              min={0}
              required
            />
            <Input
              label="Renda mensal (R$)"
              type="number"
              value={form.monthlyIncome}
              onChange={(e) => update("monthlyIncome", Number(e.target.value))}
              min={1}
              required
            />
            <Input
              label="Taxa de juros mensal"
              type="number"
              step="0.0001"
              value={form.interestRate}
              onChange={(e) => update("interestRate", Number(e.target.value))}
              min={0.0001}
              required
            />
            <Input
              label="Prazo (meses)"
              type="number"
              value={form.termMonths}
              onChange={(e) => update("termMonths", Number(e.target.value))}
              min={12}
              max={420}
              required
            />
            <Input
              label="Taxa administrativa mensal"
              type="number"
              step="0.0001"
              value={form.adminFee}
              onChange={(e) => update("adminFee", Number(e.target.value))}
              min={0.0001}
              required
            />
            <Input
              label="Valor do lance (R$)"
              type="number"
              value={form.bidValue}
              onChange={(e) => update("bidValue", Number(e.target.value))}
              min={0}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Objetivo</label>
              <select
                value={form.objective}
                onChange={(e) => update("objective", e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="MORADIA">Moradia</option>
                <option value="INVESTIMENTO">Investimento</option>
                <option value="MUDANCA">Mudança</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Urgência</label>
              <select
                value={form.urgency}
                onChange={(e) => update("urgency", e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={loading} className="px-10">
              {loading ? "Simulando..." : "Simular"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
