import { Home } from './pages/Home'
import { ProductDetails } from './pages/ProductDetails'
import { Cart } from './pages/Cart'
import { Profile } from './pages/Profile'
import { Products } from './pages/Products'
import { Blog } from './pages/Blog'
import { RecipeBlogDetails } from './pages/RecipeBlogDetails'

export default function App() {
  const path = window.location.pathname

  if (path.includes('/product')) return <ProductDetails />
  if (path.includes('/carrinho')) return <Cart />
  if (path.includes('/perfil')) return <Profile />
  if (path.includes('/produtos')) return <Products />
  if (path.includes('/blog')) return <Blog />
  if (path.includes('/receita')) return <RecipeBlogDetails />

  return <Home />
}