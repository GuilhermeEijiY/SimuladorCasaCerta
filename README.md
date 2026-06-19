# 🏠 Casa Certa

[Acessar aplicação](https://casa-certa-iota.vercel.app)

## Simulador comparativo entre financiamento e consórcio imobiliário

## 📌 Sobre o projeto

O **Casa Certa** é uma aplicação web criada para apoiar a tomada de decisão na compra de imóveis. O sistema compara **financiamento imobiliário** e **consórcio**, apresenta cenários, calcula impactos financeiros e sugere a alternativa mais adequada ao perfil do usuário.

O repositório reflete a **entrega final da Fase 3**, consolidando autenticação, histórico de simulações, exportação em PDF, cenários comparativos avançados, documentação técnica e análise textual opcional com IA.

## 🎓 Contexto acadêmico

Este projeto foi desenvolvido na disciplina **Certificadora de Competência Específica (CCE)** do curso de **Análise e Desenvolvimento de Sistemas** da **UTFPR**.

- **Professor responsável:** Francisco Pereira Junior
- **Status acadêmico:** entrega final da Fase 3

## 👨‍💻 Autores

- Guilherme Eiji Yoshida
- Douglas Cunha
- Lucas Okiishi Junqueira Forlini
- Samuel Penha Jacobsen
- João Guilherme de Souza

## 🎯 Objetivo

Desenvolver uma plataforma capaz de:

- simular financiamento imobiliário pelos sistemas **SAC** e **PRICE**;
- simular **consórcio imobiliário** com taxa administrativa e lance;
- comparar custos e prazos entre modalidades;
- gerar **recomendação automatizada** com base em critérios financeiros;
- apresentar resultados visuais para apoiar a decisão do usuário.

## ⚠️ Problema

Muitas pessoas não compreendem com clareza as diferenças entre financiamento e consórcio. Isso pode levar a escolhas inadequadas, comprometimento excessivo da renda e decisões de longo prazo sem uma análise comparativa confiável.

## 💡 Solução

O **Casa Certa** propõe uma solução única para:

- receber os dados financeiros do usuário;
- calcular financiamento em **SAC** e **PRICE**;
- calcular o consórcio com contemplação estimada;
- comparar cenários alternativos com amortização e reajustes;
- recomendar a modalidade mais adequada;
- armazenar histórico das simulações do usuário;
- exportar o resultado em **PDF**.

## 🚀 Funcionalidades atuais

### 🔐 Autenticação

- cadastro de usuário;
- login com **JWT**;
- rota protegida para simulação, resultado e histórico;
- recuperação do usuário autenticado via `/auth/me`.

### 📊 Simulação financeira

- cálculo de financiamento **SAC**;
- cálculo de financiamento **PRICE**;
- cálculo de **consórcio** com taxa administrativa;
- suporte a **valor de lance**;
- definição de **objetivo** e **urgência**.

### 🧮 Cenários avançados

- amortização extra com foco em **redução de prazo**;
- amortização extra com foco em **redução de prestação**;
- sensibilidade à variação de juros;
- cenários de consórcio com índice **fixo**, **INCC** e **IPCA**.

### 🧠 Recomendação

- motor de recomendação com critérios de custo, renda, urgência, previsibilidade e flexibilidade;
- fator decisivo destacado no resultado;
- análise textual opcional com IA via **Groq**, quando a chave está configurada.

### 📈 Visualização dos resultados

- cards comparativos entre **SAC**, **PRICE** e **Consórcio**;
- gráfico de evolução do custo acumulado;
- destaque da melhor opção;
- exibição de economia estimada, parcelas e custo total;
- exibição de impacto da amortização e reajuste do consórcio.

### 🗂️ Histórico e exportação

- histórico de simulações por usuário autenticado;
- reabertura de uma simulação anterior pela tela de histórico;
- exportação do resultado em **PDF**.

## 🏗️ Arquitetura

O projeto segue uma arquitetura **monolítica modular em 3 camadas**, com comunicação via API REST:

- **Frontend**
- **Backend**
- **Banco de dados**

### Estrutura do repositório

```txt
SimuladorCasaCerta/
├── Frontend/     # Aplicação React + Vite
├── Backend/      # API Express + Prisma
├── docs/         # Documentação técnica do projeto
├── .github/      # Workflow de deploy
└── docker-compose.yml
```

### Organização do backend

O backend utiliza o padrão:

- **Controller** para camada HTTP;
- **Service** para regras de negócio;
- **Repository** para acesso a dados;
- **Engines** para cálculos financeiros puros.

## 🧰 Tecnologias utilizadas

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Axios
- React Router DOM
- Recharts
- jsPDF

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs
- Zod
- Groq SDK

### Infraestrutura e suporte

- Docker
- Docker Compose
- Vercel
- GitHub Actions

### Testes

- Jest
- ts-jest

> Atualmente, os testes automatizados versionados no repositório estão concentrados no backend, com foco nos engines de cálculo.

## 🔄 Fluxo da aplicação

1. O usuário se cadastra ou faz login.
2. O frontend envia o token JWT nas rotas protegidas.
3. O usuário preenche o formulário da simulação.
4. O backend valida os dados com Zod.
5. O sistema executa os cálculos de SAC, PRICE, consórcio, cenários e recomendação.
6. A simulação é persistida no PostgreSQL.
7. O frontend exibe resultado, gráfico, recomendação e opções adicionais como PDF e histórico.

## 📥 Dados de entrada

- valor do imóvel;
- entrada;
- renda mensal;
- taxa de juros mensal;
- prazo em meses;
- taxa administrativa do consórcio;
- valor de lance;
- objetivo da compra;
- nível de urgência;
- amortização extra mensal;
- estratégia de amortização;
- índice de reajuste do consórcio.

## 📤 Dados de saída

- comparação entre **SAC**, **PRICE** e **Consórcio**;
- primeira e última parcela;
- custo total;
- total de juros;
- contemplação estimada;
- recomendação da melhor modalidade;
- economia estimada;
- impacto da amortização;
- estimativa de reajuste do consórcio;
- gráfico de custo acumulado;
- relatório em PDF.

## 👥 Público-alvo e cliente

### Público-alvo

Pessoas interessadas em adquirir imóveis e que precisam comparar alternativas financeiras de forma clara, visual e acessível.

### Cliente real

Lucas Tanaka, potencial comprador de imóvel.

## 📚 Documentação disponível

Além deste `README`, o projeto possui documentação técnica complementar em:

- `docs/API.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`

## ▶️ Como executar localmente

### Pré-requisitos

- Node.js 20+
- npm
- PostgreSQL

### Variáveis de ambiente

Crie os arquivos `.env` a partir dos exemplos:

- `./.env.example`
- `./Backend/.env.example`

Exemplo mínimo na raiz para uso com Docker Compose:

```env
GROQ_API_KEY=sua-chave-aqui
```

Exemplo mínimo no backend:

```env
PORT=3000
DATABASE_URL=postgresql://casacerta:casacerta123@localhost:5432/casacerta
JWT_SECRET=troque-esta-chave-em-producao
GROQ_API_KEY=sua-chave-aqui
```

### Rodando sem Docker

#### Backend

```bash
cd Backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

#### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Por padrão, o frontend consome `http://localhost:3000/api/v1`.

### Rodando com Docker Compose

```bash
docker-compose up --build
```

Serviços esperados:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3000`
- banco: `localhost:5434`

> Se houver erro de build no Docker, confira se `package.json` e `package-lock.json` estão sincronizados em `Frontend/` e `Backend/`.

## 🌐 Deploy

- **Frontend em produção:** `https://casa-certa-iota.vercel.app`
- **Deploy automatizado do frontend:** GitHub Actions + Vercel
- **Backend:** estrutura preparada para execução local com Express e deploy serverless via Vercel

## 🛠️ Ambientes colaborativos

### GitHub

<https://github.com/GuilhermeEijiY/SimuladorCasaCerta>

### Trello

<https://trello.com/b/chWzUxG7/simulador-casa-certa>

### Documentação

<https://docs.google.com/document/d/1OlmD1Z8pGnTow8EvsyPQOIwWPt4aUofzTxSWpQflb9M>

## 📌 Status do projeto

**Em desenvolvimento**

Projeto acadêmico correspondente à entrega final da Fase 3.

## 📄 Licença

Projeto de caráter acadêmico, desenvolvido exclusivamente para fins educacionais.
