import { getUserData, clearAuthData } from '../services/authService'
import { useEffect, useState } from 'react'

type HeaderProps = {
  onLoginClick: () => void
}

export function Header({ onLoginClick }: HeaderProps) {
  const [user, setUser] = useState<{ nome: string | null } | null>(null)

  useEffect(() => {
    const data = getUserData()

    if (data.token) {
      setUser({ nome: data.nome })
    }
  }, [])

  function handleLogout() {
    clearAuthData()
    setUser(null)
  }

  return (
    <header className="flex items-center justify-between px-5 shadow-sm">
      {/* ESQUERDA */}
      <nav className="hidden w-1/3 md:flex">
        <ul className="flex space-x-6 text-xl cursor-pointer">
          <li><a href="/produtos">Produtos</a></li>
          <li><a href="#footer">Sobre nós</a></li>
          <li><a href="/blog">Blog</a></li>
        </ul>
      </nav>

      {/* CENTRO */}
      <div className="flex justify-center w-1/3">
        <img className="w-40" src="/assets/images/logo/LinguRemiLogo.png" />
      </div>

      {/* DIREITA */}
      <nav className="flex justify-end w-1/3">
        <ul className="flex items-center space-x-4 text-xl cursor-pointer">
          {!user ? (
            <li>
              <button className='cursor-pointer' onClick={onLoginClick}>Login</button>
            </li>
          ) : (
            <>
              <li>{user.nome}</li>
              <li>
                <button onClick={handleLogout} className="text-red-500 cursor-pointer">
                  Sair
                </button>
              </li>
            </>
          )}

          <li>
            <img src="/assets/icons/Home.png" className="h-6" />
          </li>

          <li>
            <img src="/assets/icons/carrinho.png" className="h-6" />
          </li>
        </ul>
      </nav>
    </header>
  )
}