import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { getUserHistory } from '../services/profileService'
import { clearAuthData, isAuthenticated } from '../services/authService'
import type { HistoryItem } from '../types/History'
import { useNavigate } from 'react-router-dom'
import { useAuthModal } from '../contexts/AuthModalContext'

export function Profile() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const { openLogin } = useAuthModal()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/')
      return
    }

    const nomeUser = localStorage.getItem('nomeUser') || ''
    const emailUser = localStorage.getItem('emailUser') || ''

    setNome(nomeUser)
    setEmail(emailUser)

    async function loadHistory() {
      const data = await getUserHistory()
      setHistory(data)
    }

    loadHistory()
  }, [])

  function handleLogout() {
    clearAuthData()
    navigate('/')
  }

  return (
    <>
      <Header
        onLoginClick={openLogin}
        isAuthenticated={isAuthenticated()}
        onLogout={handleLogout}
      />

      <main className="flex flex-col lg:flex-row gap-4 p-4">

        {/* Perfil */}
        <section className="flex flex-col items-center bg-gray-800 text-white p-6 rounded-xl shadow w-full lg:w-1/3">
          <div className="w-40 h-40 bg-gray-600 rounded-full mb-4 flex items-center justify-center">
            <span>Foto</span>
          </div>

          <h2 className="text-xl font-bold">{nome}</h2>
          <p>{email}</p>

          <button
            onClick={handleLogout}
            className="mt-6 text-red-400"
          >
            Sair
          </button>
        </section>

        {/* Histórico */}
        <section className="flex flex-col bg-gray-700 text-white p-6 rounded-xl shadow w-full lg:w-2/3">
          <h2 className="text-2xl mb-4">Histórico</h2>

          {history.length === 0 ? (
            <p>Nenhuma compra encontrada.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="border-b py-3">
                <p>{item.descTransferencia}</p>
                <p>R$ {item.valorTransferencia.toFixed(2)}</p>
              </div>
            ))
          )}
        </section>

      </main>

      <Footer />
    </>
  )
}