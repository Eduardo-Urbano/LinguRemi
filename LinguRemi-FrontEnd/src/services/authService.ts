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

export async function loginUser({ login, password }: LoginRequest): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  })

  if (!data?.token) {
    throw new Error('Token não recebido pela API')
  }

  return data
}

export function saveAuthData(data: LoginResponse) {
  localStorage.setItem('jwtToken', data.token)

  if (data.nome) {
    localStorage.setItem('nomeUser', data.nome)
  }

  if (data.email) {
    localStorage.setItem('emailUser', data.email)
  }
}

export function clearAuthData() {
  localStorage.removeItem('jwtToken')
  localStorage.removeItem('nomeUser')
  localStorage.removeItem('emailUser')
}

export function getAuthToken() {
  return localStorage.getItem('jwtToken')
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}

export function getUserData() {
  return {
    nome: localStorage.getItem('nomeUser') || '',
    email: localStorage.getItem('emailUser') || '',
    token: localStorage.getItem('jwtToken') || '',
  }
}

type RegisterRequest = {
  role: 'USER'
  nome: string
  email: string
  senha: string
}

export async function registerUser(user: RegisterRequest) {
  return await apiFetch<unknown>('/usuarios/cadastrar', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}