import { Home } from './pages/Home'
import { ProductDetails } from './pages/ProductDetails'
import { Cart } from './pages/Cart'
import { Profile } from './pages/Profile'
import { Products } from './pages/Products'

export default function App() {
  const path = window.location.pathname

  if (path.includes('/product')) return <ProductDetails />
  if (path.includes('/carrinho')) return <Cart />
  if (path.includes('/perfil')) return <Profile />
  if (path.includes('/produtos')) return <Products />

  return <Home />
}