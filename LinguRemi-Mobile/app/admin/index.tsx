import { useEffect, useState } from 'react'

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native'

import { router } from 'expo-router'

import {
  isAuthenticated,
  isAdmin,
} from '../../src/services/authService'

import {
  getAdminProducts,
} from '../../src/services/adminService'

import type { Product } from '../../src/types/Product'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPage() {
            try {
                const authenticated = await isAuthenticated()
                const admin = await isAdmin()

                if (!authenticated || !admin) {
                    router.replace('/')
                    return
                }

                const data = await getAdminProducts()

                setProducts(data)
            } catch (error) {
                console.log(error)
                router.replace('/')
            } finally {
                setLoading(false)
            }
        }

        loadPage()
    }, [])

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Painel Admin
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) =>
          item.idReceitas.toString()
        }
        renderItem={({ item }) => (
          <View
            style={{
              padding: 16,
              borderWidth: 1,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
              }}
            >
              {item.nomeReceitas}
            </Text>

            <Text>
              R$ {item.valorReceitas.toFixed(2)}
            </Text>

            <TouchableOpacity
              style={{
                marginTop: 12,
              }}
            >
              <Text>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}