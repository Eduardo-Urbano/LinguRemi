export type Insumo = {
  idInsumo: number
  nomeInsumo: string
  unidadeMedida: string
  estoqueAtual: number
  estoqueMinimo: number
  custoUnitario: number | null
  ativoInsumo: boolean
}

export type LoteInsumo = {
  idLote: number
  quantidadeInicial: number
  quantidadeAtual: number
  dataEntrada: string
  dataValidade: string
  fornecedor: string | null
}

export type MovimentacaoEstoque = {
  idMovimentacao: number
  tipoMovimentacao: 'ENTRADA' | 'SAIDA_VENDA' | 'PERDA_VALIDADE' | 'PERDA_OUTRO'
  quantidade: number
  motivo: string | null
  dataMovimentacao: string
}