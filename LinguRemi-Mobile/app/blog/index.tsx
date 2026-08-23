import { router } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  Animated,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { getBlogRecipeImage, getBlogRecipes } from '../../src/services/blogService'
import type { BlogRecipe } from '../../src/types/BlogRecipe'
import { isAuthenticated } from '@/src/services/authService'
import { useResponsive } from '@/src/hooks/useResponsive'

/* =====================================================
   CARD DE RECEITA (com efeito de hover no desktop)
===================================================== */

function RecipeCard({
  item,
  isDesktop,
  onPress,
}: {
  item: BlogRecipe
  isDesktop: boolean
  onPress: () => void
}) {
  const translateY = useRef(new Animated.Value(0)).current
  const [isHovered, setIsHovered] = useState(false)

  function animateTo(value: number) {
    Animated.timing(translateY, {
      toValue: value,
      duration: 150, 
      useNativeDriver: true,
    }).start()
  }

  function handleHoverIn() {
    if (!isDesktop) return
    setIsHovered(true)
    animateTo(-4) 
  }

  function handleHoverOut() {
    if (!isDesktop) return
    setIsHovered(false)
    animateTo(0)
  }

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        isDesktop && styles.cardWrapperDesktop,
        isDesktop && isHovered && styles.cardHoveredDesktop,
        { transform: [{ translateY }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        accessibilityRole="button"
        accessibilityLabel={item.nomeReceitablog}
        style={({ pressed }) => [
          styles.card,
          isDesktop && styles.cardDesktop,
          pressed && !isDesktop && styles.cardPressed,
        ]}
      >
        {/* =================================================
            IMAGEM
        ================================================= */}

        {item.imgReceitablog ? (
          <Image
            source={{ uri: getBlogRecipeImage(item.imgReceitablog) }}
            style={[styles.image, isDesktop && styles.imageDesktop]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              isDesktop && styles.imagePlaceholderDesktop,
            ]}
          >
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}

        {/* =================================================
            CONTEÚDO
        ================================================= */}

        <View
          style={[styles.cardContent, isDesktop && styles.cardContentDesktop]}
        >
          <Text style={styles.date}>
            {item.dataReceitablog
              ? new Date(item.dataReceitablog).toLocaleDateString('pt-BR')
              : 'Data não informada'}
          </Text>

          <Text
            style={styles.recipeTitle}
            numberOfLines={isDesktop ? 2 : undefined}
          >
            {item.nomeReceitablog}
          </Text>

          <Text style={styles.description} numberOfLines={3}>
            {item.descricaoReceitablog}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

/* =====================================================
   TELA PRINCIPAL
===================================================== */

export default function BlogScreen() {
  const [recipes, setRecipes] = useState<BlogRecipe[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const { isDesktop } = useResponsive()

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getBlogRecipes()
        setRecipes(data)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipes()
  }, [])

  async function handleAdicionarReceita() {
    const authenticated = await isAuthenticated()

    if (!authenticated) {
      setLoginModalVisible(true)
      return
    }

    router.push('/blog/adicionar')
  }

  const filteredRecipes = useMemo(() => {
    const term = search.toLowerCase().trim()

    if (!term) {
      return recipes
    }

    return recipes.filter((recipe) => {
      return (
        (recipe.nomeReceitablog || '').toLowerCase().includes(term) ||
        (recipe.descricaoReceitablog || '').toLowerCase().includes(term) ||
        (recipe.ingredientesReceitablog || '').toLowerCase().includes(term)
      )
    })
  }, [recipes, search])

  const displayRecipes = useMemo<(BlogRecipe | null)[]>(() => {
    if (!isDesktop) {
      return filteredRecipes
    }

    if (filteredRecipes.length % 2 !== 0) {
      return [...filteredRecipes, null]
    }

    return filteredRecipes
  }, [filteredRecipes, isDesktop])

  return (
    <View style={styles.container}>
      {/* =====================================================
          BUSCA
      ===================================================== */}

      <View style={[styles.searchRow, isDesktop && styles.searchRowDesktop]}>
        <View
          style={[styles.searchContainer, isDesktop && styles.searchContainerDesktop]}
        >
          <TextInput
            placeholder="Buscar receitas..."
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { outlineStyle: 'none' } as any]}
          />

          <Ionicons name="search" size={24} color="#666" style={styles.searchIcon} />
        </View>

        {isDesktop && (
          <Pressable
            style={({ pressed }) => [
              styles.addButtonDesktop,
              pressed && styles.addButtonDesktopPressed,
            ]}
            onPress={handleAdicionarReceita}
            accessibilityRole="button"
            accessibilityLabel="Adicionar receita"
          >
            <Text style={styles.addButtonDesktopText}>Adicionar Receita</Text>
            <Ionicons name="add" size={18} color="#fff" />
          </Pressable>
        )}
      </View>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

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
          data={displayRecipes}
          keyExtractor={(item, index) =>
            item ? String(item.idReceitaBlog) : `empty-${index}`
          }
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, isDesktop && styles.listDesktop]}
          columnWrapperStyle={[
            styles.recipeRow,
            isDesktop && styles.recipeRowDesktop,
          ]}
          renderItem={({ item }) => {
            /*
             * ITEM VAZIO
             *
             * É utilizado somente quando a quantidade
             * de receitas é ímpar no desktop.
             *
             * Ele ocupa o espaço da segunda coluna,
             * mas não aparece visualmente.
             */
            if (!item) {
              return (
                <View
                  style={[
                    styles.cardWrapper,
                    isDesktop && styles.cardWrapperDesktop,
                    styles.emptyCard,
                  ]}
                />
              )
            }

            return (
              <RecipeCard
                item={item}
                isDesktop={isDesktop}
                onPress={() => router.push(`/blog/${item.idReceitaBlog}`)}
              />
            )
          }}
        />
      )}

      {/* =====================================================
          BOTÃO ADICIONAR (mobile)
      ===================================================== */}

      {!isDesktop && (
        <Pressable
          style={styles.fab}
          onPress={handleAdicionarReceita}
          accessibilityRole="button"
          accessibilityLabel="Adicionar receita"
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      )}

      {/* =====================================================
          MODAL LOGIN
      ===================================================== */}

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
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Login necessário</Text>

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

  titleDesktop: {
    fontSize: 32,
    marginBottom: 20,
  },

  searchRow: {
    width: '100%',
    marginBottom: 16,
  },

  searchRowDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    maxWidth: 900,
    alignSelf: 'center',
    marginBottom: 20,
  },

  searchContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
  },

  searchContainerDesktop: {
    flex: 1,
    maxWidth: 700,
  },

  searchInput: {
    flex: 1,
    outline: 'none',
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 0,
    
  },

  searchIcon: {
    marginRight: 14,
  },

  addButtonDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#0A0A0A',
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
  },

  addButtonDesktopPressed: {
    opacity: 0.85,
  },

  addButtonDesktopText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
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

  listDesktop: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },

  recipeRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  recipeRowDesktop: {
    justifyContent: 'center',
    gap: 20,
  },

  /*
   * WRAPPER (externo)
   *
   * Controla tamanho, espaçamento e sombra do card
   * na grid, e é o elemento animado — quando o
   * translateY é aplicado aqui, o card inteiro
   * (fundo, borda e sombra) se move junto no hover.
   */
  cardWrapper: {
    width: '48%',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    // @ts-ignore
    transitionProperty: 'box-shadow',
    // @ts-ignore
    transitionDuration: '150ms',
  },

  cardWrapperDesktop: {
    width: '40%',
    height: 192,
    marginBottom: 0,
  },

  /*
   * Estado de hover no desktop: sombra mais forte,
   * dando sensação de que o card "sobe" da tela.
   * Aplicado no wrapper (externo) para não ser
   * cortado pelo overflow: 'hidden' do card interno.
   */
  cardHoveredDesktop: {
    elevation: 10,
    // @ts-ignore -- funciona no react-native-web
    boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
  },

  /*
   * CARD (interno)
   *
   * Visual do card em si: fundo, borda e recorte
   * das bordas arredondadas (por isso overflow: hidden
   * fica aqui, não no wrapper — senão cortaria a sombra).
   */
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ece6dc',
  },

  cardDesktop: {
    flexDirection: 'row',
  },

  /*
   * Card vazio usado somente para ocupar
   * a segunda coluna da última linha.
   *
   * Não possui conteúdo visual.
   */
  emptyCard: {
    backgroundColor: 'transparent',
    elevation: 0,
    opacity: 0,
  },

  cardPressed: {
    opacity: 0.92,
  },

  image: {
    width: '100%',
    height: 190,
  },

  imageDesktop: {
    width: 240,
    height: '100%',
    flexShrink: 0,
  },

  imagePlaceholder: {
    width: '100%',
    height: 190,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagePlaceholderDesktop: {
    width: 240,
    height: '100%',
    flexShrink: 0,
  },

  placeholderText: {
    color: '#777',
  },

  cardContent: {
    padding: 16,
  },

  cardContentDesktop: {
    flex: 1,
    minWidth: 0,
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
    shadowOffset: {
      width: 0,
      height: 6,
    },
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