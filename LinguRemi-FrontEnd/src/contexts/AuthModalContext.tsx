import { createContext, useContext, useState } from 'react'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'

type AuthModalContextType = {
  openLogin: () => void
  openRegister: () => void
  closeModal: () => void
}

const AuthModalContext = createContext<AuthModalContextType | null>(null)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<'login' | 'register' | null>(null)

  function openLogin() {
    setModal('login')
  }

  function openRegister() {
    setModal('register')
  }

  function closeModal() {
    setModal(null)
  }

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, closeModal }}>
      {children}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <div className="relative z-10 w-11/12 max-w-sm rounded-lg bg-white p-8">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-1.5 top-1 cursor-pointer rounded-full bg-red-400 px-2 py-0.5 text-white hover:bg-red-600"
            >
              X
            </button>

            {modal === 'login' && (
              <Login
                onSuccess={closeModal}
                onOpenRegister={openRegister}
              />
            )}

            {modal === 'register' && (
              <Register
                onSuccess={openLogin}
                onBackToLogin={openLogin}
              />
            )}
          </div>
        </div>
      )}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)

  if (!context) {
    throw new Error('useAuthModal deve ser usado dentro de AuthModalProvider')
  }

  return context
}