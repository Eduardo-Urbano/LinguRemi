import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { getBlogRecipeById, getBlogRecipeImage } from '../../src/services/blogService'
import type { BlogRecipe } from '../../src/types/BlogRecipe'

export default function RecipeBlogDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const [recipe, setRecipe] = useState<BlogRecipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadRecipe() {
      if (!id) {
        setNotFound(true)
        setIsLoading(false)
        return
      }

      const data = await getBlogRecipeById(id)

      if (!data) {
        setNotFound(true)
      } else {
        setRecipe(data)
      }

      setIsLoading(false)
    }

    loadRecipe()
  }, [id])

  const ingredientes = useMemo(() => {
    if (!recipe?.ingredientesReceitablog) return []

    return recipe.ingredientesReceitablog
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }, [recipe])

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Carregando receita...</Text>
      </View>
    )
  }

  if (notFound || !recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Receita não encontrada.</Text>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>

      <Text style={styles.title}>{recipe.nomeReceitablog}</Text>

      {recipe.imgReceitablog ? (
        <Image
          source={{ uri: getBlogRecipeImage(recipe.imgReceitablog) }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>Sem imagem</Text>
        </View>
      )}

      <Text style={styles.time}>
        Tempo de preparo: {recipe.tempoReceitablog || 'Não informado'}
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>

        {ingredientes.length === 0 ? (
          <Text style={styles.text}>Ingredientes não informados.</Text>
        ) : (
          ingredientes.map((item, index) => (
            <Text key={`${item}-${index}`} style={styles.listItem}>
              • {item}
            </Text>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Descrição</Text>

        <Text style={styles.text}>
          {recipe.descricaoReceitablog || 'Descrição não informada.'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Modo de Preparo</Text>

        <Text style={styles.text}>
          {recipe.preparoReceitaBlog || 'Modo de preparo não informado.'}
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
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

  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },

  image: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    marginBottom: 18,
  },

  imagePlaceholder: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  placeholderText: {
    color: '#777',
  },

  time: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },

  listItem: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
  },
})