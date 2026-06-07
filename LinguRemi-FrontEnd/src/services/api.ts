const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL não configurada')
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean
}

export function getApiUrl() {
  return API_URL
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { auth = false, headers, ...fetchOptions } = options

  const token = localStorage.getItem('jwtToken')

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...(fetchOptions.body && !(fetchOptions.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = data?.message || `Erro ${response.status} na requisição`
    throw new Error(message)
  }

  return data as T
}