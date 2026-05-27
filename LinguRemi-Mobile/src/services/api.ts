import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = process.env.EXPO_PUBLIC_API_URL

const TOKEN_KEY = '@linguremi:token'

export function getApiUrl() {
  return API_URL
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = await AsyncStorage.getItem(TOKEN_KEY)

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options?.headers || {}),
    },

    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()

    console.log('STATUS:', response.status)
    console.log('ERRO API:', errorText)

    throw new Error(errorText || 'Erro na requisição')
  }

  return response.json()
}