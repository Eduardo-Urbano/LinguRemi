import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { getCart, saveCart, clearCart, calculateTotal } from '../services/cartService'
import type { CartItem } from '../types/CartItem'

export function Cart() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    setCart(getCart())
  }, [])

  function updateQuantity(index: number, value: number) {
    const newCart = [...cart]
    newCart[index].quantidade = value
    setCart(newCart)
    saveCart(newCart)
  }

  function removeItem(index: number) {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    saveCart(newCart)
  }

  function handleCheckout() {
    if (cart.length === 0) {
      alert('Carrinho vazio!')
      return
    }

    alert('Compra finalizada (simulação)')
    clearCart()
    setCart([])
  }

  const total = calculateTotal(cart)

  return (
    <>
      <Header onLoginClick={() => {}} isAuthenticated={false} onLogout={() => {}} />

      <main className="flex flex-col lg:flex-row gap-6 p-5">
        
        {/* Lista */}
        <section className="w-full lg:w-3/4 bg-white rounded-xl shadow p-4">
          {cart.length === 0 ? (
            <p className="text-center text-xl">Seu carrinho está vazio.</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b py-4">
                
                <div className="flex items-center gap-4">
                  <img src={item.imagem} className="w-32 h-24 object-cover rounded" />
                  <div>
                    <h2 className="font-bold">{item.nome}</h2>

                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 mt-2"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    type="number"
                    value={item.quantidade}
                    onChange={(e) => updateQuantity(index, Number(e.target.value))}
                    className="w-20 border p-1 text-center"
                  />
                </div>

                <p>
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </section>

        {/* Resumo */}
        <aside className="w-full lg:w-1/4 bg-gray-800 text-white p-4 rounded-xl">
          <h2 className="text-xl mb-4">Resumo</h2>

          <p className="text-2xl mb-4">
            Total: R$ {total.toFixed(2)}
          </p>

          <button
            onClick={handleCheckout}
            className="w-full border p-3 text-lg rounded"
          >
            Finalizar compra
          </button>
        </aside>

      </main>

      <Footer />
    </>
  )
}