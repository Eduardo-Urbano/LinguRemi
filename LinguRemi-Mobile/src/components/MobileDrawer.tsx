import { router } from 'expo-router'
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useState } from 'react'

import { useAuth } from '@/src/context/AuthContext'
import { lockApp } from '@/src/services/authService'

export function MobileDrawer() {
  const [visible, setVisible] = useState(false)

  const {
    authenticated,
    admin,
    setAuthenticated,
  } = useAuth()

  function navigate(path: any) {
    setVisible(false)
    router.push(path)
  }

  async function handleLogout() {
    await lockApp()

    setAuthenticated(false)
    setVisible(false)

    router.replace('/login')
  }

  return (
    <>
      {/* HEADER MOBILE */}
      <View style={styles.header}>

        {/* Botão menu */}
        <Pressable
          style={styles.menuButton}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>


        {/* Logo centralizada */}
        <Pressable
          style={styles.logoContainer}
          onPress={() => router.push('/')}
        >
          <Image
            source={require('@/assets/images/LinguRemiLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>

      </View>


      {/* DRAWER */}
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}
      >

        <View style={styles.modalContainer}>

          {/* MENU */}
          <View style={styles.drawer}>

            {/* INÍCIO */}
            <Pressable
              style={styles.item}
              onPress={() => navigate('/')}
            >
              <Text style={styles.itemText}>
                Início
              </Text>
            </Pressable>


            {/* PRODUTOS */}
            <Pressable
              style={styles.item}
              onPress={() => navigate('/products')}
            >
              <Text style={styles.itemText}>
                Nossos produtos
              </Text>
            </Pressable>


            {/* CARRINHO */}
            <Pressable
              style={styles.item}
              onPress={() => navigate('/cart')}
            >
              <Text style={styles.itemText}>
                Carrinho
              </Text>
            </Pressable>


            {/* BLOG */}
            <Pressable
              style={styles.item}
              onPress={() => navigate('/blog')}
            >
              <Text style={styles.itemText}>
                Blog
              </Text>
            </Pressable>


            {/* PERFIL */}
            {authenticated && (
              <Pressable
                style={styles.item}
                onPress={() => navigate('/profile')}
              >
                <Text style={styles.itemText}>
                  Perfil
                </Text>
              </Pressable>
            )}


            {/* ADMIN */}
            {admin && (
              <Pressable
                style={styles.item}
                onPress={() => navigate('/admin')}
              >
                <Text style={styles.itemText}>
                  Admin
                </Text>
              </Pressable>
            )}


            {/* LOGIN / CADASTRO */}
            {!authenticated && (
              <>
                <Pressable
                  style={styles.item}
                  onPress={() => navigate('/login')}
                >
                  <Text style={styles.itemText}>
                    Login
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.item}
                  onPress={() => navigate('/register')}
                >
                  <Text style={styles.itemText}>
                    Cadastro
                  </Text>
                </Pressable>
              </>
            )}


            {/* LOGOUT */}
            {authenticated && (
              <Pressable
                style={styles.item}
                onPress={handleLogout}
              >
                <Text style={styles.itemText}>
                  Sair
                </Text>
              </Pressable>
            )}

          </View>


          {/* ÁREA ESCURA */}
          <Pressable
            style={styles.overlay}
            onPress={() => setVisible(false)}
          />

        </View>

      </Modal>
    </>
  )
}


const styles = StyleSheet.create({

  /*
   * HEADER
   */

  header: {
    height: 64,
    width: '100%',

    backgroundColor: '#fff',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,

    borderBottomWidth: 1,
    borderBottomColor: '#ece6dc',

    elevation: 3,

    position: 'relative',
  },


  /*
   * BOTÃO MENU
   */

  menuButton: {
    width: 44,
    height: 44,

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 2,
  },


  menuIcon: {
    fontSize: 26,
    color: '#8b4513',
  },


  /*
   * LOGO DO HEADER
   */

  logoContainer: {
    position: 'absolute',

    left: '50%',

    transform: [
      {
        translateX: -65,
      },
    ],

    width: 130,
    height: 64,

    alignItems: 'center',
    justifyContent: 'center',
  },


  logo: {
    width: 180,
    height: 90,
  },


  /*
   * MODAL
   */

  modalContainer: {
    flex: 1,

    flexDirection: 'row',
  },


  /*
   * DRAWER
   */

  drawer: {
    width: 280,
    height: '100%',

    backgroundColor: '#fff',

    elevation: 10,

    zIndex: 2,
  },


  /*
   * OVERLAY
   */

  overlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.35)',
  },


  /*
   * CABEÇALHO DO DRAWER
   */

  drawerLogo: {
    width: 140,
    height: 55,
  },


  closeButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',
  },


  close: {
    fontSize: 32,
    color: '#8b4513',
  },


  /*
   * ITENS
   */

  item: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },


  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

})