import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Modal,
} from 'react-native'

import { getUserData, isAuthenticated, logoutUser } from '../src/services/authService'
import { getUserHistory } from '../src/services/profileService'
import type { HistoryItem } from '../src/types/History'
import { useAuth } from '../src/context/AuthContext'

export default function ProfileScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const {setAuthenticated,setAdmin,} = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedOrder, setSelectedOrder] =
  useState<HistoryItem | null>(null)

  const [detailsVisible, setDetailsVisible] =
    useState(false)

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

  async function handleRefresh() {
    setRefreshing(true)

    try {
      const data = await getUserHistory()
      setHistory(data)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
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
        <Text style={styles.historyTitle}>
          Histórico ({history.length})
        </Text>

        {history.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma compra encontrada.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => String(item.id)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            renderItem={({ item }) => (
              <Pressable
                style={styles.historyItem}
                onPress={() => {
                  setSelectedOrder(item)
                  setDetailsVisible(true)
                }}
              >
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDescription}>
                    {item.nomeItem}
                  </Text>

                  <Text style={styles.historyValue}>
                    R$ {item.valorTotal.toFixed(2)}
                  </Text>
                </View>

                <Text style={styles.historyDate}>
                  {new Date(item.dataCompra).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </Text>
              </Pressable>
            )}
          />
        )}
      </View>
      <Modal
        visible={detailsVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Pedido #{selectedOrder?.id}
            </Text>

            <Text style={styles.modalLabel}>
              Produto
            </Text>

            <Text style={styles.modalValue}>
              {selectedOrder?.nomeItem}
            </Text>

            <Text style={styles.modalLabel}>
              Valor Total
            </Text>

            <Text style={styles.modalValue}>
              R$ {selectedOrder?.valorTotal.toFixed(2)}
            </Text>

            <Text style={styles.modalLabel}>
              Data
            </Text>

            <Text style={styles.modalValue}>
              {selectedOrder &&
                new Date(
                  selectedOrder.dataCompra,
                ).toLocaleString('pt-BR')}
            </Text>

            <Pressable
              style={styles.closeButton}
              onPress={() =>
                setDetailsVisible(false)
              }
            >
              <Text style={styles.closeButtonText}>
                Fechar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f2',
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
    backgroundColor: '#4b5563',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  historyDescription: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },

  historyValue: {
    color: '#22c55e',
    fontWeight: '700',
    fontSize: 16,
  },

  historyDate: {
    color: '#d1d5db',
    marginTop: 8,
    fontSize: 13,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },

  modalLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
  },

  modalValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },

  closeButton: {
    marginTop: 20,
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
})