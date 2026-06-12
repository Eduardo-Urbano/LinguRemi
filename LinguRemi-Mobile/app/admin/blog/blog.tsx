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
  Modal,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'

import { isAuthenticated, isAdmin } from '../../../src/services/authService'
import { getBlogRecipeImage } from '../../../src/services/blogService'
import { getAdminBlogRecipes, deleteBlogRecipe } from '../../../src/services/adminService'
import type { BlogRecipe } from '../../../src/types/BlogRecipe'

const COLORS = {
  bg: '#faf7f2',
  surface: '#ffffff',
  text: '#1a1a1a',
  textMuted: '#6b6b6b',
  border: '#ece6dc',
  accent: '#b4513b',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
}

export default function AdminBlog() {
  const [recipes, setRecipes] = useState<BlogRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [query, setQuery] = useState('')
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<BlogRecipe | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await getAdminBlogRecipes()
      setRecipes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.log('Erro ao carregar receitas do blog admin:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return recipes

    return recipes.filter((r) =>
      (r.nomeReceitablog || '').toLowerCase().includes(q) ||
      (r.descricaoReceitablog || '').toLowerCase().includes(q) ||
      (r.ingredientesReceitablog || '').toLowerCase().includes(q)
    )
  }, [recipes, query])

  const renderItem = useCallback(
    ({ item }: { item: BlogRecipe }) => (
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
          setSelectedRecipe(item)
          setDeleteModalVisible(true)
        }}
      >
        <BlogCard recipe={item} />
      </ReanimatedSwipeable>
    ),
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
      <Header count={recipes.length} />

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar receitas..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.search}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.idReceitaBlog)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 12 }}
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
            <Ionicons name="book-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Nenhuma receita encontrada</Text>
            <Text style={styles.emptyText}>
              Tente ajustar a busca ou criar uma nova receita.
            </Text>
          </View>
        }
      />

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
            <Text style={styles.modalTitle}>Excluir receita</Text>

            <Text style={styles.modalText}>
              Deseja excluir {selectedRecipe?.nomeReceitablog}?
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
                  if (!selectedRecipe) return

                  await deleteBlogRecipe(selectedRecipe.idReceitaBlog)

                  setDeleteModalVisible(false)
                  setSelectedRecipe(null)
                  load()
                }}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

function Header({ count }: { count: number }) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={() => router.push('/admin')}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>

      <Text style={styles.headerTitle}>Receitas do blog</Text>

      <Text style={styles.headerSubtitle}>
        {count} {count === 1 ? 'receita' : 'receitas'}
      </Text>
    </View>
  )
}

function BlogCard({ recipe }: { recipe: BlogRecipe }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
      ]}
      onPress={() =>
        router.push({
          pathname: '/blog/[id]',
          params: {
            id: String(recipe.idReceitaBlog),
          },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${recipe.nomeReceitablog}`}
    >
      <View style={styles.thumb}>
        {recipe.imgReceitablog ? (
          <Image
            source={{ uri: getBlogRecipeImage(recipe.imgReceitablog) }}
            style={styles.thumbImg}
          />
        ) : (
          <Ionicons name="image-outline" size={28} color={COLORS.textMuted} />
        )}
      </View>

      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.name} numberOfLines={1}>
          {recipe.nomeReceitablog}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {recipe.descricaoReceitablog}
        </Text>

        <Text style={styles.date}>
          {recipe.dataReceitablog
            ? new Date(recipe.dataReceitablog).toLocaleDateString('pt-BR')
            : 'Data não informada'}
        </Text>
      </View>

      <View style={styles.iconBtn}>
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </View>
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

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },

  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },

  backButtonText: {
    color: '#fff',
    fontWeight: '700',
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

  search: {
    flex: 1,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 15,
  },

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

  thumbImg: {
    width: '100%',
    height: '100%',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  description: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  date: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '700',
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerSoft,
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 8,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  deleteAction: {
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    borderRadius: 16,
  },

  deleteText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

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

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3b2417',
    marginBottom: 10,
  },

  modalText: {
    fontSize: 16,
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

  cancelButtonText: {
    color: '#444',
    fontWeight: '700',
  },

  deleteButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
  },

  deleteButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
})