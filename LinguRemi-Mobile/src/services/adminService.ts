import { apiFetch } from './api'

import type { Product } from '../types/Product'

export async function getAdminProducts() {
  return await apiFetch<Product[]>('/admin/produtos')
}

export async function deleteProduct(id: number) {
  return await apiFetch(`/admin/produtos/${id}`, {
    method: 'DELETE',
  })
}