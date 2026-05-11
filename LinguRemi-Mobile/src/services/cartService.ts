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