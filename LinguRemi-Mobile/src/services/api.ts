const API_URL = process.env.EXPO_PUBLIC_API_URL

export function getApiUrl() {
  return API_URL
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },

    ...options,
  })

  if (!response.ok) {
    throw new Error('Erro na requisição')
  }

  return response.json()
}