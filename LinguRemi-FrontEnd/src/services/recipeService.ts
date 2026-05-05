import type { Recipe } from '../types/Recipe'
import { apiFetch, getApiUrl } from './api'

const API_URL = getApiUrl()

export async function getRandomRecipes(): Promise<Recipe[]> {
  try {
    return await apiFetch<Recipe[]>('/receitas/aleatorios')
  } catch (error) {
    console.error('Erro ao carregar receitas:', error)
    return []
  }
}

export function getRecipeImageUrl(imagePath: string): string {
  if (!imagePath) return '/assets/images/placeholder.png'
  return `${API_URL}/${imagePath}`
}