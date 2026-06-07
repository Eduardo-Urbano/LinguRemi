import { apiFetch, getApiUrl } from './api'
import type { Recipe } from '../types/Recipe'

const API_URL = getApiUrl()

export async function getRandomRecipes(): Promise<Recipe[]> {
  try {
    return await apiFetch<Recipe[]>('/receitas/aleatorios')
  } catch (error) {
    console.error('Erro ao carregar receitas:', error)
    return []
  }
}

export function getRecipeImageUrl(imagePath?: string) {
  if (!imagePath) return undefined

  return `${API_URL}/${imagePath}`
}