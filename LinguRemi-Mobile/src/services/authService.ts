import AsyncStorage from '@react-native-async-storage/async-storage'

import { apiFetch } from './api'

type LoginRequest = {
  login: string
  password: string
}

type LoginResponse = {
  token: string
  nome?: string
  email?: string
}

type RegisterRequest = {
  role: 'USER'
  nome: string
  email: string
  senha: string
}

const TOKEN_KEY = '@linguremi:token'
const NAME_KEY = '@linguremi:name'
const EMAIL_KEY = '@linguremi:email'

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

  if (!data?.token) {
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
  await AsyncStorage.setItem(TOKEN_KEY, data.token)

  if (data.nome) {
    await AsyncStorage.setItem(NAME_KEY, data.nome)
  }

  if (data.email) {
    await AsyncStorage.setItem(EMAIL_KEY, data.email)
  }
}

export async function clearAuthData() {
  await AsyncStorage.removeItem(TOKEN_KEY)
  await AsyncStorage.removeItem(NAME_KEY)
  await AsyncStorage.removeItem(EMAIL_KEY)
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
  }
}