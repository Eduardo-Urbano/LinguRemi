export interface Receita {
  id: number;
  nome: string;
  descricao: string;
  preparo: string;
  data: string;
  fotoUrl: string;
  autorEmail?: string;
  autorRole?: string;
  paraProdutos?: boolean;
}