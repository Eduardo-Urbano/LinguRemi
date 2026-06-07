import { useEffect, useState } from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { getProductById, getProductImage } from '../services/productService'
import { getCart, saveCart } from '../services/cartService'
import { clearAuthData, isAuthenticated as checkAuth } from '../services/authService'
import type { Product } from '../types/Product'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthModal } from '../contexts/AuthModalContext'

export function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [notFound, setNotFound] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const { id } = useParams()
  const navigate = useNavigate()
  const { openLogin } = useAuthModal()

  useEffect(() => {
    if (!id) {
      setNotFound(true)
      return
    }

    async function loadProduct(productId: string) {
      const data = await getProductById(productId)

      if (!data) {
        setNotFound(true)
        return
      }

      setProduct(data)
    }

    loadProduct(id)
  }, [id])

  if (notFound) {
    return <p className="mt-10 text-center">Produto não encontrado.</p>
  }

  if (!product) {
    return <p className="mt-10 text-center">Carregando produto...</p>
  }

  function handleAddToCart(redirect = false) {
    if (!product) return

    const minQuantity = product.tipoquantidadeReceitas === 'peso' ? 0.3 : 5

    if (quantity < minQuantity) {
      setMessageType('error')
      setMessage(`Quantidade mínima: ${minQuantity}${product.tipoquantidadeReceitas === 'peso' ? 'kg' : ' unidades'}`)
      return
    }

    const cart = getCart()

    cart.push({
      id: product.idReceitas,
      nome: product.nomeReceitas,
      preco: product.valorReceitas,
      imagem: getProductImage(product.imgReceitas),
      quantidade: quantity,
      tipoQuantidade: product.tipoquantidadeReceitas,
    })

    saveCart(cart)

    if (redirect) {
      navigate('/carrinho')
    } else {
      setMessageType('success')
      setMessage(`${product.nomeReceitas} adicionado ao carrinho!`)
    }
  }

  return (
    <>
      <Header
        onLoginClick={openLogin}
        isAuthenticated={checkAuth()}
        onLogout={() => {
          clearAuthData()
          navigate(0)
        }}
      />

      <main className="container mx-auto p-4">
        {message && (
          <p
            className={`mb-4 rounded-lg p-3 text-center ${
              messageType === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </p>
        )}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 cursor-pointer rounded-xl text-white bg-gray-800 px-4 py-2 shadow transition hover:bg-gray-300 hover:text-black"
        >
          Voltar
        </button>
        <div className="mx-auto flex flex-col gap-6 rounded-xl bg-gray-100 p-5 shadow-lg lg:flex-row">
          <img
            src={getProductImage(product.imgReceitas)}
            alt={`Imagem do produto ${product.nomeReceitas}`}
            className="w-full rounded-xl object-cover lg:w-[600px]"
          />

          <section className="w-full rounded-xl bg-white p-5 shadow-lg lg:w-[400px]">
            <h1 className="text-2xl font-semibold">{product.nomeReceitas}</h1>

            <p className="text-sm">★ {product.avaliacaoReceitas} avaliações</p>

            <h2 className="mb-5 mt-5 text-xl">
              R$ {product.valorReceitas.toFixed(2)}
            </h2>

            <div className="mb-5">
              <label className="mb-1 block font-medium">
                {product.tipoquantidadeReceitas === 'peso' ? 'Peso:' : 'Quantidade:'}
              </label>

              <input
                type="number"
                value={quantity}
                min={product.tipoquantidadeReceitas === 'peso' ? 0.3 : 5}
                step={product.tipoquantidadeReceitas === 'peso' ? 0.1 : 1}
                onChange={(event) => {
                  const value = Number(event.target.value)
                  if (value > 0) setQuantity(value)
                }}
                className="w-20 rounded border p-2 text-center"
              />

              <span className="ml-2 text-sm text-gray-600">
                {product.tipoquantidadeReceitas === 'peso' ? 'kg' : 'un'}
              </span>
            </div>

            <p
              className={`mb-5 ${
                product.disponivelReceitas > 0 ? 'text-gray-800' : 'text-red-600'
              }`}
            >
              {product.disponivelReceitas > 0
                ? `Em estoque (${product.disponivelReceitas} disponíveis)`
                : 'Produto indisponível'}
            </p>

            <button
              type="button"
              onClick={() => handleAddToCart(false)}
              disabled={product.disponivelReceitas <= 0}
              className="mb-3 w-full rounded-xl bg-gray-200 p-2 shadow-lg transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Adicionar ao carrinho
            </button>

            <button
              type="button"
              onClick={() => handleAddToCart(true)}
              disabled={product.disponivelReceitas <= 0}
              className="w-full rounded-xl bg-gray-200 p-2 shadow-lg transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Comprar agora
            </button>
          </section>
        </div>

        <section className="mt-6 rounded-xl bg-white p-5">
          <h2 className="mb-2 text-xl font-semibold">Descrição</h2>
          <p className="text-lg leading-relaxed">
            {product.descReceitas || 'Sem descrição disponível.'}
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}