import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'

import {
  isAuthenticated,
  isAdmin,
  isAppLocked,
} from '../services/authService'

type AuthContextType = {
  authenticated: boolean
  admin: boolean
  setAuthenticated: (value: boolean) => void
  setAdmin: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [authenticated, setAuthenticated] =
    useState(false)

  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    async function loadAuth() {
      const auth = await isAuthenticated()
      const adminUser = await isAdmin()
      const locked = await isAppLocked()      
      setAuthenticated(auth && !locked)
      setAdmin(adminUser && !locked ? adminUser: false)
    }

    loadAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        admin,
        setAuthenticated,
        setAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}