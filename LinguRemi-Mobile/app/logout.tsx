import { useEffect } from 'react'

import { router } from 'expo-router'

import { logoutUser } from '../src/services/authService'

import { useAuth } from '../src/context/AuthContext'

export default function LogoutPage() {
  const {
    setAuthenticated,
    setAdmin,
  } = useAuth()

  useEffect(() => {
    async function logout() {
      await logoutUser()

      setAuthenticated(false)
      setAdmin(false)

      router.replace('/')
    }

    logout()
  }, [])

  return null
}