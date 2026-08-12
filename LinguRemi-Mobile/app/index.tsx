import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { VideoView, useVideoPlayer } from 'expo-video'

import { getRandomRecipes } from '../src/services/recipeService'
import type { Recipe } from '../src/types/Recipe'
import { BlogRecipe } from '@/src/types/BlogRecipe'
import {
  blog4Ultimas,
  getBlogRecipeImage,
} from '../src/services/blogService'
import { useResponsive } from '@/src/hooks/useResponsive'
import { ProductHome } from '@/src/components/ProductHome'

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [receitaBlog, setReceitaBlog] = useState<BlogRecipe[]>([])
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true)
  const [isLoadingBlog, setIsLoadingBlog] = useState(true)

  const { isMobile, isTablet, isDesktop } = useResponsive()

  const styles = createStyles(isTablet, isDesktop)

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getRandomRecipes()
        setRecipes(data)
      } finally {
        setIsLoadingRecipes(false)
      }
    }

    loadRecipes()
  }, [])

  useEffect(() => {
    async function loadReceitaBlog() {
      try {
        const data = await blog4Ultimas()
        setReceitaBlog(data)
      } finally {
        setIsLoadingBlog(false)
      }
    }

    loadReceitaBlog()
  }, [])

  const player = useVideoPlayer(
    require('../assets/videos/65692-515098526.mp4'),
    (player) => {
      player.loop = true
      player.muted = true
      player.play()
    },
  )

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* HERO */}
      <View style={styles.hero}>
        <VideoView
          player={player}
          style={styles.backgroundVideo}
          contentFit="cover"
          nativeControls={false}
        />

        <View style={styles.overlay} />

        <View style={styles.heroContent}>
          <Text style={styles.brand}>
            LinguRémi
          </Text>

          <Text style={styles.heroTitle}>
            Doce que encanta, sabor que fica.
          </Text>

          <Text style={styles.heroText}>
            Conheça nossos doces artesanais e descubra novas receitas.
          </Text>

          <View style={styles.actions}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push('/products')}
            >
              <Text style={styles.primaryButtonText}>
                Ver produtos
              </Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.push('/blog')}
            >
              <Text style={styles.secondaryButtonText}>
                Ver receitas
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* RECEITAS */}
      <Text style={styles.sectionTitle}>
        Descubra novos sabores
      </Text>

      {isLoadingRecipes ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />

          <Text style={styles.message}>
            Carregando receitas...
          </Text>
        </View>
      ) : recipes.length === 0 ? (
        <Text style={styles.message}>
          Nenhuma receita encontrada.
        </Text>
      ) : (
        <View style={styles.recipeList}>
          {recipes.map((item) => (
            <View
              key={item.idReceitas}
              style={styles.recipeItem}
            >
              <ProductHome product={item} />
            </View>
          ))}
        </View>
      )}

      {/* BLOG */}
      <Text style={styles.sectionTitle}>
        Explore o nosso Blog
      </Text>

      {isLoadingBlog ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />

          <Text style={styles.message}>
            Carregando receitas do blog...
          </Text>
        </View>
      ) : receitaBlog.length === 0 ? (
        <Text style={styles.message}>
          Nenhuma receita encontrada.
        </Text>
      ) : (
        <View style={styles.recipeList}>
          {receitaBlog.map((item) => (
            <View
              key={item.idReceitaBlog}
              style={styles.recipeItem}
            >
              <Pressable
                style={styles.recipeCard}
                onPress={() =>
                  router.push(`/blog/${item.idReceitaBlog}`)
                }
              >
                {item.imgReceitablog ? (
                  <Image
                    source={{
                      uri: getBlogRecipeImage(item.imgReceitablog),
                    }}
                    style={styles.recipeImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>
                      Sem imagem
                    </Text>
                  </View>
                )}

                <View style={styles.recipeContent}>
                  <Text style={styles.date}>
                    {item.dataReceitablog
                      ? new Date(
                          item.dataReceitablog,
                        ).toLocaleDateString('pt-BR')
                      : 'Data não informada'}
                  </Text>

                  <Text
                    style={styles.recipeTitle}
                    numberOfLines={2}
                  >
                    {item.nomeReceitablog}
                  </Text>

                  <Text
                    style={styles.recipeDescription}
                    numberOfLines={3}
                  >
                    {item.descricaoReceitablog}
                  </Text>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

function createStyles(
  isTablet: boolean,
  isDesktop: boolean,
) {
  const heroHeight =
    isDesktop ? 600 :
    isTablet ? 500 :
    360

  const heroTitleFontSize =
    isDesktop ? 48 :
    isTablet ? 40 :
    34

  const heroTitleLineHeight =
    isDesktop ? 56 :
    isTablet ? 48 :
    42

  const sectionTitleFontSize =
    isDesktop ? 32 :
    isTablet ? 28 :
    24

  const recipeImageHeight =
    isDesktop ? 220 :
    isTablet ? 190 :
    150

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#faf7f2',
    },

    content: {
      paddingBottom: 32,
    },

    hero: {
      height: heroHeight,
      backgroundColor: '#3b2417',
      justifyContent: 'center',
      position: 'relative',
    },

    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },

    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.25)',
    },

    heroContent: {
      position: 'relative',
      padding: isDesktop ? 48 : 24,
      maxWidth: isDesktop ? 700 : undefined,
    },

    brand: {
      color: '#f5d7b5',
      fontSize: isDesktop ? 22 : 18,
      fontWeight: '700',
      marginBottom: 12,
    },

    heroTitle: {
      color: '#fff',
      fontSize: heroTitleFontSize,
      lineHeight: heroTitleLineHeight,
      fontWeight: '800',
    },

    heroText: {
      color: '#f3f3f3',
      fontSize: isDesktop ? 18 : 16,
      marginTop: 12,
      lineHeight: isDesktop ? 28 : 24,
      maxWidth: isDesktop ? 600 : undefined,
    },

    actions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },

    primaryButton: {
      backgroundColor: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 14,
    },

    primaryButtonText: {
      color: '#3b2417',
      fontWeight: '700',
    },

    secondaryButton: {
      borderWidth: 1,
      borderColor: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 14,
    },

    secondaryButtonText: {
      color: '#fff',
      fontWeight: '700',
    },

    sectionTitle: {
      fontSize: sectionTitleFontSize,
      fontWeight: '800',
      marginTop: isDesktop ? 40 : 24,
      marginBottom: 16,
      paddingHorizontal: isDesktop ? 32 : 16,
    },

    loadingContainer: {
      paddingVertical: 40,
      alignItems: 'center',
    },

    message: {
      textAlign: 'center',
      color: '#666',
      fontSize: 16,
      marginTop: 12,
    },

    recipeList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',

      paddingHorizontal: isDesktop ? 32 : 16,
      paddingBottom: 24,

      gap: isDesktop ? 24 : 16,
    },

    recipeItem: {
      width:
        isDesktop
          ? '23%'
          : isTablet
            ? '31%'
            : '48%',
    },

    recipeCard: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 3,
      borderWidth: 1,
      borderColor: '#ece6dc',
    },

    recipeImage: {
      width: '100%',
      height: recipeImageHeight,
    },

    imagePlaceholder: {
      width: '100%',
      height: recipeImageHeight,
      backgroundColor: '#eee',
      alignItems: 'center',
      justifyContent: 'center',
    },

    placeholderText: {
      color: '#777',
    },

    recipeContent: {
      padding: isDesktop ? 18 : 14,
    },

    recipeTitle: {
      fontSize: isDesktop ? 19 : 17,
      fontWeight: '700',
      marginBottom: 8,
    },

    recipeDescription: {
      color: '#666',
      lineHeight: 20,
      fontSize: isDesktop ? 15 : 14,
    },

    rating: {
      marginTop: 12,
      fontWeight: '700',
    },

    date: {
      color: '#999',
      marginBottom: 6,
    },
  })
}