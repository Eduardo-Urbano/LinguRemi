import { useState } from 'react'
import type { FormEvent } from 'react'
import { registerUser } from '../services/authService'

type RegisterProps = {
  onSuccess?: () => void
  onBackToLogin?: () => void
}

export function Register({ onSuccess, onBackToLogin }: RegisterProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirmada, setSenhaConfirmada] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isLoading) {
      return
    }
    setErrorMessage('')

    const sanitizedNome = nome.trim()
    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedSenha = senha.trim()
    const sanitizedSenhaConfirmada = senhaConfirmada.trim()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!sanitizedNome || !sanitizedEmail || !sanitizedSenha || !sanitizedSenhaConfirmada) {
      setErrorMessage('Preencha todos os campos.')
      return
    }

    if (!emailRegex.test(sanitizedEmail)) {
      setErrorMessage('Insira um email válido.')
      return
    }

    if (sanitizedSenha.length < 6) {
      setErrorMessage('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (sanitizedSenha !== sanitizedSenhaConfirmada) {
      setErrorMessage('As senhas não coincidem.')
      return
    }

    try {
      setIsLoading(true)

      await registerUser({
        role: 'USER',
        nome: sanitizedNome,
        email: sanitizedEmail,
        senha: sanitizedSenha,
      })

      setNome('')
      setEmail('')
      setSenha('')
      setSenhaConfirmada('')

      onSuccess?.()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao cadastrar usuário.'

      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-4 text-center text-2xl font-bold">Cadastre-se</h2>

      {errorMessage && (
        <p className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <input
        type="text"
        placeholder="Nome"
        autoComplete="name"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
        className="mb-3 w-full rounded border p-2"
      />

      <input
        type="email"
        placeholder="Email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mb-3 w-full rounded border p-2"
      />

      <input
        type="password"
        placeholder="Senha"
        autoComplete="new-password"
        value={senha}
        onChange={(event) => setSenha(event.target.value)}
        className="mb-3 w-full rounded border p-2"
      />

      <input
        type="password"
        placeholder="Confirmar senha"
        autoComplete="new-password"
        value={senhaConfirmada}
        onChange={(event) => setSenhaConfirmada(event.target.value)}
        className="mb-3 w-full rounded border p-2"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mx-auto cursor-pointer flex w-3/4 justify-center rounded-2xl bg-black py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
      </button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="mx-auto mt-2 cursor-pointer flex w-3/4 justify-center rounded-2xl bg-gray-700 py-2 text-white hover:bg-gray-900"
      >
        Voltar para login
      </button>
    </form>
  )
}