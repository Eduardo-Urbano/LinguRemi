import { router } from 'expo-router'
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useRef } from 'react'

import { getBlogRecipeImage } from '../services/blogService'
import { useResponsive } from '../hooks/useResponsive'
import type { BlogRecipe } from '../types/BlogRecipe'

type BlogRecipeCardProps = {
  recipe: BlogRecipe
}

export function BlogRecipeCard({
  recipe,
}: BlogRecipeCardProps) {
  const { isTablet, isDesktop } = useResponsive()

  const translateY = useRef(
    new Animated.Value(0)
  ).current

  function handleOpenRecipe() {
    router.push(`/blog/${recipe.idReceitaBlog}`)
  }

  function handleHoverIn() {
    if (!isDesktop) return

    Animated.timing(translateY, {
      toValue: -4,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  function handleHoverOut() {
    if (!isDesktop) return

    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const imageHeight =
    isDesktop ? 220 :
    isTablet ? 190 :
    150

  const titleSize =
    isDesktop ? 19 :
    isTablet ? 18 :
    17

  const contentPadding =
    isDesktop ? 18 :
    isTablet ? 16 :
    14

  return (
    <Animated.View
      style={[
        styles.shadowContainer,
        {
          transform: [
            {
              translateY,
            },
          ],
        },
      ]}
    >
      <Pressable
        onPress={handleOpenRecipe}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        style={({ pressed }) => [
          styles.card,

          {
            transform: [
              {
                scale:
                  pressed && !isDesktop
                    ? 0.98
                    : 1,
              },
            ],

            opacity:
              pressed && !isDesktop
                ? 0.92
                : 1,
          },
        ]}
      >
        <View style={styles.cardInner}>

          {recipe.imgReceitablog ? (
            <Image
              source={{
                uri: getBlogRecipeImage(
                  recipe.imgReceitablog
                ),
              }}
              style={[
                styles.image,
                {
                  height: imageHeight,
                },
              ]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                {
                  height: imageHeight,
                },
              ]}
            >
              <Text style={styles.placeholderText}>
                Sem imagem
              </Text>
            </View>
          )}

          <View
            style={[
              styles.content,
              {
                padding: contentPadding,
              },
            ]}
          >
            <Text style={styles.date}>
              {recipe.dataReceitablog
                ? new Date(
                    recipe.dataReceitablog
                  ).toLocaleDateString('pt-BR')
                : 'Data não informada'}
            </Text>

            <Text
              style={[
                styles.title,
                {
                  fontSize: titleSize,
                },
              ]}
              numberOfLines={2}
            >
              {recipe.nomeReceitablog}
            </Text>

            <Text
              style={styles.description}
              numberOfLines={
                isDesktop ? 3 : 2
              }
            >
              {recipe.descricaoReceitablog}
            </Text>
          </View>

        </View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  shadowContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ece6dc',
  },

  cardInner: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
  },

  imagePlaceholder: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },

  placeholderText: {
    color: '#777',
    fontSize: 14,
  },

  content: {
    backgroundColor: '#fff',
  },

  date: {
    color: '#999',
    fontSize: 13,
    marginBottom: 6,
  },

  title: {
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },

  description: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
})