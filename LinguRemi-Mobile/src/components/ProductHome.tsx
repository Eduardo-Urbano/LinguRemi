import { router } from 'expo-router'
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { getProductImage } from '../services/productService'
import type { Product } from '../types/Product'
import { useResponsive } from '../hooks/useResponsive'
import { Recipe } from '../types/Recipe'

type RecipeCardProps = {
  product: Recipe
}

export function ProductHome({ product }: RecipeCardProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  function handleOpenProduct() {
    router.push(`/products/${product.idReceitas}`)
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
    <Pressable
      onPress={handleOpenProduct}
      style={({ pressed }) => [
        styles.card,
        {
          opacity: pressed ? 0.9 : 1,
          transform: [
            {
              scale: pressed ? 0.98 : 1,
            },
          ],
        },
      ]}
    >
      {product.imgReceitas ? (
        <Image
          source={{
            uri: getProductImage(product.imgReceitas),
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
          numberOfLines={isDesktop ? 3 : 2}
        >
          {product.descReceitas}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
  flex: 1,
  width: '100%',

  backgroundColor: '#fff',
  borderRadius: 16,
  overflow: 'hidden',
  elevation: 3,
  borderWidth: 1,
  borderColor: '#ece6dc',
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
    flex: 1,
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

  price: {
    fontSize: 16,
    fontWeight: '600',
  },
})