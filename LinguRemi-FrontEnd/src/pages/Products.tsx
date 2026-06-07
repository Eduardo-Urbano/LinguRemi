import { useEffect, useState } from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { getProducts } from '../services/productService'
import type { Product } from '../types/Product'
import { clearAuthData, isAuthenticated as checkAuth } from '../services/authService'
import { useAuthModal } from '../contexts/AuthModalContext'

export function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { openLogin } = useAuthModal()

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts()
      setProducts(data)
      setIsLoading(false)
    }

    setIsAuthenticated(checkAuth())
    loadProducts()
  }, [])

  return (
    <div className="flex min-h-screen flex-col scroll-mt-4">
      <Header
        onLoginClick={openLogin}
        isAuthenticated={isAuthenticated}
        onLogout={() => {
          clearAuthData()
          setIsAuthenticated(false)
        }}
      />

      <main className="container mx-auto flex-1 px-4 pb-12">
        <section aria-labelledby="products-title">
          <div className="flex w-full text-center">
            <h1 id="products-title" className="mx-auto my-6 flex self-center text-4xl font-bold">
              Nossos Doces
            </h1>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-600">Carregando produtos...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600">Nenhum produto encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.idReceitas} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}