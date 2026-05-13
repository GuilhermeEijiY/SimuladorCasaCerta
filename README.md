# 🏠 Casa Certa

Simulador comparativo entre financiamento imobiliário e consórcio.

Projeto acadêmico desenvolvido para a disciplina **CCE (Certificadora de Competência Específica)** da **UTFPR**.

---

# 📌 Sobre o Projeto

O Casa Certa é uma aplicação web desenvolvida para auxiliar usuários na tomada de decisão sobre aquisição de imóveis, permitindo comparar cenários entre:

- Financiamento imobiliário SAC
- Financiamento imobiliário PRICE
- Consórcio imobiliário

O sistema busca tornar a decisão financeira mais consciente através de simulações detalhadas e recomendações baseadas no perfil do usuário.

---

# 🎓 Contexto Acadêmico

Projeto desenvolvido na disciplina:

**CCE — Certificadora de Competência Específica**
Curso: Análise e Desenvolvimento de Sistemas
Universidade Tecnológica Federal do Paraná (UTFPR)

Professor responsável:

- Francisco Pereira Junior

---

# 👨‍💻 Equipe

- Guilherme Eiji Yoshida
- Douglas Cunha
- Lucas Okiishi Junqueira Forlini
- Samuel Penha Jacobsen
- João Guilherme de Souza

---

# ⚠️ Problema

Muitas pessoas não compreendem corretamente as diferenças entre financiamento e consórcio, o que pode levar a:

- endividamento excessivo;
- decisões financeiras inadequadas;
- falta de planejamento;
- desconhecimento do custo total da aquisição.

---

# 💡 Solução

O Casa Certa propõe um simulador inteligente capaz de:

- comparar modalidades de aquisição imobiliária;
- calcular parcelas e custo total;
- simular financiamento SAC e PRICE;
- simular consórcio e lances;
- estimar contemplação;
- gerar recomendações personalizadas;
- auxiliar usuários na tomada de decisão.

---

# 🚀 Funcionalidades

- 📊 Simulação de financiamento SAC
- 📊 Simulação de financiamento PRICE
- 🏦 Simulação de consórcio
- ⚖️ Comparação entre modalidades
- 💰 Cálculo de custo total
- 🎯 Simulação de lance
- ⏳ Estimativa de contemplação
- 🧠 Recomendação baseada no perfil do usuário
- 🔐 Autenticação de usuários

---

# 🧰 Tecnologias Utilizadas

## Frontend

- React.js
- Vite
- CSS Modules
- Axios

## Backend

- Node.js
- Express.js
- JWT
- bcryptjs

## Banco de Dados

- PostgreSQL
- Prisma ORM

---

# 🏗️ Arquitetura

O sistema utiliza arquitetura monolítica modular em 3 camadas:

```txt
Frontend (React)
        ↓
API REST (Express)
        ↓
Banco de Dados (PostgreSQL)
```

O backend segue organização baseada em módulos:

```txt
Controller → Service → Engine
```

Os engines de cálculo são implementados como funções puras, isolando as regras financeiras da camada HTTP e do banco de dados.

---

# 📂 Estrutura do Projeto

```txt
SimuladorCasaCerta/
├── Backend/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── prisma/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🔄 Fluxo da Aplicação

1. Usuário insere dados financeiros
2. Backend processa os cálculos
3. Sistema compara cenários
4. Resultados são retornados ao frontend
5. Usuário visualiza:
   - parcelas;
   - custo total;
   - comparação;
   - recomendação personalizada.

---

# 📥 Dados de Entrada

- Valor do imóvel
- Entrada
- Taxa de juros
- Prazo
- Valor do lance
- Perfil financeiro
- Objetivo do usuário
- Urgência de aquisição

---

# 📤 Dados Gerados

- Parcelas mensais
- Custo total
- Comparação entre modalidades
- Impacto do lance
- Estimativa de contemplação
- Recomendação automática

---

# 🛠️ Como Executar o Projeto

## Pré-requisitos

- Node.js 18+
- PostgreSQL instalado

---

## Backend

```bash
cd Backend
npm install
npm run dev
```

---

## Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

# 🧪 Status do Projeto

🚧 Em desenvolvimento — Fase 2 do projeto acadêmico CCE.

---

# 🔗 Ambientes Colaborativos

GitHub:
https://github.com/GuilhermeEijiY/SimuladorCasaCerta

Trello:
https://trello.com/b/chWzUxG7/simulador-casa-certa

Documentação:
https://docs.google.com/document/d/1OlmD1Z8pGnTow8EvsyPQOIwWPt4aUofzTxSWpQflb9M

---

# 📈 Possíveis Evoluções

- Integração com APIs bancárias
- Dashboard financeiro
- Exportação de relatórios
- Inteligência artificial para recomendações
- Simulações avançadas

---

# 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos e educacionais.
