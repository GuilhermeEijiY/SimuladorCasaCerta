# 🏠 Casa Certa

## Simulador Comparativo entre Financiamento e Consórcio Imobiliário

---

# 📌 Sobre o Projeto

O **Casa Certa** é uma aplicação web desenvolvida com o objetivo de auxiliar usuários na tomada de decisão sobre a aquisição de imóveis, por meio da comparação entre financiamento imobiliário e consórcio imobiliário.

A ferramenta busca reduzir a falta de conhecimento financeiro, permitindo simulações detalhadas e fornecendo recomendações baseadas no perfil do usuário.

---

# 🎓 Contexto Acadêmico

Este projeto foi desenvolvido no âmbito da disciplina **Certificadora de Competência Específica (CCE)** do curso de **Análise e Desenvolvimento de Sistemas** da Universidade Tecnológica Federal do Paraná (**UTFPR**).

O foco atual do documento reflete as entregas da **Fase 2** do projeto.

**Professor responsável:** Francisco Pereira Junior

---

# 👨‍💻 Autores do Projeto

Este sistema foi desenvolvido por:

- Guilherme Eiji Yoshida
- Douglas Cunha
- Lucas Okiishi Junqueira Forlini
- Samuel Penha Jacobsen
- João Guilherme de Souza

---

# 🎯 Objetivo

Desenvolver um sistema capaz de:

- Simular financiamento imobiliário (Sistemas SAC e PRICE);
- Simular consórcio imobiliário;
- Comparar cenários financeiros;
- Exibir o custo total e detalhamento das parcelas;
- Gerar recomendações inteligentes baseadas no perfil de urgência e finanças do usuário.

---

# ⚠️ Problema

Muitas pessoas não compreendem as diferenças entre financiamento e consórcio, o que pode resultar em decisões financeiras inadequadas e endividamento a longo prazo.

---

# 💡 Solução

O **Casa Certa** propõe um simulador que:

- Considera juros, prazo e entrada;
- Simula lances em consórcios para estimar redução de prazo;
- Estima o prazo de contemplação;
- Analisa o perfil do usuário por meio de um sistema de pontuação (Motor de Recomendação);
- Gera recomendações personalizadas com justificativas claras.

---

# 🚀 Funcionalidades da Fase 2

## 📊 Simulação de financiamento

- Cálculo isolado usando funções puras (Engines) para SAC e PRICE.

## 🏦 Simulação de consórcio

- Cálculo integrado de taxa administrativa e fundo de reserva.

## ⚖️ Comparação visual

- Cards comparativos e destaque na tela de Resultados.

## 🧠 Recomendação baseada em pontuação

- Avaliação de 5 critérios:
  - Custo total;
  - Comprometimento de renda;
  - Urgência;
  - Previsibilidade;
  - Flexibilidade.

## 🔐 Autenticação

- Sistema de registro e login via JWT.

> **Nota:** Funcionalidades como IA real e relatórios em PDF foram mapeadas para evoluções futuras na Fase 3.

---

# 🏗️ Arquitetura

O sistema adota uma arquitetura monolítica modular organizada em três camadas:

- Frontend;
- Backend;
- Banco de dados.

O projeto está estruturado como um **monorepo**, contendo:

```txt
frontend/  -> Aplicação React
backend/   -> API Express
shared/    -> Tipos TypeScript compartilhados (DTOs)

O backend utiliza o padrão **Controller-Service-Repository**, separando:

- Responsabilidades HTTP;
- Regras de negócio;
- Acesso a dados.

---

# 🧰 Tecnologias Utilizadas

A stack principal é baseada em:

- React;
- TypeScript;
- Node.js;
- Express;
- PostgreSQL;
- Prisma.

## Frontend

- React.js com TypeScript;
- TailwindCSS;
- Vite;
- Axios.

## Backend

- Node.js com Express;
- TypeScript;
- Prisma ORM;
- JWT e bcrypt;
- Zod.

## Banco de Dados

- PostgreSQL.

## Testes e CI/CD

- Jest;
- Vitest;
- React Testing Library;
- GitHub Actions;
- Docker Compose.

---

# 🔄 Fluxo da Aplicação

1. O usuário preenche o formulário de simulação no Frontend;
2. O Frontend valida os dados localmente e envia via API (com token JWT);
3. O Backend valida os dados, executa os motores de cálculo e o motor de recomendação;
4. Os dados são persistidos no PostgreSQL atomicamente;
5. O sistema retorna os resultados para o Frontend;
6. O Frontend exibe gráficos e a melhor opção.

---

# 📥 Entrada de Dados

- Valor do imóvel;
- Entrada;
- Prazo;
- Taxa de juros;
- Taxa administrativa;
- Valor de lance opcional;
- Renda mensal;

## Objetivo

- Moradia;
- Investimento;
- Mudança.

## Nível de urgência

- Baixa;
- Média;
- Alta.

---

# 📤 Saída de Dados

## Comparação lado a lado

- SAC;
- PRICE;
- Consórcio.

## Informações exibidas

- Primeira e última parcela;
- Custo total;
- Total de juros;
- Estimativa de contemplação do consórcio;
- Recomendação da melhor modalidade;
- Estimativa de economia financeira.

---

# 👥 Público-Alvo e Cliente

## Público-Alvo

Pessoas interessadas em adquirir imóveis que buscam planejamento financeiro claro, sem necessidade de conhecimento técnico em finanças.

## Cliente Institucional

Professor da disciplina CCE.

## Cliente Real

Lucas Tanaka, potencial comprador de imóvel.

> A participação do cliente real auxiliou na validação dos requisitos.

---

# 🛠️ Ambientes Colaborativos

## GitHub

```txt
https://github.com/GuilhermeEijiY/SimuladorCasaCerta
```
## Trello (fase 1)

```txt
https://trello.com/b/chWzUxG7/simulador-casa-certa
```
## Jira (fase 2)

```txt
https://casacerta.atlassian.net/jira/software/projects/SCRUM/boards/1?atlOrigin=eyJpIjoiZjRkNWRjMDA2OTMwNDNjYmIxOGY3ZjYyODE2NDI5ZGYiLCJwIjoiaiJ9
```

## Documentação

```txt
https://docs.google.com/document/d/1OlmD1Z8pGnTow8EvsyPQOIwWPt4aUofzTxSWpQflb9M
```

---

# 📌 Status do Projeto

**Em desenvolvimento**  
Projeto acadêmico — Fase 2 (CCE).

---

# 📄 Licença

Este projeto é de caráter acadêmico, desenvolvido exclusivamente para fins educacionais.
