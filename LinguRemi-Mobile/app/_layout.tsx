import 'react-native-gesture-handler'

import { Drawer } from 'expo-router/drawer'
import { router } from 'expo-router'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'

import { HeaderLogo } from '../assets/components/HeaderLogo'
import { logoutUser,lockApp } from '../src/services/authService'

import {
  AuthProvider,
  useAuth,
} from '../src/context/AuthContext'


function CustomDrawerContent(props: any) {
  const { authenticated, setAuthenticated, setAdmin } = useAuth()

  async function handleLogout() {
    await lockApp()

    setAuthenticated(false)
    setAdmin(false)

    router.replace('/login')
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {authenticated ? (
        <DrawerItem
          label="Sair"
          labelStyle={{fontSize:16, fontWeight:'600', alignContent:'center'}}
          onPress={handleLogout}
        />
      ) : null}
    </DrawerContentScrollView>
  )
}

  function DrawerLayout() {
  const {
    authenticated,
    admin,
  } = useAuth()

  
  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent {...props}/>
      )}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: '#8b4513',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#8b4513',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title:'Inicio',
          headerTitle: () => <HeaderLogo />,
        }}
      />

      <Drawer.Screen
        name="products/index"
        options={{
          title:'Nossos produtos',
          headerTitle: () => <HeaderLogo />,
        }}
      />

      <Drawer.Screen
        name="cart"
        options={{
          title:'Carrinho',
          headerTitle: () => <HeaderLogo />,
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: () => <HeaderLogo/>,
          drawerItemStyle: authenticated
            ? undefined
            : { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="blog/index"
        options={{
          title:'Blog',
          headerTitle: () => <HeaderLogo />,
        }}
      />

      <Drawer.Screen
        name="login"
        options={{
          title: 'Login',
          drawerItemStyle: !authenticated
            ? undefined
            : { display: 'none' },
            headerTitle: () => <HeaderLogo />,
        }}
      />

      <Drawer.Screen
        name="register"
        options={{
          title: 'Cadastro',
          drawerItemStyle: !authenticated
            ? undefined
            : { display: 'none' },
            headerTitle: () => <HeaderLogo />,
        }}
      />

      <Drawer.Screen
        name="admin/index"
        options={{
          title: 'Admin',
          headerTitle: () => <HeaderLogo />,
          drawerItemStyle: admin
            ? undefined
            : { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="products/[id]"
        options={{
          title: 'produtoId',
          headerTitle: () => <HeaderLogo />,
          drawerItemStyle: { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="blog/[id]"
        options={{
          title: 'blogId',
          headerTitle: () => <HeaderLogo />,
          drawerItemStyle: { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="forgotPassword"
        options={{
          drawerItemStyle: {display: 'none'},
          headerTitle: () => <HeaderLogo />,
        }}
      />

      <Drawer.Screen
        name="resetPassword"
        options={{
          drawerItemStyle: {display: 'none'},
          headerTitle: () => <HeaderLogo />,
        }}
      />

      <Drawer.Screen
        name="admin/produtos"
        options={{
          drawerItemStyle:{display: 'none'},
          headerTitle: () => <HeaderLogo />,
        }}
      />

      <Drawer.Screen
        name="admin/blog"
        options={{
          drawerItemStyle:{display: 'none'},
          headerTitle: () => <HeaderLogo />,
        }}
      />

      <Drawer.Screen
        name="admin/usuarios"
        options={{
          drawerItemStyle:{display: 'none'},
          headerTitle: () => <HeaderLogo />,
        }}
      />

    </Drawer>
    
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <DrawerLayout />
    </AuthProvider>
  )
}