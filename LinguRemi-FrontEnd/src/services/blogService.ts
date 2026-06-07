import type { BlogRecipe } from '../types/BlogRecipe'
import { apiFetch, getApiUrl } from './api'

const API_URL = getApiUrl()

export async function getBlogRecipes(): Promise<BlogRecipe[]> {
  try {
    return await apiFetch<BlogRecipe[]>('/receitas/todas')
  } catch (error) {
    console.error('Erro ao carregar receitas do blog:', error)
    return []
  }
}

export function getBlogRecipeImage(path: string): string {
  return `${API_URL}/${path}`
}

export async function getBlogRecipeById(id: string): Promise<BlogRecipe | null> {
  try {
    return await apiFetch<BlogRecipe>(`/receitas/buscar/${id}`)
  } catch {
    return null
  }
}