import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  FlatList,
  Image,
  Modal,
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
  type CartItem,
} from '../src/services/cartService'

import * as Linking from 'expo-linking'
import { createCheckout } from '../src/services/checkoutService'
import * as Clipboard from 'expo-clipboard'
import LoadingModal from '../src/components/feedback/LoadingModal'
import SuccessModal from '../src/components/feedback/SuccessModal'
import ErrorModal from '../src/components/feedback/ErrorModal'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useResponsive } from '@/src/hooks/useResponsive'
import { Ionicons } from '@expo/vector-icons'

export default function CartScreen() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [message, setMessage] = useState('')
  const [paymentLink, setPaymentLink] = useState('')
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)

  const { isDesktop } = useResponsive()

  useFocusEffect(
    useCallback(() => {
      async function loadCart() {
        const data = await getCart()
        setCart(data)
      }

      loadCart()
    }, [])
  )

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
    try {
      setLoading(true)

      const itens = cart.map((item) => ({
        produtoId: item.id,
        quantidade: item.quantidade,
      }))

      const response = await createCheckout({
        itens,
      })

      setSuccessVisible(true)

      setTimeout(() => {
        setSuccessVisible(false)

        if (response.linkPagamento) {
          setPaymentLink(response.linkPagamento)
          setPaymentModalVisible(true)
        }
      }, 1500)

      await clearCart()
      setCart([])

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Erro ao criar checkout'
      )

      setErrorVisible(true)

      setTimeout(() => {
        setErrorVisible(false)
      }, 2500)

    } finally {
      setLoading(false)
    }
  }

  async function increaseQuantity(index: number) {
    const newCart = [...cart]

    if (newCart[index].tipoQuantidade === 'peso') {
      newCart[index].quantidade = Number(
        (newCart[index].quantidade + 0.1).toFixed(1)
      )
    } else {
      newCart[index].quantidade += 1
    }

    setCart(newCart)
    await saveCart(newCart)
  }

  async function decreaseQuantity(index: number) {
    const newCart = [...cart]

    const step =
      newCart[index].tipoQuantidade === 'peso'
        ? 0.1
        : 1

    const min =
      newCart[index].tipoQuantidade === 'peso'
        ? 0.1
        : 5

    if (newCart[index].quantidade <= min) {
      return
    }

    newCart[index].quantidade = Number(
      (newCart[index].quantidade - step).toFixed(1)
    )

    setCart(newCart)
    await saveCart(newCart)
  }

  const total = calculateTotal(cart)

  function getItemTotal(item: CartItem) {
    return item.tipoQuantidade === 'peso'
      ? item.preco * item.quantidade * 10
      : item.preco * item.quantidade
  }

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>

          <Pressable style={styles.backButton} onPress={() => router.push('/products')}>
            <Text style={styles.backButtonText}>Ver produtos</Text>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.body, isDesktop && styles.bodyDesktop]}>
          <View style={[styles.listContainer, isDesktop && styles.listContainerDesktop]}>
            <FlatList
              data={cart}
              keyExtractor={(_, index) => String(index)}
              contentContainerStyle={styles.list}
              renderItem={({ item, index }) => {
                const itemTotal = getItemTotal(item)

                const minQuantity =
                  item.tipoQuantidade === 'peso' ? 0.1 : 5

                const isAtMin = item.quantidade <= minQuantity

                const itemContent = (
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
                      <View style={styles.itemNameRow}>
                        <Text style={styles.itemName}>{item.nome}</Text>
                      </View>

                      {/* Preço unitário, para deixar claro como
                          o total do item é calculado */}
                      <Text style={styles.unitPrice}>
                        R$ {(item.tipoQuantidade === 'peso'
                          ? item.preco * 10
                          : item.preco
                        ).toFixed(2)}
                        {item.tipoQuantidade === 'peso' ? '/kg' : '/un'}
                      </Text>

                      <View style={styles.quantityRow}>
                        <Pressable
                          style={[
                            styles.quantityButton,
                            isAtMin && styles.quantityButtonDisabled,
                          ]}
                          onPress={() => decreaseQuantity(index)}
                          disabled={isAtMin}
                        >
                          <Text style={styles.quantityButtonText}>-</Text>
                        </Pressable>
                        <TextInput
                          style={styles.input}
                          keyboardType="numeric"
                          value={String(item.quantidade)}
                          onChangeText={(text) => {
                            const value = Number(text.replace(',', '.'))
                            if (value > 0) updateQuantity(index, value)
                          }}
                        />

                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => increaseQuantity(index)}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </Pressable>
                        
                        <Text style={styles.unit}>
                          {item.tipoQuantidade === 'peso' ? 'kg' : 'un'}
                        </Text>

                        {/* No desktop, a remoção é feita clicando
                            neste botão — sem gesto de arrastar */}
                      </View>
                    </View>
                    {isDesktop && (
                          <Pressable
                            style={styles.removeButton}
                            onPress={() => removeItem(index)}
                            accessibilityLabel={`Remover ${item.nome}`}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={20}
                              color="#FEFEFE"
                            />
                          </Pressable>
                        )}
                  </View>
                )

                // Desktop: sem swipe, só o botão "Remover" dentro do item.
                if (isDesktop) {
                  return itemContent
                }

                // Mobile: remoção por gesto de arrastar (swipe).
                return (
                  <ReanimatedSwipeable
                    overshootRight={false}
                    rightThreshold={80}
                    renderRightActions={() => (
                      <View style={styles.deleteAction}>
                        <Ionicons name="trash-outline" size={22} color="#fff" />
                        <Text style={styles.deleteText}>Remover</Text>
                      </View>
                    )}
                    onSwipeableOpen={() => removeItem(index)}
                  >
                    {itemContent}
                  </ReanimatedSwipeable>
                )
              }}
            />
          </View>

          <View style={[styles.summary, isDesktop && styles.summaryDesktop]}>
            <Text style={styles.summaryTitle}>Resumo</Text>

            {/* No desktop, o resumo tem espaço de sobra e fica
                fixo na tela, então mostramos o cálculo de cada
                item — funciona como uma revisão do pedido antes
                de finalizar a compra. */}
            {isDesktop && (
              <>
                <View style={styles.summaryItemsList}>
                  {cart.map((item, index) => (
                    <View key={index} style={styles.summaryRow}>
                      <Text
                        style={styles.summaryLabel}
                        numberOfLines={1}
                      >
                        {item.nome} R$ {item.preco.toFixed(2)} × {item.quantidade}
                        {item.tipoQuantidade === 'peso' ? ' kg' : ''}
                      </Text>

                      <Text style={styles.summaryValue}>
                        R$ {getItemTotal(item).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.summaryDivider} />
              </>
            )}

            <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

            <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Finalizar compra</Text>
            </Pressable>
          </View>
        </View>
      )}
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Finalize seu pagamento
            </Text>

            <Pressable
              style={styles.modalButton}
              onPress={() =>
                Linking.openURL(paymentLink)
              }
            >
              <Text style={styles.modalButtonText}>
                Abrir pagamento
              </Text>
            </Pressable>

            <Pressable
              style={styles.modalButton}
              onPress={async () => {
                await Clipboard.setStringAsync(
                  paymentLink,
                )
                setMessage('Link copiado!')
                setSuccessVisible(true)
                setTimeout(() => {
                  setSuccessVisible(false)
                }, 1000)
              }}
            >
              <Text style={styles.modalButtonText}>
                Copiar link
              </Text>
            </Pressable>

            <Pressable
              style={styles.closeButton}
              onPress={() =>
                setPaymentModalVisible(false)
              }
            >
              <Text>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <LoadingModal
        visible={loading}
        message="Criando pedido..."
      />

      <SuccessModal
        visible={successVisible}
        message="Pedido criado com sucesso"
      />

      <ErrorModal
        visible={errorVisible}
        message={message}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f2',
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
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

  /*
   * BODY
   *
   * Mobile: lista em cima, resumo embaixo
   * (coluna, como já era).
   * Desktop: lista (3/4) à esquerda, resumo
   * (1/4) à direita, como na versão web.
   */
  body: {
    flex: 1,
  },

  bodyDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },

  listContainer: {
    flex: 1,
  },

  listContainerDesktop: {
    flex: 3,
  },

  list: {
    paddingBottom: 16,
  },

  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    overflow: 'hidden',
    justifyContent:'center',
    alignItems:'center'
  },

  image: {
    margin: 10,
    width: 100,
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
    flexDirection: 'column',
    marginLeft: 12,
    marginRight: 12,
  },

  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  itemName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },

  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    backgroundColor: '#dc2626'
  },

  removeText: {
    color: '#dc2626',
    fontWeight: '600',
  },

  unitPrice: {
    marginTop: 2,
    fontSize: 13,
    color: '#888',
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

  summaryDesktop: {
    flex: 1,
    // @ts-ignore -- 'sticky' funciona no react-native-web, mantém
    // o resumo visível enquanto a lista de itens rola.
    position: 'sticky',
    top: 16,
  },

  summaryItemsList: {
    maxHeight: 220,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },

  summaryLabel: {
    flex: 1,
    color: '#d1d5db',
    fontSize: 15,
  },

  summaryValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#3f3f46',
    marginVertical: 12,
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

  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},

modal: {
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: 18,
  padding: 20,
},

modalTitle: {
  fontSize: 22,
  fontWeight: '700',
  marginBottom: 20,
  textAlign: 'center',
},

modalButton: {
  backgroundColor: '#222',
  padding: 14,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 12,
},

modalButtonText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 16,
},

closeButton: {
  marginTop: 8,
  alignItems: 'center',
},

quantityButton: {
  width: 32,
  height: 32,
  borderRadius: 8,
  backgroundColor: '#222',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 5,
  marginRight: 5,
},

quantityButtonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '700',
},

quantityButtonDisabled: {
  backgroundColor: '#9ca3af',
},
deleteAction: {
  backgroundColor: '#dc2626',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 6,
  width: "60%",
  marginBottom: 14,
  borderRadius: 16,
},

deleteText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 16,
},
})