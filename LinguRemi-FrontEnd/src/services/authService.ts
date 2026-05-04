const API_URL = 'https://linguremi-api.onrender.com'

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
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || `Erro ${response.status} ao fazer login`
    throw new Error(message)
  }

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
    nome: localStorage.getItem('nomeUser'),
    email: localStorage.getItem('emailUser'),
    token: localStorage.getItem('jwtToken'),
  }
}

type RegisterRequest = {
  role: 'USER'
  nome: string
  email: string
  senha: string
}

export async function registerUser(user: RegisterRequest) {
  const response = await fetch(`${API_URL}/usuarios/cadastrar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Erro ao cadastrar usuário.'
    throw new Error(message)
  }

  return data
}