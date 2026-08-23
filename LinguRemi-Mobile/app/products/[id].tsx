import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { getProductById, getProductImage } from '../../src/services/productService'
import { getCart, saveCart } from '../../src/services/cartService'
import type { Product } from '../../src/types/Product'
import { useResponsive } from '@/src/hooks/useResponsive'

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { isDesktop } = useResponsive()

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setNotFound(true)
        setIsLoading(false)
        return
      }

      const data = await getProductById(id)

      if (!data) {
        setNotFound(true)
      } else {
        setProduct(data)
      }

      setIsLoading(false)
    }

    loadProduct()
  }, [id])

  async function handleAddToCart(redirect = false) {
    if (!product) return

    const minQuantity = product.tipoquantidadeReceitas === 'peso' ? 0.3 : 5

    if (quantity < minQuantity) {
      setMessageType('error')
      setMessage(
        `Quantidade mínima: ${minQuantity}${
          product.tipoquantidadeReceitas === 'peso' ? 'kg' : ' unidades'
        }`
      )
      return
    }

    const cart = await getCart()

    cart.push({
      id: product.idReceitas,
      nome: product.nomeReceitas,
      preco: product.valorReceitas,
      imagem: getProductImage(product.imgReceitas),
      quantidade: quantity,
      tipoQuantidade: product.tipoquantidadeReceitas,
    })

    await saveCart(cart)

    if (redirect) {
      router.push('/cart')
    } else {
      setMessageType('success')
      setMessage(`${product.nomeReceitas} adicionado ao carrinho!`)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Carregando produto...</Text>
      </View>
    )
  }

  if (notFound || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Produto não encontrado.</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isDesktop && styles.contentDesktop,
      ]}
    >
      {message ? (
        <Text
          style={[
            styles.feedback,
            messageType === 'success' ? styles.success : styles.error,
          ]}
        >
          {message}
        </Text>
      ) : null}

      {!isDesktop && (
        <Pressable style={styles.backButton} onPress={() => router.push('/products')}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      )}

      {/* =====================================================
          IMAGEM + INFORMAÇÕES
      ===================================================== */}

      <View style={[styles.infoBox, isDesktop && styles.infoBoxDesktop]}>
        {product.imgReceitas ? (
          <Image
            source={{ uri: getProductImage(product.imgReceitas) }}
            style={[styles.image, isDesktop && styles.imageDesktop]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              isDesktop && styles.imageDesktop,
            ]}
          >
            <Text>Sem imagem</Text>
          </View>
        )}

        <View style={[styles.card, isDesktop && styles.cardDesktop]}>
          <Text style={styles.title}>{product.nomeReceitas}</Text>

          <Text style={styles.rating}>★ {product.avaliacaoReceitas} avaliações</Text>

          <Text style={styles.price}>R$ {product.valorReceitas.toFixed(2)}</Text>

          <Text style={styles.label}>
            {product.tipoquantidadeReceitas === 'peso' ? 'Peso:' : 'Quantidade:'}
          </Text>

          <View style={styles.quantityRow}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(quantity)}
              onChangeText={(text) => {
                const value = Number(text.replace(',', '.'))
                if (value > 0) setQuantity(value)
              }}
            />

            <Text style={styles.unit}>
              {product.tipoquantidadeReceitas === 'peso' ? 'kg' : 'un'}
            </Text>
          </View>

          <Text
            style={[
              styles.stock,
              product.disponivelReceitas <= 0 && styles.unavailable,
            ]}
          >
            {product.disponivelReceitas > 0
              ? `Em estoque (${product.disponivelReceitas} disponíveis)`
              : 'Produto indisponível'}
          </Text>

          <Pressable
            style={[
              styles.button,
              product.disponivelReceitas <= 0 && styles.disabledButton,
            ]}
            disabled={product.disponivelReceitas <= 0}
            onPress={() => handleAddToCart(false)}
          >
            <Text style={styles.buttonText}>Adicionar ao carrinho</Text>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              product.disponivelReceitas <= 0 && styles.disabledButton,
            ]}
            disabled={product.disponivelReceitas <= 0}
            onPress={() => handleAddToCart(true)}
          >
            <Text style={styles.buttonText}>Comprar agora</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionTitle}>Descrição</Text>
        <Text style={styles.description}>
          {product.descReceitas || 'Sem descrição disponível.'}
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f2',
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  /*
   * No desktop, o conteúdo fica centralizado com
   * largura máxima, evitando texto e cards
   * esticados demais em telas grandes.
   */
  contentDesktop: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 24,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },

  feedback: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },

  success: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },

  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
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

  /*
   * CAIXA IMAGEM + INFO
   *
   * Mobile: imagem em cima, card embaixo (fundo
   * transparente, sem padding extra).
   * Desktop: uma "caixa" cinza com sombra,
   * imagem à esquerda e card à direita, lado a
   * lado — igual ao "bg-gray-100 ... lg:flex-row"
   * da versão web.
   */
  infoBox: {},

  infoBoxDesktop: {
    flexDirection: 'row',
    gap: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    marginBottom: 16,
  },

  imageDesktop: {
    width: 600,
    height: 'auto',
    minHeight: 420,
    marginBottom: 0,
    flexShrink: 0,
  },

  imagePlaceholder: {
    height: 260,
    borderRadius: 16,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  cardDesktop: {
    width: 400,
    flexShrink: 0,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  rating: {
    marginTop: 6,
    fontSize: 14,
  },

  price: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '700',
  },

  label: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  input: {
    width: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#fff',
  },

  unit: {
    marginLeft: 10,
    fontSize: 15,
    color: '#666',
  },

  stock: {
    marginTop: 20,
    color: '#333',
  },

  unavailable: {
    color: '#dc2626',
  },

  button: {
    marginTop: 14,
    backgroundColor: '#e5e5e5',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },

  descriptionCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },

  descriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
})