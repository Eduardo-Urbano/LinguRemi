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

import { loginUser, saveAuthData } from '../src/services/authService'
import { useAuth } from '../src/context/AuthContext'

export default function LoginScreen() {
  const { setAuthenticated, setAdmin } = useAuth()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  async function handleLogin() {
    if (isLoading) return

    setErrorMessage('')

    const sanitizedLogin = login.trim()
    const sanitizedPassword = password.trim()

    if (!sanitizedLogin || !sanitizedPassword) {
      setErrorMessage('Preencha todos os campos.')
      return
    }

    if (!emailRegex.test(sanitizedLogin)) {
      setErrorMessage('Insira um email válido.')
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

      await saveAuthData(data)

      setAuthenticated(true)
      setAdmin(data.role === 'ADMIN')
      router.replace('/')
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        {errorMessage ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : null}

        <TextInput
          placeholder="Email"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Pressable onPress={() => router.push('/resetSenha')}>
          <Text style={styles.esqueciSenha}>
            Esqueceu sua senha? Clique aqui
          </Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Entrando...' : 'Logar'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.buttonText}>Cadastre-se</Text>
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

  esqueciSenha: {
    color: '#FA003F',
    paddingBottom: 20,
    textAlign: 'center',
  },
})