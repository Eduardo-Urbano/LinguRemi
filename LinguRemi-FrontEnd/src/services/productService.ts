import type { Product } from '../types/Product'
import { apiFetch, getApiUrl } from './api'

const API_URL = getApiUrl()

export async function getProductById(id: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/receitas/produtos/${id}`)
  } catch {
    return null
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>('/receitas/produtos')
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    return []
  }
}

export function getProductImage(path?: string) {
  if (!path) return '/assets/images/placeholder.png'
  return `${API_URL}/${path}`
}