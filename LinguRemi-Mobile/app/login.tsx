import { router, useFocusEffect, useNavigation  } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import { useEffect, useState, useCallback } from 'react'
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { enableBiometricLogin, getAuthToken, isAppLocked, loginUser, saveAuthData, unlockApp, isBiometricEnabled, logoutUser  } from '../src/services/authService'
import { useAuth } from '../src/context/AuthContext'
import * as LocalAuthentication from 'expo-local-authentication'
import LoadingModal from '../src/components/feedback/LoadingModal'
import SuccessModal from '../src/components/feedback/SuccessModal'
import ErrorModal from '../src/components/feedback/ErrorModal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function LoginScreen() {
  const { setAuthenticated, setAdmin } = useAuth()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLocked,setIsLocked] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const navigation = useNavigation()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  useFocusEffect(
    useCallback(() => {
      async function checkLock() {
        const locked = await isAppLocked()
        setIsLocked(locked)
      }

      checkLock()
    }, [])
  )

  function showError(message: string) {
    setErrorMessage(message)
    setErrorVisible(true)

    setTimeout(() => {
      setErrorVisible(false)
    }, 2500)
  }

  async function handleLogin() {
    if (isLoading) return

    setErrorMessage('')

    const sanitizedLogin = login.trim()
    const sanitizedPassword = password.trim()

    if (!sanitizedLogin || !sanitizedPassword) {
      setErrorMessage('Preencha todos os campos.')
      setErrorVisible(true)

      setTimeout(() => {
        setErrorVisible(false)
      }, 2500)

      return
    }

    if (!emailRegex.test(sanitizedLogin)) {
      setErrorMessage('Insira um email válido.')
      setErrorVisible(true)

      setTimeout(() => {
        setErrorVisible(false)
      }, 2500)

      return
    }

    if (sanitizedPassword.length < 6) {
      setErrorMessage('A senha precisa ter pelo menos 6 caracteres.')
      setErrorVisible(true)

      setTimeout(() => {
        setErrorVisible(false)
      }, 2500)

      return
    }

    try {
      setIsLoading(true)

      const data = await loginUser({
        login: sanitizedLogin,
        password: sanitizedPassword,
      })

      await saveAuthData(data)
      await enableBiometricLogin()

      setSuccessVisible(true)

      setTimeout(() => {
        setSuccessVisible(false)

        setAuthenticated(true)
        setAdmin(data.role === 'ADMIN')

        router.replace('/')
      }, 1500)
    } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Erro ao conectar com a API.'

        setErrorMessage(message)
        setErrorVisible(true)

        setTimeout(() => {
          setErrorVisible(false)
        }, 2500)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleBiometricLogin() {
    const enabled = await isBiometricEnabled()

    if(!enabled){
      showError('Login por biometria não ativado.')
      return
    }

    const compatible = await LocalAuthentication.hasHardwareAsync()
    const enrolled = await LocalAuthentication.isEnrolledAsync()

    if(!compatible || !enrolled){
      showError('Login por biometria não ativado.')
      return
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Entrar com biometria',
      fallbackLabel: 'Usar senha',
    })

    if(!result.success){
      showError('Login por biometria não ativado.')
      return
    }

    const token = await getAuthToken()

    if(!token){
      setErrorMessage('Faça login com e-mail e senha primeiro.')
      return
    }

    await unlockApp()
    setAuthenticated(true)
    router.replace('/')
  }

  async function handleUseAnotherUser() {
    await logoutUser()
    await unlockApp()
    setIsLocked(false)
    setAuthenticated(false)
    setIsLocked(false)

    navigation.setOptions({
      swipeEnabled: true,
      headerLeft: undefined,
    })
    
  }

  useEffect(()=>{
    async function checkLock() {
      const locked = await isAppLocked()
      setIsLocked(locked)
    }
    checkLock()
  },[])

  useEffect(() => {
  navigation.setOptions({
    swipeEnabled: !isLocked,
    headerLeft: isLocked ? () => null : undefined,
    })
  }, [isLocked])

  return (
    <KeyboardAwareScrollView 
          style={styles.container} 
          contentContainerStyle={styles.content} 
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={30}
    >
      <View style={styles.card}>

        {isLocked ? (
          <>
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <Pressable
            style={styles.button}
            onPress={handleBiometricLogin}
          >
            <Text style={styles.buttonText}>
              Login com biometria
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={handleUseAnotherUser}
          >
            <Text style={styles.buttonText}>
              Usar uma conta diferente
            </Text>
          </Pressable>
          </>
        ) : (
          <>
        <Text style={styles.title}>Login</Text>

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

        <Pressable onPress={() => router.push('/forgotPassword')}>
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

        {/*
        <Pressable
          style={styles.button}
          onPress={handleBiometricLogin}
          >
          <Text style={styles.buttonText}>
            Login com biometria
          </Text>
        
        </Pressable>
        */}

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.buttonText}>Cadastre-se</Text>
        </Pressable>
        </>
        )}
      </View>

      <LoadingModal
        visible={isLoading}
        message="Entrando..."
      />

      <SuccessModal
        visible={successVisible}
        message="Login realizado com sucesso"
      />

      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
      />

    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f2',
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 40,
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
    marginBottom:10,
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