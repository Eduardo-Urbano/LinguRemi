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

type ForgotPasswordRequest = {
  email:string
}

type ResetPasswordRequest = {
  token:string
  novaSenha: string
  confirmarSenha:string
}

const TOKEN_KEY = '@linguremi:token'
const REFRESH_TOKEN_KEY = '@linguremi:refreshToken'
const NAME_KEY = '@linguremi:name'
const EMAIL_KEY = '@linguremi:email'
const ROLE_KEY = '@linguremi:role'
const BIOMETRIC_KEY = '@linguremi:biometricEnabled'
const APP_LOCKED_KEY = '@linguremi:appLocked'

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

export async function forgotPassword({email,}:ForgotPasswordRequest) {
  return await apiFetch<unknown>('/usuarios/forgotPassword', {
    method: 'POST',
    body: JSON.stringify({
      email,
    })
  })
}

export async function resetPassword({
  token,
  novaSenha,
  confirmarSenha,
}: ResetPasswordRequest) {
  return await apiFetch<unknown>('/usuarios/resetPassword', {
    method: 'PUT',
    body: JSON.stringify({
      token,
      novaSenha,
      confirmarSenha,
    }),
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
    APP_LOCKED_KEY,
    BIOMETRIC_KEY,
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
    } catch (error) {}
  }

  await clearAuthData()
}

export async function lockApp() {
  await AsyncStorage.setItem(APP_LOCKED_KEY, 'true')
}

export async function unlockApp() {
  await AsyncStorage.removeItem(APP_LOCKED_KEY)
}

export async function isAppLocked() {
  const value = await AsyncStorage.getItem(APP_LOCKED_KEY)
  return value === 'true'
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

export async function enableBiometricLogin() {
  await AsyncStorage.setItem(BIOMETRIC_KEY, 'true')
}

export async function isBiometricEnabled() {
  const value = await AsyncStorage.getItem(BIOMETRIC_KEY)
  return value === 'true'
}