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
  Animated,
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
import { RecipeCard } from '@/src/components/RecipeCard'
import { BlogRecipeCard } from '@/src/components/BlogRecipeCard'
import { useRef } from 'react'

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [receitaBlog, setReceitaBlog] = useState<BlogRecipe[]>([])
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true)
  const [isLoadingBlog, setIsLoadingBlog] = useState(true)
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const styles = createStyles(isTablet, isDesktop)
  const primaryHover = useRef(new Animated.Value(0)).current
  const secondaryHover = useRef(new Animated.Value(0)).current

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

  function animatePrimary(value: number) {
    Animated.timing(primaryHover, {
      toValue: value,
      duration: 180,
      useNativeDriver: false,
    }).start()
  }

  function animateSecondary(value: number) {
    Animated.timing(secondaryHover, {
      toValue: value,
      duration: 180,
      useNativeDriver: false,
    }).start()
  }

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
              onPress={() => router.push('/products')}
              onHoverIn={() => animatePrimary(1)}
              onHoverOut={() => animatePrimary(0)}
            >
              <Animated.View
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: primaryHover.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#fff', 'transparent'],
                    }),
                  },
                ]}
              >
                <Animated.Text
                  style={[
                    styles.primaryButtonText,
                    {
                      color: primaryHover.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['#3b2417', '#EFEFEF'],
                      }),
                    },
                  ]}
                >
                  Ver produtos
                </Animated.Text>
              </Animated.View>
            </Pressable>

            <Pressable
              onPress={() => router.push('/blog')}
              onHoverIn={() => animateSecondary(1)}
              onHoverOut={() => animateSecondary(0)}
            >
              <Animated.View
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: secondaryHover.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['transparent', '#fff'],
                    }),
                  },
                ]}
              >
                <Animated.Text
                  style={[
                    styles.secondaryButtonText,
                    {
                      color: secondaryHover.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['#fff', '#3b2417'],
                      }),
                    },
                  ]}
                >
                  Ver receitas
                </Animated.Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>

{/* /////////////////////////////////////////////////////////////////
      Receitas 
    /////////////////////////////////////////////////////////////////  */}

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
          {(isDesktop ? recipes.slice(0,3) :recipes).map((item) => (
            <View
              key={item.idReceitas}
              style={styles.recipeItem}
            >
              <RecipeCard product={item} />
            </View>
          ))}
        </View>
      )}

{/* /////////////////////////////////////////////////////////////////
      Blog 
    /////////////////////////////////////////////////////////////////  */}

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
          {(isDesktop ? receitaBlog.slice(0,3) :receitaBlog).map((item) => (
              <View
                key={item.idReceitaBlog}
                style={styles.recipeItem}
              >
                <BlogRecipeCard recipe={item} />
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
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 14,
      borderColor: '#fff',
  
    },

    primaryButtonText: {
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
      fontWeight: '700',
    },

    sectionTitle: {
      fontSize: sectionTitleFontSize,
      fontWeight: '800',
      marginTop: isDesktop ? 40 : 24,
      marginBottom: 16,
      paddingHorizontal: isDesktop ? 32 : 16,
      alignSelf: 'center',
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
          ? '30%'
          : isTablet
            ? '31%'
            : '48%',
    },

    blogItem: {
      width:
        isDesktop
          ? '30%'
          : isTablet
            ? '31%'
            : '48%',
    },

    
  })
}