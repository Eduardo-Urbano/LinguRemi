export type CartItem = {
  id: number
  nome: string
  preco: number
  imagem?: string
  quantidade: number
  tipoQuantidade: 'unidade' | 'peso'
}