import { apiFetch } from './api'
import { HistoryItem } from '../types/History'

export async function getHistory() {
  return apiFetch<HistoryItem[]>(
    '/historico/dados'
  )
}