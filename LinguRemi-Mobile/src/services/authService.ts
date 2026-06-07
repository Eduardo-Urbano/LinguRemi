import AsyncStorage from '@react-native-async-storage/async-storage'

import { apiFetch } from './api'

type LoginRequest = {
  login: string
  password: string
}

type LoginResponse = {
  acessToken: string
  refreshToken: string
  nome?: string
  email?: string
  role?: 'USER' | 'ADMIN'
}

type RegisterRequest = {
  role: 'USER'
  nome: string
  email: string
  senha: string
}

const TOKEN_KEY = '@linguremi:token'
const REFRESH_TOKEN_KEY = '@linguremi:refreshToken'
const NAME_KEY = '@linguremi:name'
const EMAIL_KEY = '@linguremi:email'
const ROLE_KEY = '@linguremi:role'

export async function loginUser({
  login,
  password,
}: LoginRequest): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
  })

  if (!data?.acessToken) {
    throw new Error('Token não recebido pela API')
  }

  return data
}

export async function registerUser(user: RegisterRequest) {
  return await apiFetch<unknown>('/usuarios/cadastrar', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

export async function saveAuthData(data: LoginResponse) {
  await AsyncStorage.setItem(TOKEN_KEY, data.acessToken)
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
  await AsyncStorage.setItem(ROLE_KEY, data.role || 'USER')

  if (data.nome) {
    await AsyncStorage.setItem(NAME_KEY, data.nome)
  }

  if (data.email) {
    await AsyncStorage.setItem(EMAIL_KEY, data.email)
  }
}

export async function getUserRole() {
  return await AsyncStorage.getItem(ROLE_KEY)
}

export async function isAdmin() {
  const role = await getUserRole()
  return role === 'ADMIN'
}

export async function clearAuthData() {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    NAME_KEY,
    EMAIL_KEY,
    ROLE_KEY,
  ])
}

export async function logoutUser() {
  const refreshToken = await AsyncStorage.getItem(
    REFRESH_TOKEN_KEY,
  )

  if (refreshToken) {
    try {
      await apiFetch('/usuarios/logout', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken,
        }),
      })
    } catch {
      // ignora erro da API
    }
  }

  await clearAuthData()
}

export async function getAuthToken() {
  return await AsyncStorage.getItem(TOKEN_KEY)
}

export async function isAuthenticated() {
  const token = await getAuthToken()

  return Boolean(token)
}

export async function getUserData() {
  return {
    nome: (await AsyncStorage.getItem(NAME_KEY)) || '',
    email: (await AsyncStorage.getItem(EMAIL_KEY)) || '',
    token: (await AsyncStorage.getItem(TOKEN_KEY)) || '',
    refreshToken:
      (await AsyncStorage.getItem(REFRESH_TOKEN_KEY)) || '',
    role: (await AsyncStorage.getItem(ROLE_KEY)) || 'USER',
  }
}