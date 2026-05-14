import { useState } from "react";
import { createSimulation, SimulationInput, Simulation } from "../api/simulation.api";

export function useSimulation() {
  const [result, setResult] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function simulate(input: SimulationInput) {
    setLoading(true);
    setError(null);
    try {
      const simulation = await createSimulation(input);
      setResult(simulation);
      return simulation;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao executar simulação");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, simulate };
}
