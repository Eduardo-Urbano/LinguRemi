import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default function indexAdmin(){
  
  return(
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => router.push('/admin/blog/blog')}
      >
        <Text style={styles.buttonText}>Gerenciar blog</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push('/admin/produtos/produtos')}
      >
        <Text style={styles.buttonText}>Gerenciar Produtos</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push('/admin/usuarios/usuarios')}
      >
        <Text style={styles.buttonText}>Gerenciar usuarios</Text>
      </Pressable>

    </View>
  )

}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 20,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    marginBottom:10,
    borderRadius: 14,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#faf7f2',
    justifyContent: 'center',
    padding: 20,
  },
})