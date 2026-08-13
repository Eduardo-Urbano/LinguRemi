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

import { getProductImage } from '../services/productService'
import { useResponsive } from '../hooks/useResponsive'
import { Recipe } from '../types/Recipe'

type RecipeCardProps = {
  product: Recipe
}

export function RecipeCard({ product }: RecipeCardProps) {
  const { isTablet, isDesktop } = useResponsive()

  const translateY = useRef(
    new Animated.Value(0)
  ).current

  function handleOpenProduct() {
    router.push(`/products/${product.idReceitas}`)
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
    isDesktop ? 192 :
    isTablet ? 180 :
    150

  const titleSize =
    isDesktop ? 18 :
    isTablet ? 17 :
    16

  const contentPadding =
    isDesktop ? 16 :
    isTablet ? 14 :
    12

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
        onPress={handleOpenProduct}
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

          {product.imgReceitas ? (
            <Image
              source={{
                uri: getProductImage(
                  product.imgReceitas
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
            <View style={styles.header}>
              <Text
                style={[
                  styles.name,
                  {
                    fontSize: titleSize,
                  },
                ]}
                numberOfLines={2}
              >
                {product.nomeReceitas}
              </Text>

              <Text style={styles.rating}>
                ★ {product.avaliacaoReceitas}
              </Text>
            </View>

            <Text
              style={styles.description}
              numberOfLines={
                isDesktop ? 3 : 2
              }
            >
              {product.descReceitas}
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },

  name: {
    flex: 1,
    fontWeight: '700',
    marginBottom: 8,
  },

  rating: {
    marginTop: 4,
    fontSize: 14,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
})