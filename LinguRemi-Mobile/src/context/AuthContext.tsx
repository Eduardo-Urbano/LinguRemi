import {
  createContext,
  useContext,
  useState,
} from 'react'

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