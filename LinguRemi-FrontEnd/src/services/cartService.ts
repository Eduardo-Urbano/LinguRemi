import type { CartItem } from '../types/CartItem'

export function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem('cart') || '[]')
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
      item.id &&
      item.nome &&
      item.preco > 0 &&
      item.quantidade > 0 &&
      (item.tipoQuantidade === 'peso' || item.tipoQuantidade === 'unidade')
    )
  })
}