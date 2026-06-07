import { router } from 'expo-router'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { registerUser } from '../src/services/authService'

export default function RegisterScreen() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirmada, setSenhaConfirmada] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleRegister() {
    if (isLoading) return

    setErrorMessage('')
    setSuccessMessage('')

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

      setSuccessMessage('Cadastro realizado com sucesso! Faça login para continuar.')

      setTimeout(() => {
        router.replace('/login')
      }, 1000)
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Cadastre-se</Text>

        {errorMessage ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : null}

        {successMessage ? (
          <Text style={styles.success}>{successMessage}</Text>
        ) : null}

        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          placeholder="Confirmar senha"
          value={senhaConfirmada}
          onChangeText={setSenhaConfirmada}
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.buttonText}>Voltar para login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    elevation: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },

  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  success: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#fff',
  },

  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  secondaryButton: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
})