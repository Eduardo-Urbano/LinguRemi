import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native'

import { getProductImage } from '../services/productService'
import type { Product } from '../types/Product'

type ProductCardProps = {
  product: Product
  isDesktop?: boolean
}

export function ProductCard({ product, isDesktop = false }: ProductCardProps) {
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

  function handleOpenProduct() {
    router.push(`/products/${product.idReceitas}`)
  }

  return (
    // O Animated.View fica por fora: é ele quem tem a sombra e o
    // transform. Assim, quando anima, o card inteiro (fundo, borda
    // e sombra) sobe junto — não só o conteúdo interno.
    <Animated.View
      style={[
        styles.cardWrapper,
        isDesktop && isHovered && styles.cardHoveredDesktop,
        { transform: [{ translateY }] },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && !isDesktop && styles.cardPressed,
        ]}
        onPress={handleOpenProduct}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        accessibilityRole="button"
        accessibilityLabel={product.nomeReceitas}
      >
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
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  /*
   * WRAPPER (externo)
   *
   * A largura da coluna (48% no mobile, 32% no desktop)
   * é controlada pelo wrapper em ProductsScreen — aqui
   * o card sempre preenche 100% do espaço que recebe.
   * É este elemento que tem a sombra e é animado no hover.
   */
  cardWrapper: {
    width: '100%',
    borderRadius: 16,
    elevation: 3,
    // @ts-ignore
    transitionProperty: 'box-shadow',
    // @ts-ignore
    transitionDuration: '150ms',
  },

  /*
   * Estado de hover no desktop: sombra mais forte,
   * dando sensação de que o card "sobe" da tela.
   * Aplicado no wrapper para não ser cortado pelo
   * overflow: 'hidden' do card interno.
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
   * das bordas arredondadas.
   */
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ece6dc',
  },

  cardPressed: {
    opacity: 0.92,
  },

  image: {
    width: '100%',
    height: 150,
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