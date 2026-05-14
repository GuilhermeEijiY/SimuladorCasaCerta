export interface SimulacaoInput {
  valorImovel: number;
  entrada: number;
  prazoMeses: number;
  taxaJurosAnual: number;
  taxaAdministrativa: number;
  valorLance?: number;
  rendaMensal: number;
  objetivo: "moradia" | "investimento" | "mudanca";
  urgencia: "baixa" | "media" | "alta";
}

export interface ParcelaDetalhe {
  numero: number;
  amortizacao: number;
  juros: number;
  parcela: number;
  saldoDevedor: number;
}

export interface ResultadoFinanciamento {
  tipo: "SAC" | "PRICE";
  primeiraParcela: number;
  ultimaParcela: number;
  custoTotal: number;
  totalJuros: number;
  parcelas: ParcelaDetalhe[];
}

export interface ResultadoConsorcio {
  parcelaMensal: number;
  custoTotal: number;
  taxaAdministrativaTotal: number;
  fundoReservaTotal: number;
  estimativaContemplacao: number;
  reducaoPrazoComLance: number;
}

export interface Recomendacao {
  melhorOpcao: "SAC" | "PRICE" | "CONSORCIO";
  pontuacao: {
    custoTotal: number;
    comprometimentoRenda: number;
    urgencia: number;
    previsibilidade: number;
    flexibilidade: number;
  };
  justificativa: string;
  economiaEstimada: number;
}

export interface SimulacaoOutput {
  sac: ResultadoFinanciamento;
  price: ResultadoFinanciamento;
  consorcio: ResultadoConsorcio;
  recomendacao: Recomendacao;
}

export interface RegisterInput {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginInput {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}
