import 'react-native-gesture-handler'

import { Stack } from 'expo-router'
import { View, StyleSheet } from 'react-native'

import { AuthProvider } from '../src/context/AuthContext'
import { useResponsive } from '../src/hooks/useResponsive'

import { DesktopHeader } from '../src/components/DesktopHeader'
import { MobileDrawer } from '../src/components/MobileDrawer'


function Navigation() {
  const { isDesktop } = useResponsive()

  return (
    <View style={styles.container}>

      {isDesktop ? (
        <DesktopHeader />
      ) : (
        <MobileDrawer />
      )}

      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>

    </View>
  )
}


export default function RootLayout() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
})