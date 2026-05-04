import type { Recipe } from '../types/Recipe'

const API_URL = 'https://linguremi-api.onrender.com'

export async function getRandomRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_URL}/receitas/aleatorios`)

    if (!response.ok) {
      throw new Error('Erro ao buscar receitas')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao carregar receitas:', error)
    return []
  }
}

export function getRecipeImageUrl(imagePath: string): string {
  return `${API_URL}/${imagePath}`
}