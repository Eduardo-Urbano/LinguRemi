export type Product = {
  idReceitas: number
  nomeReceitas: string
  descReceitas: string
  imgReceitas: string
  avaliacaoReceitas: number
  valorReceitas: number
  tipoquantidadeReceitas: 'unidade' | 'peso'
  disponivelReceitas: number
}