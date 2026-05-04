import type { BlogRecipe } from '../types/BlogRecipe'

const API_URL = 'https://linguremi-api.onrender.com'

export async function getBlogRecipes(): Promise<BlogRecipe[]> {
  try {
    const response = await fetch(`${API_URL}/receitas/todas`)

    if (!response.ok) {
      throw new Error('Erro ao buscar receitas')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao carregar receitas do blog:', error)
    return []
  }
}

export function getBlogRecipeImage(path: string): string {
  return `${API_URL}/${path}`
}

export async function getBlogRecipeById(id: string) {
  try {
    const response = await fetch(`${API_URL}/receitas/buscar/${id}`)

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}