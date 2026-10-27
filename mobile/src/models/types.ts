
export interface Usuario {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  cep: string;
  estado: string;
  cidade: string;
  endereco: string;
}

export interface Ong {
  id?: number;
  nome: string;
  cnpj: string;
  email: string;
  senha: string;
  cep: string;
  estado: string;
  cidade: string;
  endereco: string;
  telefone?: string;
}

export interface Animal {
  id?: number;
  nome: string;
  especie: string;
  idade: number;
  porte: string;
  sexo: string;
  descricao: string;
  foto_url?: string | null;
  id_ong: number;
}

export interface Solicitacao {
  id?: number;
  id_usuario: number;
  id_animal: string;
  status?: string;
  data?: string;
  nome_solicitante?: string;
  telefone?: string;
  moradia?: string;
  outros_animais?: string;
  experiencia?: string;
  observacoes?: string;
  nome_animal?: string;
  nome_ong?: string;
}
