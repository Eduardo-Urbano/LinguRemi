import type { HistoryItem } from '../types/History'
import { apiFetch } from './api'

export async function getUserHistory(): Promise<HistoryItem[]> {
  try {
    const email = localStorage.getItem('emailUser')

    if (!email || email.trim() === '') return []

    return await apiFetch<HistoryItem[]>(`/historico/${email}`, {
      auth: true,
    })
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return []
  }
}