import 'react-native-gesture-handler'

import { Drawer } from 'expo-router/drawer'
import {HeaderLogo} from '../assets/components/HeaderLogo'

export default function RootLayout() {
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
          title:'Perfil',
          headerTitle: () => <HeaderLogo />,
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
          drawerItemStyle: { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="register"
        options={{
          drawerItemStyle: { display: 'none' },
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
    </Drawer>
  )
}