const API_URL = 'https://linguremi-api.onrender.com'

export function getApiUrl() {
  return API_URL
}

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error('Erro na requisição')
  }

  return response.json()
}