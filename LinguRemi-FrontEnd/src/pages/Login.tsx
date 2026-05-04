import { useState } from 'react'
import type { FormEvent } from 'react'
import { loginUser, saveAuthData } from '../services/authService'

type LoginProps = {
  onSuccess?: () => void
  onOpenRegister?: () => void
}

export function Login({ onSuccess, onOpenRegister }: LoginProps) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    const sanitizedLogin = login.trim()
    const sanitizedPassword = password.trim()

    if (!sanitizedLogin || !sanitizedPassword) {
      setErrorMessage('Preencha todos os campos.')
      return
    }

    if (sanitizedPassword.length < 6) {
      setErrorMessage('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    try {
      setIsLoading(true)

      const data = await loginUser({
        login: sanitizedLogin,
        password: sanitizedPassword,
      })

      saveAuthData(data)

      setLogin('')
      setPassword('')

      onSuccess?.()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao conectar com a API.'

      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-4 text-center text-2xl font-bold">Login</h2>

      {errorMessage && (
        <p className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <label htmlFor="login-email" className="sr-only">
        Email
      </label>
      <input
        id="login-email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        value={login}
        onChange={(event) => setLogin(event.target.value)}
        className="mb-3 w-full rounded border p-2"
      />

      <label htmlFor="login-password" className="sr-only">
        Senha
      </label>
      <input
        id="login-password"
        type="password"
        placeholder="Senha"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="mb-3 w-full rounded border p-2"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mx-auto cursor-pointer flex w-3/4 justify-center rounded-2xl bg-black py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Entrando...' : 'Logar'}
      </button>

      <button
        type="button"
        onClick={onOpenRegister}
        className="mx-auto mt-2 cursor-pointer flex w-3/4 justify-center rounded-2xl bg-black py-2 text-white hover:bg-blue-600"
      >
        Cadastre-se
      </button>
    </form>
  )
}