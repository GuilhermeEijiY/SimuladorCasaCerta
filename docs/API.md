# Especificação da API

## Base URL

Produção: `https://casacerta-backend.vercel.app/api/v1`
Local: `http://localhost:3000/api/v1`

---

## Autenticação

### POST /auth/register

Cria novo usuário.

**Request:**
```json
{
  "name": "João Guilherme",
  "email": "joao@email.com",
  "password": "Senha123"
}
```

**Validações:** name obrigatório, email válido e único, password mínimo 6 caracteres.

**Response (201):**
```json
{
  "user": { "id": "uuid", "name": "João Guilherme", "email": "joao@email.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /auth/login

**Request:**
```json
{
  "email": "joao@email.com",
  "password": "Senha123"
}
```

**Response (200):** Mesmo formato do register.

### GET /auth/me

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid",
  "name": "João Guilherme",
  "email": "joao@email.com"
}
```

---

## Simulações

### POST /simulations

Executa simulação completa: SAC + PRICE + Consórcio + 11 cenários + Recomendação + IA.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "propertyValue": 350000,
  "downPayment": 70000,
  "monthlyIncome": 8000,
  "interestRate": 0.0095,
  "termMonths": 360,
  "adminFee": 0.0018,
  "bidValue": 30000,
  "objective": "MORADIA",
  "urgency": "MEDIA"
}
```

**Validações (Zod):** propertyValue > 0, downPayment >= 0, monthlyIncome > 0, interestRate entre 0.001 e 0.05, termMonths entre 12 e 420, adminFee entre 0.0001 e 0.01, objective e urgency valores do enum.

**Response (201):** Retorna simulação completa com resultados SAC, PRICE, consórcio, cenários comparativos e recomendação.

### GET /simulations

Lista todas as simulações do usuário autenticado, ordenadas da mais recente para a mais antiga.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "simulations": [
    {
      "id": "uuid",
      "propertyValue": "350000",
      "downPayment": "70000",
      "monthlyIncome": "8000",
      "createdAt": "2026-06-18T00:00:00Z",
      "financingResults": [...],
      "consortiumResult": {...},
      "recommendation": {...}
    }
  ]
}
```
