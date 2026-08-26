import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { isAdmin, isAuthenticated } from '@/src/services/authService'
import { toggleUserStatus, getAdminUsers } from '@/src/services/adminService'
import type { AdminUser } from '@/src/types/AdminUser'

const COLORS = {
  bg: '#faf7f2',
  surface: '#fff',
  text: '#1a1a1a',
  muted: '#6b6b6b',
  border: '#ece6dc',
  accent: '#b4513b',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
  success: '#16a34a',
  successSoft: '#dcfce7',
}

type UsuariosAdminPanelProps = {
  // No mobile, essa tela abre como rota própria e precisa
  // do botão "Voltar". No desktop, ela é embutida dentro do
  // index do admin (ao lado de uma sidebar), então o botão
  // não faz sentido ali — a navegação é feita pela sidebar.
  showBackButton?: boolean
}

export function UsuariosAdminPanel({
  showBackButton = true,
}: UsuariosAdminPanelProps) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [query, setQuery] = useState('')
  const [orderBy, setOrderBy] = useState<'id' | 'nome'>('id')
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await getAdminUsers()
      setUsers(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    async function init() {
      const auth = await isAuthenticated()
      const admin = await isAdmin()

      if (!auth || !admin) {
        router.replace('/')
        return
      }

      await load()
    }

    init()
  }, [load])

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase()

    return users
      .filter((user) => {
        return (
          user.nomeUsuarios.toLowerCase().includes(q) ||
          user.emailUsuarios.toLowerCase().includes(q) ||
          String(user.idUsuarios).includes(q)
        )
      })
      .sort((a, b) => {
        if (orderBy === 'id') {
          return a.idUsuarios - b.idUsuarios
        }

        return a.nomeUsuarios.localeCompare(b.nomeUsuarios)
      })
  }, [users, query, orderBy])

  async function handleToggleStatus() {
    if (!selectedUser) return

    try {
        await toggleUserStatus(selectedUser.idUsuarios)

        setModalVisible(false)
        setSelectedUser(null)

        await load()
    } catch (error) {
        console.error(error)
    }
    }

  return (
    <View style={styles.container}>
      {showBackButton && (
        <Pressable style={styles.backButton} onPress={() => router.push('/admin')}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      )}

      <Text style={styles.title}>Usuários</Text>
      <Text style={styles.subtitle}>{users.length} usuários cadastrados</Text>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={COLORS.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por nome, e-mail ou ID..."
          placeholderTextColor={COLORS.muted}
          style={styles.search}
        />
      </View>

      <View style={styles.orderRow}>
        <Pressable
          style={[styles.chip, orderBy === 'id' && styles.chipActive]}
          onPress={() => setOrderBy('id')}
        >
          <Text style={[styles.chipText, orderBy === 'id' && styles.chipTextActive]}>
            Ordenar por ID
          </Text>
        </Pressable>

        <Pressable
          style={[styles.chip, orderBy === 'nome' && styles.chipActive]}
          onPress={() => setOrderBy('nome')}
        >
          <Text style={[styles.chipText, orderBy === 'nome' && styles.chipTextActive]}>
            Ordem alfabética
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => String(item.idUsuarios)}
        contentContainerStyle={{ paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.nomeUsuarios.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.name}>
                #{item.idUsuarios} · {item.nomeUsuarios}
              </Text>

              <Text style={styles.email}>{item.emailUsuarios}</Text>

              <View
                style={[
                  styles.statusBadge,
                  item.ativoUsuarios ? styles.activeBadge : styles.blockedBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.ativoUsuarios ? styles.activeText : styles.blockedText,
                  ]}
                >
                  {item.ativoUsuarios ? 'Ativo' : 'Bloqueado'}
                </Text>
              </View>
            </View>

            <Pressable
                style={[
                    styles.statusButton,
                    item.ativoUsuarios
                    ? styles.blockButton
                    : styles.unblockButton,
                ]}
                onPress={() => {
                    setSelectedUser(item)
                    setModalVisible(true)
                }}
                >
                <Ionicons
                    name={
                    item.ativoUsuarios
                        ? 'ban-outline'
                        : 'checkmark-circle-outline'
                    }
                    size={20}
                    color="#fff"
                />
                </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
                {selectedUser?.ativoUsuarios
                    ? 'Bloquear usuário'
                    : 'Desbloquear usuário'}
            </Text>

            <Text style={styles.modalText}>
                {selectedUser?.ativoUsuarios
                    ? `Deseja bloquear ${selectedUser?.nomeUsuarios}?`
                    : `Deseja desbloquear ${selectedUser?.nomeUsuarios}?`}
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.confirmButton} onPress={handleToggleStatus}>
                <Text style={styles.confirmText}>
                    {selectedUser?.ativoUsuarios
                        ? 'Bloquear'
                        : 'Desbloquear'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

blockButton: {
    backgroundColor: '#dc2626',
},

unblockButton: {
    backgroundColor: '#16a34a',
},
  
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  backButtonText: { color: '#fff', fontWeight: '700' },

  title: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  subtitle: { color: COLORS.muted, marginTop: 4, marginBottom: 16 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  search: { flex: 1, paddingVertical: 12, color: COLORS.text },

  orderRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  chip: {
    flex: 1,
    padding: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  chipText: { color: COLORS.muted, fontWeight: '700' },
  chipTextActive: { color: '#fff' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },

  userInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  email: { color: COLORS.muted, marginTop: 2 },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  activeBadge: { backgroundColor: COLORS.successSoft },
  blockedBadge: { backgroundColor: COLORS.dangerSoft },
  statusText: { fontSize: 12, fontWeight: '800' },
  activeText: { color: COLORS.success },
  blockedText: { color: COLORS.danger },

 
  disabledButton: { opacity: 0.4 },

  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: COLORS.muted, fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3b2417',
    marginBottom: 10,
  },
  modalText: {
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  cancelText: { color: '#444', fontWeight: '700' },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
  },
  statusButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    },
  confirmText: { color: '#fff', fontWeight: '700' },
  
  
})