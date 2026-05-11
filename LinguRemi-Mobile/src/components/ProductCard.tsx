import { router } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

import { getProductImage } from '../services/productService'
import type { Product } from '../types/Product'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  function handleOpenProduct() {
    router.push(`/products/${product.idReceitas}`)
  }

  return (
    <Pressable style={styles.card} onPress={handleOpenProduct}>
      {product.imgReceitas ? (
        <Image
          source={{ uri: getProductImage(product.imgReceitas) }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>Sem imagem</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{product.nomeReceitas}</Text>

          <Text style={styles.rating}>
            ★ {product.avaliacaoReceitas}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {product.descReceitas}
        </Text>

        <Text style={styles.price}>
          R$ {product.valorReceitas.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
  },

  image: {
    width: '100%',
    height: 190,
  },

  imagePlaceholder: {
    width: '100%',
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },

  placeholderText: {
    color: '#777',
    fontSize: 14,
  },

  content: {
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },

  rating: {
    fontSize: 14,
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },

  price: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '700',
  },
})