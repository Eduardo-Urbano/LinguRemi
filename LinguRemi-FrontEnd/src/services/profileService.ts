import type { HistoryItem } from '../types/History'

const API_URL = 'https://linguremi-api.onrender.com'

export async function getUserHistory(): Promise<HistoryItem[]> {
  try {
    const email = localStorage.getItem('emailUser')

    if (!email) return []

    const response = await fetch(`${API_URL}/historico/${email}`)

    if (!response.ok) return []

    return await response.json()
  } catch {
    return []
  }
}