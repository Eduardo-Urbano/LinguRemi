import { Link } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LinguRémi Mobile</Text>

      <Link href="/products" style={styles.link}>
        Ver produtos
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
  },

  link: {
    marginTop: 20,
    fontSize: 18,
    color: '#8b4513',
    fontWeight: '700',
  },
})