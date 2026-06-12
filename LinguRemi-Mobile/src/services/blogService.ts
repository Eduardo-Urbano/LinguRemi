import { apiFetch, getApiUrl } from './api'
import type { BlogRecipe } from '../types/BlogRecipe'

const API_URL = getApiUrl()

export async function getBlogRecipes(): Promise<BlogRecipe[]> {
  try {
    return await apiFetch<BlogRecipe[]>('/receitas/todas')
  } catch (error) {
    console.error('Erro ao carregar receitas do blog:', error)
    return []
  }
}

export async function getBlogRecipeById(id: string): Promise<BlogRecipe | null> {
  try {
    return await apiFetch<BlogRecipe>(`/receitas/buscar/${id}`)
  } catch {
    return null
  }
}

export function getBlogRecipeImage(path?: string) {
  if (!path) return undefined

  return `${API_URL}/${path}`
}

export async function blog4Ultimas(): Promise<BlogRecipe[]> {
  try{
    return await apiFetch<BlogRecipe[]>('/receitas/blog4Ultimas')
  } catch (error) {
    console.error('Erro ao buscar receitas do blog.', error)
    return []
  }
}
