import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import {
  calculateTotal,
  clearCart,
  getCart,
  saveCart,
  validateCart,
  type CartItem,
} from '../src/services/cartService'

export default function CartScreen() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    async function loadCart() {
      const data = await getCart()
      setCart(data)
    }

    loadCart()
  }, [])

  async function updateQuantity(index: number, value: number) {
    if (value < 1) return

    const newCart = [...cart]
    newCart[index].quantidade = value

    setCart(newCart)
    await saveCart(newCart)
  }

  async function removeItem(index: number) {
    const newCart = cart.filter((_, i) => i !== index)

    setCart(newCart)
    await saveCart(newCart)
  }

  async function handleCheckout() {
    if (cart.length === 0) {
      setMessageType('error')
      setMessage('Carrinho vazio!')
      return
    }

    if (!validateCart(cart)) {
      setMessageType('error')
      setMessage('Carrinho inválido. Tente novamente.')
      return
    }

    setMessageType('success')
    setMessage('Compra finalizada com sucesso!')

    await clearCart()
    setCart([])
  }

  const total = calculateTotal(cart)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho</Text>

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

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>

          <Pressable style={styles.backButton} onPress={() => router.push('/products')}>
            <Text style={styles.backButtonText}>Ver produtos</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(_, index) => String(index)}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => {
              const itemTotal =
                item.tipoQuantidade === 'peso'
                  ? item.preco * item.quantidade * 10
                  : item.preco * item.quantidade

              return (
                <View style={styles.item}>
                  {item.imagem ? (
                    <Image
                      source={{ uri: item.imagem }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.placeholderText}>Sem imagem</Text>
                    </View>
                  )}

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.nome}</Text>

                    <Pressable onPress={() => removeItem(index)}>
                      <Text style={styles.removeText}>Remover</Text>
                    </Pressable>

                    <View style={styles.quantityRow}>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(item.quantidade)}
                        onChangeText={(text) => {
                          const value = Number(text.replace(',', '.'))
                          if (value > 0) updateQuantity(index, value)
                        }}
                      />

                      <Text style={styles.unit}>
                        {item.tipoQuantidade === 'peso' ? 'kg' : 'un'}
                      </Text>
                    </View>

                    <Text style={styles.itemTotal}>
                      R$ {itemTotal.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )
            }}
          />

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Resumo</Text>

            <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

            <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Finalizar compra</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
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

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: '#222',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },

  backButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  list: {
    paddingBottom: 16,
  },

  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    elevation: 3,
  },

  image: {
    width: 110,
    height: 100,
    borderRadius: 12,
  },

  imagePlaceholder: {
    width: 110,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    fontSize: 12,
    color: '#777',
  },

  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },

  itemName: {
    fontSize: 16,
    fontWeight: '700',
  },

  removeText: {
    marginTop: 6,
    color: '#dc2626',
    fontWeight: '600',
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  input: {
    width: 70,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    textAlign: 'center',
    backgroundColor: '#fff',
  },

  unit: {
    marginLeft: 8,
    color: '#666',
  },

  itemTotal: {
    marginTop: 10,
    fontWeight: '700',
  },

  summary: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 18,
  },

  summaryTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },

  total: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },

  checkoutButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },

  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})