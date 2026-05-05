import { Routes, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { ProductDetails } from './pages/ProductDetails'
import { Cart } from './pages/Cart'
import { Profile } from './pages/Profile'
import { Products } from './pages/Products'
import { Blog } from './pages/Blog'
import { RecipeBlogDetails } from './pages/RecipeBlogDetails'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/carrinho" element={<Cart />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/receita/:id" element={<RecipeBlogDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
    </Routes>
  )
}