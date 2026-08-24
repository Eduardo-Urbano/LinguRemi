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
import { useResponsive } from '@/src/hooks/useResponsive'

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isDesktop } = useResponsive()

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts()
      setProducts(data)
      setIsLoading(false)
    }

    loadProducts()
  }, [])

  const numColumns = isDesktop ? 3 : 2

  return (
    <SafeAreaView style={styles.container}>
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
          // O key precisa mudar junto com numColumns: o FlatList não
          // permite trocar a quantidade de colunas sem remontar a lista.
          key={numColumns}
          keyExtractor={(item) => String(item.idReceitas)}
          numColumns={numColumns}
          showsHorizontalScrollIndicator={false}
          columnWrapperStyle={styles.recipeRow}
          contentContainerStyle={[
            styles.list,
            isDesktop && styles.listDesktop,
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={isDesktop ? styles.cardWrapperDesktop : styles.cardWrapper}>
              <ProductCard product={item} isDesktop={isDesktop} />
            </View>
          )}
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

  titleDesktop: {
    fontSize: 36,
    marginVertical: 32,
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
    paddingBottom: 24,
    gap: 16,
  },

  /*
   * No desktop, o grid fica centralizado com
   * largura máxima, igual ao "container mx-auto"
   * da versão web.
   */
  listDesktop: {
    width: '80%',
    alignSelf: 'center',
    paddingHorizontal: 0,
    paddingTop: 30
  },

  recipeRow: {
    justifyContent: 'space-between',
  },

  /*
   * Largura da coluna no mobile (2 colunas).
   * O ProductCard não define mais width fixo,
   * então quem controla o tamanho é este wrapper.
   */
  cardWrapper: {
    width: '48%',
  },

  /*
   * Cada card ocupa uma fração da linha (3 colunas),
   * evitando que eles se esticem demais quando a
   * última linha não está completa.
   */
  cardWrapperDesktop: {
    width: '32%',
  },
})