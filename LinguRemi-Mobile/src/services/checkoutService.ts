import { apiFetch } from './api'

type CheckoutItem = {
  produtoId: number
  quantidade: number
}

type CheckoutRequest = {
  itens: CheckoutItem[]
}

type CheckoutResponse = {
  id: number
  valorTotal: number
  status: string
  linkPagamento: string
}

export async function createCheckout(
  data: CheckoutRequest,
) {
  return await apiFetch<CheckoutResponse>(
    '/checkout/criar',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}