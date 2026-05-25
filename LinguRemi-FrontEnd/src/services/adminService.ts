import { apiFetch } from './api'
import { getAuthToken } from './authService'
import type { Product } from '../types/Product'

export type AdminProductRequest = {
  nome: string
  descricao: string
  valor: number
  imagem?: string
  disponivel: number
  tipoQuantidade: 'unidade' | 'peso'
}

function getAdminHeaders() {
  const token = getAuthToken()

  if (!token) {
    throw new Error('Token não encontrado.')
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export async function getAdminProducts(): Promise<Product[]> {
  return await apiFetch<Product[]>('/admin/produtos', {
    headers: getAdminHeaders(),
  })
}

export async function createAdminProduct(product: AdminProductRequest): Promise<Product> {
  return await apiFetch<Product>('/admin/produtos', {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(product),
  })
}

export async function updateAdminProduct(
  id: number,
  product: AdminProductRequest,
): Promise<Product> {
  return await apiFetch<Product>(`/admin/produtos/${id}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(product),
  })
}

export async function deleteAdminProduct(id: number): Promise<void> {
  await apiFetch<void>(`/admin/produtos/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  })
}

export async function updateAdminProductQuantity(
  id: number,
  quantidade: number,
): Promise<void> {
  await apiFetch<void>('/admin/qtd', {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify({
      id,
      quantidade,
    }),
  })
}