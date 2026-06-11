import { router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { getBlogRecipeImage, getBlogRecipes } from '../../src/services/blogService'
import type { BlogRecipe } from '../../src/types/BlogRecipe'
import { isAuthenticated } from '@/src/services/authService'

export default function BlogScreen() {
  const [recipes, setRecipes] = useState<BlogRecipe[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loginModalVisible, setLoginModalVisible] = useState(false)

  useEffect(() => {
    async function loadRecipes() {
      const data = await getBlogRecipes()
      setRecipes(data)
      setIsLoading(false)
    }

    loadRecipes()
  }, [])

  async function handleAdicionarReceita() {
    const authenticated = await isAuthenticated()
    console.log(authenticated)
    if (!authenticated) {
      setLoginModalVisible(true)
      return
    }

    router.push('/blog/adicionar')
  }

  const filteredRecipes = useMemo(() => {
    const term = search.toLowerCase().trim()

    if (!term) return recipes

    return recipes.filter((recipe) => {
      return (
        (recipe.nomeReceitablog || '').toLowerCase().includes(term) ||
        (recipe.descricaoReceitablog || '').toLowerCase().includes(term) ||
        (recipe.ingredientesReceitablog || '').toLowerCase().includes(term)
      )
    })
  }, [recipes, search])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blog de Receitas</Text>

      <TextInput
        placeholder="Buscar receitas..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.message}>Carregando receitas...</Text>
        </View>
      ) : filteredRecipes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.message}>Nenhuma receita encontrada.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => String(item.idReceitaBlog)}
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.recipeRow}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/blog/${item.idReceitaBlog}`)}
            >
              {item.imgReceitablog ? (
                <Image
                  source={{ uri: getBlogRecipeImage(item.imgReceitablog) }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>Sem imagem</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <Text style={styles.date}>
                  {item.dataReceitablog
                    ? new Date(item.dataReceitablog).toLocaleDateString('pt-BR')
                    : 'Data não informada'}
                </Text>

                <Text style={styles.recipeTitle}>{item.nomeReceitablog}</Text>

                <Text style={styles.description} numberOfLines={3}>
                  {item.descricaoReceitablog}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
      <Pressable
        style={styles.fab}
        onPress={handleAdicionarReceita}
        accessibilityRole="button"
        accessibilityLabel="Criar novo produto"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
      <Modal
        visible={loginModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLoginModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLoginModalVisible(false)}
        >
          <Pressable
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              Login necessário
            </Text>

            <Text style={styles.modalText}>
              Apenas usuários autenticados podem adicionar receitas.
            </Text>

      
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setLoginModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.loginButton}
                onPress={() => {
                  setLoginModalVisible(false)
                  router.push('/login')
                }}
              >
                <Text style={styles.loginButtonText}>Fazer login</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
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

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },

  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },

  list: {
    paddingBottom: 24,
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ece6dc",
  },

  image: {
    width: '100%',
    height: 190,
  },

  imagePlaceholder: {
    width: '100%',
    height: 190,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    color: '#777',
  },

  cardContent: {
    padding: 16,
  },

  date: {
    color: '#999',
    marginBottom: 6,
  },

  recipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  description: {
    color: '#666',
    lineHeight: 20,
  },
  recipeRow: {
    justifyContent:'space-between',
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#b4513b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#b4513b',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
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

loginButton: {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  backgroundColor: '#b4513b',
},

loginButtonText: {
  color: '#fff',
  fontWeight: '700',
},
})