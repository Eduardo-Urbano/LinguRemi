import AsyncStorage from '@react-native-async-storage/async-storage'

export const API_URL = process.env.EXPO_PUBLIC_API_URL

const TOKEN_KEY = '@linguremi:token'

export function getApiUrl() {
  return API_URL
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = await AsyncStorage.getItem(TOKEN_KEY)
  try{
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
      let errorMessage = 'Erro na requisição'

      try {
        const errorData = await response.json()

        errorMessage =
          errorData.message ||
          errorData.error ||
          errorMessage
      } catch {
        // ignora erro do parse
      }

      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {

    if (error instanceof Error) {
      throw error
    }

    throw new Error(
      'Sem conexão com a internet'
    )
  }  
}