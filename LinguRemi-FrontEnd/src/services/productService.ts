import type { Product } from '../types/Product'

const API_URL = 'https://linguremi-api.onrender.com'

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/receitas/produtos/${id}`)

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/receitas/produtos`)

    if (!response.ok) {
      throw new Error('Erro ao buscar produtos')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    return []
  }
}

export function getProductImage(path: string) {
  return `${API_URL}/${path}`
}