import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import type { CartItem } from '../types/CartItem'
import { clearAuthData, isAuthenticated } from '../services/authService'
import {getCart, saveCart, clearCart, calculateTotal, validateCart, checkout} from '../services/cartService'
import { useNavigate } from 'react-router-dom'
import { useAuthModal } from '../contexts/AuthModalContext'

export function Cart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const navigate = useNavigate()
  const { openLogin } = useAuthModal()

  useEffect(() => {
    setCart(getCart())
  }, [])

  function updateQuantity(index: number, value: number) {
    if (value < 1) return

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

  async function handleCheckout() {
    try {

      if (!isAuthenticated()) {
        setMessageType('error')
        setMessage('Você precisa estar logado para finalizar a compra.')
        openLogin()
        return
      }

      if (cart.length === 0) {
        setMessageType('error')
        setMessage('Carrinho vazio!')
        return
      }

      if (!validateCart(cart)) {
        setMessageType('error')
        setMessage('Carrinho inválido. Atualize a página e tente novamente.')
        return
      }

      await checkout(cart)

      setMessageType('success')
      setMessage('Compra finalizada com sucesso!')

      clearCart()
      setCart([])

    } catch (error) {

      console.error(error)

      setMessageType('error')
      setMessage('Erro ao finalizar compra.')
    }
  }

  const total = calculateTotal(cart)

  return (
    <>
      <Header
        onLoginClick={openLogin}
        isAuthenticated={isAuthenticated()}
        onLogout={() => {
          clearAuthData()
          navigate('/')
        }}
      />

      <main className="p-5">
        {message && (
          <p
            className={`rounded-lg p-3 text-center ${
              messageType === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </p>
        )}
        <div className="flex flex-col lg:flex-row gap-6">          
          <section className="w-full lg:w-3/4 bg-white rounded-xl shadow p-4">
            {cart.length === 0 ? (
              <p className="text-center text-xl">Seu carrinho está vazio.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b py-4">
          
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imagem}
                      alt={`Imagem de ${item.nome}`}
                      className="w-32 h-24 object-cover rounded"
                    />
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
                    R$ {(item.tipoQuantidade === 'peso'
                        ? item.preco * item.quantidade * 10
                        : item.preco * item.quantidade
                    ).toFixed(2)}
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
        </div>

      </main>

      <Footer />
    </>
  )
}