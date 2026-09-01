import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  RefreshControl,
  Modal,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'

import { isAuthenticated, isAdmin } from '@/src/services/authService'
import {
  getAdminInsumos,
  deleteInsumo,
  getLotesVencendo,
} from '@/src/services/adminService'
import type { Insumo, LoteInsumo } from '@/src/types/Insumo'
import { useResponsive } from '@/src/hooks/useResponsive'

const COLORS = {
  bg: '#faf7f2',
  surface: '#ffffff',
  text: '#1a1a1a',
  textMuted: '#6b6b6b',
  border: '#ece6dc',
  accent: '#b4513b',
  success: '#16a34a',
  successSoft: '#dcfce7',
  warning: '#d97706',
  warningSoft: '#fef3c7',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
}

type StockLevel = 'ok' | 'low'
const getStockLevel = (insumo: Insumo): StockLevel =>
  insumo.estoqueAtual <= insumo.estoqueMinimo ? 'low' : 'ok'

const stockStyle = (lvl: StockLevel) =>
  lvl === 'low'
    ? { bg: COLORS.warningSoft, fg: COLORS.warning, label: 'Estoque baixo' }
    : { bg: COLORS.successSoft, fg: COLORS.success, label: 'Estoque ok' }

type InsumosAdminPanelProps = {
  // No mobile, essa tela abre como rota própria e precisa
  // do botão "Voltar". No desktop, ela é embutida dentro do
  // index do admin (ao lado de uma sidebar), então o botão
  // não faz sentido ali — a navegação é feita pela sidebar.
  showBackButton?: boolean
}

export function InsumosAdminPanel({
  showBackButton = true,
}: InsumosAdminPanelProps) {
  const { isDesktop } = useResponsive()

  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [lotesVencendo, setLotesVencendo] = useState<LoteInsumo[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'expiring'>('all')
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null)

  const load = useCallback(async () => {
    try {
      const [dataInsumos, dataVencendo] = await Promise.all([
        getAdminInsumos(),
        getLotesVencendo(7),
      ])
      setInsumos(Array.isArray(dataInsumos) ? dataInsumos : [])
      setLotesVencendo(Array.isArray(dataVencendo) ? dataVencendo : [])
    } catch (error) {
      console.log('Erro ao carregar insumos admin:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function init() {
      setLoading(true)

      const auth = await isAuthenticated()
      const admin = await isAdmin()

      if (!mounted) return

      if (!auth || !admin) {
        router.replace('/')
        return
      }

      await load()
    }

    init()

    return () => {
      mounted = false
    }
  }, [load])

  // Insumos com pelo menos um lote vencendo nos próximos dias
  const idsInsumosVencendo = useMemo(
    () => new Set(lotesVencendo.map((l) => l.idLote)),
    [lotesVencendo]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return insumos.filter((i) => {
      if (q && !i.nomeInsumo.toLowerCase().includes(q)) return false
      if (filter === 'low' && getStockLevel(i) !== 'low') return false
      // Nota: idsInsumosVencendo hoje guarda idLote, não idInsumo.
      // Ajuste getLotesVencendo/backend para retornar o idInsumo do
      // lote (ou inclua o objeto Insumo aninhado) para este filtro
      // funcionar corretamente — deixei a estrutura pronta aqui.
      return true
    })
  }, [insumos, query, filter])

  const renderItem = useCallback(
    ({ item }: { item: Insumo }) => {
      const card = (
        <InsumoCard
          insumo={item}
          isDesktop={isDesktop}
          onDelete={() => {
            setSelectedInsumo(item)
            setDeleteModalVisible(true)
          }}
        />
      )

      if (isDesktop) {
        return card
      }

      return (
        <ReanimatedSwipeable
          rightThreshold={80}
          overshootRight={false}
          renderRightActions={() => (
            <View style={styles.deleteAction}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
              <Text style={styles.deleteText}>Excluir</Text>
            </View>
          )}
          onSwipeableOpen={() => {
            setSelectedInsumo(item)
            setDeleteModalVisible(true)
          }}
        >
          {card}
        </ReanimatedSwipeable>
      )
    },
    [isDesktop]
  )

  if (loading) {
    return (
      <View style={styles.container}>
        <Header count={0} showBackButton={showBackButton} />
        {[...Array(4)].map((_, i) => (
          <View key={i} style={[styles.card, styles.skeleton]} />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header count={insumos.length} showBackButton={showBackButton} />

      {lotesVencendo.length > 0 && (
        <View style={styles.alertBanner}>
          <Ionicons name="warning-outline" size={18} color={COLORS.warning} />
          <Text style={styles.alertBannerText}>
            {lotesVencendo.length}{' '}
            {lotesVencendo.length === 1
              ? 'lote vence'
              : 'lotes vencem'}{' '}
            nos próximos 7 dias
          </Text>
        </View>
      )}

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar insumos..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.search}
        />
      </View>

      <View style={styles.chips}>
        {(['all', 'low'] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.chip, filter === f && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                filter === f && styles.chipTextActive,
              ]}
            >
              {f === 'all' ? 'Todos' : 'Estoque baixo'}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => String(i.idInsumo)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              load()
            }}
            tintColor={COLORS.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="flask-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum insumo encontrado</Text>
            <Text style={styles.emptyText}>
              Tente ajustar a busca ou cadastrar um novo insumo.
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() => router.push('/admin/insumos/adicionar')}
        accessibilityRole="button"
        accessibilityLabel="Cadastrar novo insumo"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDeleteModalVisible(false)}
        >
          <Pressable
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Desativar insumo</Text>

            <Text style={styles.modalText}>
              Deseja desativar {selectedInsumo?.nomeInsumo}?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={async () => {
                  if (!selectedInsumo) return

                  await deleteInsumo(selectedInsumo.idInsumo)

                  setDeleteModalVisible(false)
                  setSelectedInsumo(null)
                  load()
                }}
              >
                <Text style={styles.deleteButtonText}>Desativar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

function Header({
  count,
  showBackButton,
}: {
  count: number
  showBackButton: boolean
}) {
  return (
    <View style={styles.header}>
      {showBackButton && (
        <Pressable style={styles.backButton} onPress={() => router.push('/admin')}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      )}

      <Text style={styles.headerTitle}>Controle de insumos</Text>
      <Text style={styles.headerSubtitle}>
        {count} {count === 1 ? 'insumo' : 'insumos'}
      </Text>
    </View>
  )
}

function InsumoCard({
  insumo,
  isDesktop,
  onDelete,
}: {
  insumo: Insumo
  isDesktop: boolean
  onDelete: () => void
}) {
  const lvl = getStockLevel(insumo)
  const s = stockStyle(lvl)

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
      ]}
      onPress={() =>
        router.push({
          pathname: '/admin/insumos/[id]',
          params: { id: String(insumo.idInsumo) },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`Ver lotes de ${insumo.nomeInsumo}`}
    >
      <View style={styles.thumb}>
        <Ionicons name="flask-outline" size={26} color={COLORS.textMuted} />
      </View>

      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.name} numberOfLines={1}>
          {insumo.nomeInsumo}
        </Text>

        <Text style={styles.quantity}>
          {insumo.estoqueAtual} {insumo.unidadeMedida} em estoque
        </Text>

        <View style={[styles.badge, { backgroundColor: s.bg }]}>
          <View style={[styles.dot, { backgroundColor: s.fg }]} />
          <Text style={[styles.badgeText, { color: s.fg }]}>{s.label}</Text>
        </View>
      </View>

      {isDesktop && (
        <Pressable
          hitSlop={12}
          onPress={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={styles.iconBtn}
          accessibilityLabel="Desativar insumo"
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        </Pressable>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  headerSubtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },

  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  backButtonText: { color: '#fff', fontWeight: '700' },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.warningSoft,
  },
  alertBannerText: {
    color: COLORS.warning,
    fontWeight: '700',
    fontSize: 13,
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  search: { flex: 1, paddingVertical: 12, color: COLORS.text, fontSize: 15 },

  chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  chipText: { color: COLORS.textMuted, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#fff' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skeleton: { height: 96, marginHorizontal: 16, marginBottom: 12, opacity: 0.5 },

  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  name: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  quantity: { fontSize: 14, color: COLORS.textMuted },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerSoft,
  },

  empty: { alignItems: 'center', paddingVertical: 64, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  deleteAction: {
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    borderRadius: 16,
  },
  deleteText: { color: '#fff', fontWeight: '700', fontSize: 16 },

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
    borderRadius: 16,
    padding: 24,
    elevation: 8,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#3b2417', marginBottom: 10 },
  modalText: { fontSize: 16, color: '#666', lineHeight: 22, marginBottom: 24 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  cancelButtonText: { color: '#444', fontWeight: '700' },
  deleteButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
  },
  deleteButtonText: { color: '#fff', fontWeight: '700' },
})