import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { HeaderLogo } from '@/assets/components/HeaderLogo'
import {
  AuthProvider,
  useAuth,
} from '../context/AuthContext'
import { lockApp } from '../services/authService'

export function DesktopHeader() {

  const { authenticated, admin, setAuthenticated } = useAuth()
  
  async function handleLogout() {
    await lockApp()

    setAuthenticated(false)

    router.replace('/login')
  }
    
    return (
    <View style={styles.header}>

  {/* Navegação esquerda */}
  <View style={styles.leftNavigation}>
    <Pressable
      style={styles.item}
      onPress={() => router.push('/')}
    >
      <Text style={styles.text}>Início</Text>
    </Pressable>

    <Pressable
      style={styles.item}
      onPress={() => router.push('/products')}
    >
      <Text style={styles.text}>Produtos</Text>
    </Pressable>

    <Pressable
      style={styles.item}
      onPress={() => router.push('/blog')}
    >
      <Text style={styles.text}>Blog</Text>
    </Pressable>
  </View>


  {/* Logo exatamente no centro */}
  <Pressable
    style={styles.logoContainer}
    onPress={() => router.push('/')}
  >
    <HeaderLogo />
  </Pressable>


  {/* Navegação direita */}
  <View style={styles.rightNavigation}>

    <Pressable
      style={styles.item}
      onPress={() => router.push('/cart')}
    >
      <Text style={styles.text}>Carrinho</Text>
    </Pressable>

    {authenticated && (
      <Pressable
        style={styles.item}
        onPress={() => router.push('/profile')}
      >
        <Text style={styles.text}>Perfil</Text>
      </Pressable>
    )}

    {admin && (
      <Pressable
        style={styles.item}
        onPress={() => router.push('/admin')}
      >
        <Text style={styles.text}>Admin</Text>
      </Pressable>
    )}

    {authenticated ? (
      <Pressable
        // style={styles.loginButton}
        onPress={handleLogout}
      >
        <Text style={styles.loginText}>Sair</Text>
      </Pressable>
    ) : (
      <Pressable
        // style={styles.loginButton}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.loginText}>Entrar</Text>
      </Pressable>
    )}

  </View>

</View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 150,
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 40,

    backgroundColor: '#fff',

    borderBottomWidth: 1,
    borderBottomColor: '#ece6dc',

    elevation: 3,

    position: 'relative',
  },

  leftNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },

  logoContainer: {
    position: 'absolute',

    left: '50%',

    transform: [
      {
        translateX: -110,
      },
    ],

    width: 220,
    height: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  rightNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,

    marginLeft: 'auto',
  },

  item: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b4513',
  },
/*
  loginButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#8b4513',
  },
*/
  loginText: {
    color: '#8b4513',
    fontSize: 15,
    fontWeight: '700',
  },
})