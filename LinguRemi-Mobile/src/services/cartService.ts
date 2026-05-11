import AsyncStorage from '@react-native-async-storage/async-storage'

export type CartItem = {
  id: number
  nome: string
  preco: number
  imagem?: string
  quantidade: number
  tipoQuantidade: 'unidade' | 'peso'
}

const CART_KEY = '@linguremi:cart'

export async function getCart(): Promise<CartItem[]> {
  const data = await AsyncStorage.getItem(CART_KEY)

  if (!data) return []

  return JSON.parse(data)
}

export async function saveCart(cart: CartItem[]) {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export async function clearCart() {
  await AsyncStorage.removeItem(CART_KEY)
}

export function calculateTotal(cart: CartItem[]) {
  return cart.reduce((total, item) => {
    const itemTotal =
      item.tipoQuantidade === 'peso'
        ? item.preco * item.quantidade * 10
        : item.preco * item.quantidade

    return total + itemTotal
  }, 0)
}

export function validateCart(cart: CartItem[]) {
  return cart.every((item) => {
    return (
      item.id > 0 &&
      item.nome.trim().length > 0 &&
      item.preco > 0 &&
      item.quantidade > 0
    )
  })
}