export type AddProductRequest = {
  nome: string
  descricao: string
  valor: number
  disponivel: number
  tipoQuantidade: 'unidade' | 'peso'
  imagem: {
    uri: string
    name: string
    type: string
  }
}