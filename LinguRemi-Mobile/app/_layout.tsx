import 'react-native-gesture-handler'

import { Drawer } from 'expo-router/drawer'

import {
  AuthProvider,
  useAuth,
} from '../src/context/AuthContext'

function DrawerLayout() {
  const {
    authenticated,
    admin,
  } = useAuth()

  return (
    <Drawer
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
          title: 'Início',
        }}
      />

      <Drawer.Screen
        name="products/index"
        options={{
          title: 'Produtos',
        }}
      />

      <Drawer.Screen
        name="cart"
        options={{
          title: 'Carrinho',
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: 'Perfil',
          drawerItemStyle: authenticated
            ? undefined
            : { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="blog/index"
        options={{
          title: 'Blog',
        }}
      />

      <Drawer.Screen
        name="login"
        options={{
          title: 'Login',
          drawerItemStyle: !authenticated
            ? undefined
            : { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="register"
        options={{
          title: 'Cadastro',
          drawerItemStyle: !authenticated
            ? undefined
            : { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="admin/index"
        options={{
          title: 'Admin',
          drawerItemStyle: admin
            ? undefined
            : { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="products/[id]"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="blog/[id]"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="logout"
        options={{
          title: 'Sair',
          drawerItemStyle: authenticated
            ? undefined
            : { display: 'none' },
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