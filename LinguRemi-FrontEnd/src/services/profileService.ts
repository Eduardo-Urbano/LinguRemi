import type { HistoryItem } from '../types/History'
import { apiFetch } from './api'

export async function getUserHistory(): Promise<HistoryItem[]> {
  try {
    const token = localStorage.getItem('jwtToken')

    if (!token) return []

    return await apiFetch<HistoryItem[]>(`/historico/dados`, {
      auth: true,
    })
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    throw error
  }
}