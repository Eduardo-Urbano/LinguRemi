import { apiFetch } from './api'

type LoginRequest = {
  login: string
  password: string
}

type UserRole = 'USER' | 'ADMIN';

type LoginResponse = {
  token: string
  nome?: string
  email?: string
  role?: UserRole
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

  if (data.role) {
    localStorage.setItem('roleUser', data.role)
  }
}

export function clearAuthData() {
  localStorage.removeItem('jwtToken')
  localStorage.removeItem('nomeUser')
  localStorage.removeItem('emailUser')
  localStorage.removeItem('roleUser')
}

export function getAuthToken() {
  return localStorage.getItem('jwtToken')
}

export function getUserRole(): UserRole | ''{
  const role = localStorage.getItem('roleUser')

  if (role === 'ADMIN' || role === 'USER'){
    return role
  }

  return ''
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}

export function isAdmin() {
  return getUserRole() === 'ADMIN'
}

export function getUserData() {
  return {
    nome: localStorage.getItem('nomeUser') || '',
    email: localStorage.getItem('emailUser') || '',
    token: localStorage.getItem('jwtToken') || '',
    role: getUserRole(),
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