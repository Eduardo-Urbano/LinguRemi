import { apiFetch } from './api'
import { getAuthToken } from './authService'
import type { HistoryItem } from '../types/History'

export async function getUserHistory(): Promise<HistoryItem[]> {
  const token = await getAuthToken()

  if (!token) return []

  try {
    return await apiFetch<HistoryItem[]>('/checkout/meus', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    return []
  }
} 