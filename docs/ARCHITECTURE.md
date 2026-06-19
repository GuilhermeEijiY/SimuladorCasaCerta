# Arquitetura do Sistema

## Visão Geral

O Casa Certa segue uma arquitetura **monolítica modular em 3 camadas**, com comunicação via REST API.

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React + TypeScript + TailwindCSS v4 (Vite)                  │
│  Deploy: Vercel (casacerta-cce.vercel.app)                   │
│                                                              │
│  pages/        hooks/         api/           contexts/       │
│  Home          useAuth        client.ts      AuthContext      │
│  Login         useSimulation  auth.api.ts                    │
│  Register                    simulation.api                  │
│  Simulation                                                  │
│  Results       utils/                                        │
│  History       generate-pdf.ts (jsPDF)                       │
└─────────────────────┬────────────────────────────────────────┘
                      │ HTTP REST (JSON)
                      │ Authorization: Bearer <JWT>
                      ▼
┌──────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  Node.js + Express + TypeScript                              │
│  Deploy: Vercel Serverless (api/index.ts)                    │
│                                                              │
│  ┌────────────┐   ┌───────────┐   ┌──────────────┐          │
│  │ Controller │──▶│  Service  │──▶│  Repository  │          │
│  │ (HTTP)     │   │ (lógica)  │   │ (Prisma ORM) │          │
│  └────────────┘   └─────┬─────┘   └──────┬───────┘          │
│                         │                │                   │
│                    ┌────▼──────┐          │                   │
│                    │  Engines  │          │                   │
│                    │ SAC       │          │                   │
│                    │ PRICE     │          │                   │
│                    │ Consórcio │          │                   │
│                    │ Cenários  │          │                   │
│                    │ Recomend. │          │                   │
│                    │ IA (Groq) │          │                   │
│                    └───────────┘          │                   │
│                                          │                   │
│  Middlewares: auth (JWT), validate (Zod), │                   │
│  error-handler                           │                   │
└──────────────────────────────────────────┼───────────────────┘
                                           │ Prisma Client
                                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    BANCO DE DADOS                            │
│  PostgreSQL (Neon Serverless em produção)                    │
│                                                              │
│  5 tabelas: users, simulations, financing_results,           │
│  consortium_results, recommendations                         │
│  2 migrations versionadas                                    │
└──────────────────────────────────────────────────────────────┘
```

## Padrão Controller → Service → Repository

**Controller** — Recebe o request HTTP, chama o service, retorna o response. Sem lógica de negócio.

**Service** — Toda lógica de negócio. O `SimulationService` orquestra os engines de cálculo em sequência: SAC → PRICE → Consórcio → Cenários → Recomendação → IA.

**Repository** — Única camada que acessa o Prisma ORM. Métodos semânticos: `create()`, `findByUserId()`.

**Engines** — Funções puras de cálculo financeiro. Sem banco, sem HTTP, sem efeitos colaterais. Testáveis isoladamente com Jest.

## Engines de Cálculo

| Engine | Arquivo | Função |
|--------|---------|--------|
| SAC | `financing-sac.engine.ts` | Parcelas decrescentes, amortização constante |
| PRICE | `financing-price.engine.ts` | Parcelas fixas, fórmula Price |
| Consórcio | `consortium.engine.ts` | Parcela = fundo comum + taxa adm + reserva |
| Cenários | `scenarios.engine.ts` | 11 cenários comparativos (amortização, taxa, reajuste) |
| Recomendação | `recommendation.engine.ts` | Scoring com 5 critérios ponderados (0-100) |
| IA | `ai-recommendation.engine.ts` | Análise textual via Groq (Llama 3.3 70B) |

## Endpoints da API

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | /api/v1/auth/register | Pública | Cria usuário |
| POST | /api/v1/auth/login | Pública | Autentica e retorna JWT |
| GET | /api/v1/auth/me | JWT | Dados do usuário logado |
| POST | /api/v1/simulations | JWT | Executa simulação completa com cenários |
| GET | /api/v1/simulations | JWT | Lista simulações do usuário |

## Tecnologias

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend | React + TypeScript + TailwindCSS v4 | Componentização, type safety, utility-first CSS |
| Backend | Node.js + Express + TypeScript | TypeScript compartilhado entre camadas |
| Banco | PostgreSQL + Prisma ORM | Relacional robusto, migrations versionadas, types automáticos |
| Auth | JWT + bcryptjs | Stateless, sem gerenciamento de sessão |
| IA | Groq API (Llama 3.3 70B) | Recomendação textual personalizada |
| PDF | jsPDF (client-side) | Exportação sem dependência do servidor |
| Deploy | Vercel (frontend + backend serverless) + Neon (PostgreSQL) | Infraestrutura serverless, zero ops |
| Testes | Jest + ts-jest | Testes unitários dos engines |
| Validação | Zod | Validação de DTOs e variáveis de ambiente |
