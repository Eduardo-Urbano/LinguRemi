import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {VideoView, useVideoPlayer} from 'expo-video'

import { getRandomRecipes, getRecipeImageUrl } from '../src/services/recipeService'
import type { Recipe } from '../src/types/Recipe'
import { BlogRecipe } from '@/src/types/BlogRecipe'
import {blog4Ultimas, getBlogRecipeImage} from '../src/services/blogService'

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [receitaBlog, setReceitaBlog] = useState<BlogRecipe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadRecipes() {
      const data = await getRandomRecipes()
      setRecipes(data)
      setIsLoading(false)
    }
    loadRecipes()
  }, [])

  useEffect(() => {
    async function loadReceitaBlog() {
      const data = await blog4Ultimas()
      setReceitaBlog(data)
      setIsLoading(false)
    }
    loadReceitaBlog()
  },[])

  const player = useVideoPlayer(
  require('../assets/videos/65692-515098526.mp4'),
  (player) => {
      player.loop = true
      player.muted = true
      player.play()
    },
  )

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <VideoView
          player={player}
          style={styles.backgroundVideo}
          contentFit='cover'
          nativeControls={false}
        />
        <View style={styles.overlay} />

        <View style={styles.heroContent}>
          <Text style={styles.brand}>LinguRémi</Text>

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
              <Text style={styles.primaryButtonText}>Ver produtos</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.push('/blog')}
            >
              <Text style={styles.secondaryButtonText}>Ver receitas</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Descubra novos sabores</Text>
      
{/*///////////////////////////////////////////////////////////////////////////////////*/}
{/*Area que exibe as receitas*/}
{/*///////////////////////////////////////////////////////////////////////////////////*/}
 
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.message}>Carregando receitas...</Text>
        </View>
      ) : recipes.length === 0 ? (
        <Text style={styles.message}>Nenhuma receita encontrada.</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => String(item.idReceitas)}
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recipeList}
          columnWrapperStyle={styles.recipeRow}
          renderItem={({ item }) => (
            <Pressable
              style={styles.recipeCard}
              onPress={() => router.push(`/products/${item.idReceitas}`)}
            >
              {item.imgReceitas ? (
                <Image
                  source={{ uri: getRecipeImageUrl(item.imgReceitas) }}
                  style={styles.recipeImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>Sem imagem</Text>
                </View>
              )}

              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {item.nomeReceitas}
                </Text>

                <Text style={styles.recipeDescription} numberOfLines={3}>
                  {item.descReceitas}
                </Text>

                <Text style={styles.rating}>★ {item.avaliacaoReceitas}</Text>
              </View>
            </Pressable>
          )}
        />

      )}


      <Text style={styles.sectionTitle}>Explore o nosso Blog</Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.message}>Carregando receitas do blog...</Text>
        </View>
      ) : recipes.length === 0 ? (
        <Text style={styles.message}>Nenhuma receita encontrada.</Text>
      ) : (
      <FlatList
        data={receitaBlog}
        keyExtractor={(item) => String(item.idReceitaBlog)}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recipeList}
        columnWrapperStyle={styles.recipeRow}
        renderItem={({item}) => (
          <Pressable
            style={styles.recipeCard}
            onPress={() => router.push(`/blog/${item.idReceitaBlog}`)}
          >
            {item.imgReceitablog ? (
              <Image
                source={{uri: getBlogRecipeImage(item.imgReceitablog)}}
                style={styles.recipeImage}
                resizeMode='cover'
              />
            ) : (

              
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>Sem imagem</Text>
              </View>
            )}

            <View style={styles.recipeContent}>

              <Text style={styles.date}>
                {item.dataReceitablog
                  ? new Date(item.dataReceitablog).toLocaleDateString('pt-BR')
                  : 'Data não informada'}
              </Text>

              <Text style={styles.recipeTitle} numberOfLines={2}>
                {item.nomeReceitablog}
              </Text>

              <Text style={styles.recipeDescription} numberOfLines={3}>
                {item.descricaoReceitablog}
              </Text>



            </View>
          </Pressable>
        )}
      />
      )}

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f2',
  },

  content: {
    paddingBottom: 32,
  },

  hero: {
    height: 360,
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
    padding: 24,
  },

  brand: {
    color: '#f5d7b5',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  heroTitle: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 42,
  },

  heroText: {
    color: '#f3f3f3',
    fontSize: 16,
    marginTop: 12,
    lineHeight: 24,
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
    fontSize: 24,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
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
    paddingHorizontal: 16,
    paddingBottom:24,
    gap: 16,
  },

  recipeRow: {
    justifyContent:'space-between',
    marginBottom: 16,
  },

  recipeCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ece6dc",
  },

  recipeImage: {
    width: '100%',
    height: 150,
  },

  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    color: '#777',
  },

  recipeContent: {
    padding: 14,
  },

  recipeTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },

  recipeDescription: {
    color: '#666',
    lineHeight: 20,
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