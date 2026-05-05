import { getUserData, clearAuthData } from '../services/authService'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type HeaderProps = {
  onLoginClick: () => void
  isAuthenticated: boolean
  onLogout: () => void
}

export function Header({ onLoginClick, isAuthenticated, onLogout }: HeaderProps) {
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      const user = getUserData()
      setUserName(user.nome || 'Meu Perfil')
    } else {
      setUserName(null)
    }
  }, [isAuthenticated])

  function handleLogout() {
    clearAuthData()
    onLogout()
  }

  return (
      <header className="flex items-center justify-between px-5 py-2 shadow-sm">
        <nav className="hidden w-1/3 flex-row gap-x-6 text-xl md:flex">
          <ul className="flex flex-row space-x-6">
            <li><Link to="/produtos">Produtos</Link></li>
            <li><a href="#footer">Sobre nós</a></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </nav>

        <div className="flex flex-1 justify-start md:w-1/3 md:justify-center">
          <Link to="/">
            <img
              className="w-40 md:w-62"
              src="/assets/images/logo/LinguRemiLogo.png"
              alt="LinguRemi"
            />
          </Link>
        </div>

        <nav className="flex w-auto flex-row justify-end gap-x-6 text-base md:w-1/3 md:text-xl">
          <ul className="flex flex-row items-center space-x-4 md:space-x-6">
            {!userName ? (
              <li>
                <button type="button" onClick={onLoginClick}>
                  Login
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/perfil">{userName}</Link>
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>
                    Sair
                  </button>
                </li>
              </>
            )}

            <li>
              <Link to="/" aria-label="Página inicial">
                <img src="/assets/icons/Home.png" alt="" className="h-6 w-6" />
              </Link>
            </li>

            <li>
              <Link to="/carrinho" aria-label="Meu carrinho">
                <img src="/assets/icons/carrinho.png" alt="" className="h-6 w-6" />
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    )
}