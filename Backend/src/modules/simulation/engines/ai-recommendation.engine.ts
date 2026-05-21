import Groq from "groq-sdk";
import { env } from "../../../config/env";
import { SacOutput } from "./financing-sac.engine";
import { PriceOutput } from "./financing-price.engine";
import { ConsortiumOutput } from "./consortium.engine";
import { RecommendationOutput } from "./recommendation.engine";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Você é o consultor financeiro do Casa Certa, um simulador comparativo entre financiamento e consórcio imobiliário.

REGRAS DE NEGÓCIO:
- O sistema compara três modalidades: Financiamento SAC (parcelas decrescentes), Financiamento PRICE (parcelas fixas) e Consórcio Imobiliário.
- O motor de scoring avalia 5 critérios com pesos: Custo Total (30%), Comprometimento de Renda (25%), Urgência (20%), Previsibilidade (15%) e Flexibilidade (10%).
- Financiamento dá acesso IMEDIATO ao imóvel, mas tem juros compostos.
- Consórcio NÃO tem juros, mas tem taxa administrativa e fundo de reserva, e o acesso ao imóvel depende de contemplação (sorteio ou lance).
- SAC: parcelas começam altas e diminuem ao longo do tempo. Custo total é menor que PRICE.
- PRICE: parcelas fixas do início ao fim. Mais previsível, mas custo total é maior.
- Se a urgência é ALTA, financiamento é quase sempre melhor pois garante acesso imediato.
- Se a urgência é BAIXA e o usuário pode esperar, consórcio tende a ser mais econômico.
- Comprometimento de renda ideal: parcela não deve ultrapassar 30% da renda mensal.
- Se o valor do lance for R$0 e o consórcio for recomendado, sugira ao usuário refazer a simulação com um valor de lance para reduzir o prazo de contemplação.

INSTRUÇÕES:
- Sempre responda em português brasileiro.
- Seja claro, objetivo e didático.
- Explique o raciocínio de forma que uma pessoa sem conhecimento financeiro entenda.
- Mencione vantagens e desvantagens da opção recomendada.
- Dê dicas práticas ao usuário.
- Limite sua resposta a no máximo 4 parágrafos curtos.
- NÃO use markdown, listas ou formatação especial. Apenas texto corrido em parágrafos.`;

export interface AiRecommendationInput {
  sac: SacOutput;
  price: PriceOutput;
  consortium: ConsortiumOutput;
  recommendation: RecommendationOutput;
  monthlyIncome: number;
  urgency: "BAIXA" | "MEDIA" | "ALTA";
  objective: "MORADIA" | "INVESTIMENTO" | "MUDANCA";
  propertyValue: number;
  downPayment: number;
  termMonths: number;
}

export async function generateAiRecommendation(input: AiRecommendationInput): Promise<string> {
  const {
    sac, price, consortium, recommendation,
    monthlyIncome, urgency, objective, propertyValue, downPayment, termMonths,
  } = input;

  const incomeRatioSac = ((sac.firstInstallment / monthlyIncome) * 100).toFixed(1);
  const incomeRatioPrice = ((price.fixedInstallment / monthlyIncome) * 100).toFixed(1);
  const incomeRatioConsortium = ((consortium.monthlyPayment / monthlyIncome) * 100).toFixed(1);

  const userMessage = `Analise esta simulação e gere uma recomendação personalizada:

PERFIL DO USUÁRIO:
- Renda mensal: R$${monthlyIncome.toFixed(2)}
- Objetivo: ${objective}
- Urgência: ${urgency}
- Valor do imóvel: R$${propertyValue.toFixed(2)}
- Entrada: R$${downPayment.toFixed(2)} (${((downPayment / propertyValue) * 100).toFixed(1)}%)
- Prazo: ${termMonths} meses (${(termMonths / 12).toFixed(1)} anos)

RESULTADOS DA SIMULAÇÃO:
1. Financiamento SAC:
   - Primeira parcela: R$${sac.firstInstallment.toFixed(2)} (${incomeRatioSac}% da renda)
   - Última parcela: R$${sac.lastInstallment.toFixed(2)}
   - Total de juros: R$${sac.totalInterest.toFixed(2)}
   - Custo total: R$${sac.totalCost.toFixed(2)}

2. Financiamento PRICE:
   - Parcela fixa: R$${price.fixedInstallment.toFixed(2)} (${incomeRatioPrice}% da renda)
   - Total de juros: R$${price.totalInterest.toFixed(2)}
   - Custo total: R$${price.totalCost.toFixed(2)}

3. Consórcio:
   - Parcela mensal: R$${consortium.monthlyPayment.toFixed(2)} (${incomeRatioConsortium}% da renda)
   - Taxa adm. total: R$${consortium.adminFeeTotal.toFixed(2)}
   - Contemplação estimada: ${consortium.estimatedContemplation} meses
   - Custo total: R$${consortium.totalCost.toFixed(2)}

DECISÃO DO MOTOR DE SCORING:
- Opção recomendada: ${recommendation.recommendedOption}
- Score financiamento: ${recommendation.scoreFinancing}
- Score consórcio: ${recommendation.scoreConsortium}
- Economia estimada: R$${recommendation.savingsEstimate.toFixed(2)}

Com base nesses dados, explique ao usuário por que essa é a melhor opção para o perfil dele e dê orientações práticas.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content || recommendation.reason;
}
