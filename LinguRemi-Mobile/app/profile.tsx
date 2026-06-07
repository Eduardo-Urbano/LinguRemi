import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { clearAuthData, getUserData, isAuthenticated } from '../src/services/authService'
import { getUserHistory } from '../src/services/profileService'
import type { HistoryItem } from '../src/types/History'
import { useAuth } from '../src/context/AuthContext'
import { logoutUser } from '../src/services/authService'

export default function ProfileScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const {setAuthenticated,setAdmin,} = useAuth()

  useEffect(() => {
    async function loadProfile() {
      const authenticated = await isAuthenticated()

      if (!authenticated) {
        router.replace('/login')
        return
      }

      const user = await getUserData()

      setNome(user.nome)
      setEmail(user.email)

      const data = await getUserHistory()
      setHistory(data)

      setIsLoading(false)
    }

    loadProfile()
  }, [])

  async function handleLogout() {
    await logoutUser()

    setAuthenticated(false)
    setAdmin(false)

    router.replace('/')
  }
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Foto</Text>
        </View>

        <Text style={styles.name}>{nome || 'Usuário'}</Text>
        <Text style={styles.email}>{email || 'Email não informado'}</Text>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>Histórico</Text>

        {history.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma compra encontrada.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item, index) => String(item.id ?? index)}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.historyDescription}>
                  {item.descTransferencia}
                </Text>

                <Text style={styles.historyValue}>
                  R$ {item.valorTransferencia.toFixed(2)}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#666',
  },

  profileCard: {
    backgroundColor: '#1f2937',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  avatarText: {
    color: '#fff',
  },

  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  email: {
    color: '#e5e7eb',
    marginTop: 4,
  },

  logoutButton: {
    marginTop: 20,
  },

  logoutText: {
    color: '#f87171',
    fontWeight: '700',
    fontSize: 16,
  },

  historyCard: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 18,
    padding: 20,
  },

  historyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },

  emptyText: {
    color: '#fff',
    fontSize: 16,
  },

  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#6b7280',
    paddingVertical: 12,
  },

  historyDescription: {
    color: '#fff',
    fontSize: 16,
  },

  historyValue: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 4,
  },
})