import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { isAuthenticated, isAdmin } from '../../src/services/authService'
import { getAdminProducts } from '../../src/services/adminService'
import { getRecipeImageUrl } from '../../src/services/recipeService'
import type { Product } from '../../src/types/Product'

const COLORS = {
  bg: '#faf7f2',
  surface: '#ffffff',
  text: '#1a1a1a',
  textMuted: '#6b6b6b',
  border: '#ece6dc',
  accent: '#b4513b',
  accentSoft: '#f5e6e1',
  success: '#16a34a',
  successSoft: '#dcfce7',
  warning: '#d97706',
  warningSoft: '#fef3c7',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
}

type StockLevel = 'in' | 'low' | 'out'
const getStockLevel = (n: number): StockLevel =>
  n <= 0 ? 'out' : n < 10 ? 'low' : 'in'

const stockStyle = (lvl: StockLevel) =>
  lvl === 'out'
    ? { bg: COLORS.dangerSoft, fg: COLORS.danger, label: 'Sem estoque' }
    : lvl === 'low'
    ? { bg: COLORS.warningSoft, fg: COLORS.warning, label: 'Estoque baixo' }
    : { bg: COLORS.successSoft, fg: COLORS.success, label: 'Em estoque' }

export default function adminProdutos() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | StockLevel>('all')

  const load = useCallback(async () => {
    try {
      const data = await getAdminProducts()
      setProducts(data)
    } catch (error) {
      console.log('Erro ao carregar produtos admin:', error)
      router.replace('/')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!(await isAuthenticated()) || !(await isAdmin())) {
        router.replace('/')
        return
      }
      load()
    })()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (q && !p.nomeReceitas.toLowerCase().includes(q)) return false
      if (filter !== 'all' && getStockLevel(p.disponivelReceitas) !== filter)
        return false
      return true
    })
  }, [products, query, filter])

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} />,
    []
  )

  if (loading) {
    return (
      <View style={styles.container}>
        <Header count={0} />
        {[...Array(4)].map((_, i) => (
          <View key={i} style={[styles.card, styles.skeleton]} />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header count={products.length} />

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar produtos..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.search}
        />
      </View>

      <View style={styles.chips}>
        {(['all', 'in', 'low', 'out'] as const).map((f) => (
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
              {f === 'all'
                ? 'Todos'
                : f === 'in'
                ? 'Em estoque'
                : f === 'low'
                ? 'Baixo'
                : 'Esgotado'}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => String(p.idReceitas)}
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
            <Ionicons name="cube-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
            <Text style={styles.emptyText}>
              Tente ajustar a busca ou criar um novo produto.
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Criar novo produto"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  )
}

function Header({ count }: { count: number }) {
  return (
    <View style={styles.header}>
      <View>
        <Pressable style={styles.backButton} onPress={() => router.push('/admin')}>
        <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Painel administrativo</Text>
        <Text style={styles.headerSubtitle}>
          {count} {count === 1 ? 'produto' : 'produtos'}
        </Text>
      </View>
    </View>
  )
}

function ProductCard({ product }: { product: Product }) {
  const lvl = getStockLevel(product.disponivelReceitas)
  const s = stockStyle(lvl)

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
      ]}
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel={`Editar ${product.nomeReceitas}`}
    >
      <View style={styles.thumb}>
        {product.imgReceitas ? (
          <Image source={{ uri: getRecipeImageUrl(product.imgReceitas) }} style={styles.thumbImg} />
        ) : (
          <Ionicons name="image-outline" size={28} color={COLORS.textMuted} />
        )}
      </View>

      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.name} numberOfLines={1}>
          {product.nomeReceitas}
        </Text>
        <Text style={styles.price}>
          R$ {product.valorReceitas.toFixed(2).replace('.', ',')}
        </Text>
        <View style={[styles.badge, { backgroundColor: s.bg }]}>
          <View style={[styles.dot, { backgroundColor: s.fg }]} />
          <Text style={[styles.badgeText, { color: s.fg }]}>
            {s.label} · {product.disponivelReceitas}
          </Text>
        </View>
      </View>

      <Pressable
        hitSlop={12}
        onPress={(e) => {
          e.stopPropagation()
          // TODO: confirm + delete
        }}
        style={styles.iconBtn}
        accessibilityLabel="Excluir produto"
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  headerSubtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },

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

  chips: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
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
  skeleton: {
    height: 96,
    marginHorizontal: 16,
    marginBottom: 12,
    opacity: 0.5,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImg: { width: '100%', height: '100%' },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.accent },
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
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
})
