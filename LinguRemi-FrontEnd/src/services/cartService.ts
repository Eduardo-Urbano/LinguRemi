import type { CartItem } from '../types/CartItem'

export function getCart(): CartItem[] {
  try {
    const data = localStorage.getItem('cart')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function clearCart() {
  localStorage.removeItem('cart')
}

export function calculateTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => {
    return sum + (
      item.tipoQuantidade === 'peso'
        ? item.preco * item.quantidade * 10
        : item.preco * item.quantidade
    )
  }, 0)
}

export function validateCart(cart: CartItem[]): boolean {
  return cart.every(item => {
    return (
      typeof item.id === 'number' &&
      item.id > 0 &&
      typeof item.nome === 'string' &&
      item.nome.trim().length > 0 &&
      typeof item.preco === 'number' &&
      item.preco > 0 &&
      typeof item.quantidade === 'number' &&
      item.quantidade > 0 &&
      (item.tipoQuantidade === 'peso' || item.tipoQuantidade === 'unidade')
    )
  })
}