export type UpdateProductRequest = {
  nomeReceitas: string
  descReceitas: string
  avaliacaoReceitas: number
  valorReceitas: number
  tipoquantidadeReceitas: 'unidade' | 'peso'
  disponivelReceitas: number
}