import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { ProductCard } from '../../src/components/ProductCard'
import { getProducts } from '../../src/services/productService'
import type { Product } from '../../src/types/Product'

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts()
      setProducts(data)
      setIsLoading(false)
    }

    loadProducts()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nossos Doces</Text>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.message}>Carregando produtos...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.message}>Nenhum produto encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.idReceitas)}
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          columnWrapperStyle={styles.recipeRow}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f2',
    paddingHorizontal: 16,
    
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 24,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom:24,
    gap: 16,
  },
  recipeRow: {
    justifyContent:'space-between',
    marginBottom: 16,
  },
})