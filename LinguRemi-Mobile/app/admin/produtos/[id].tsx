import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { getProductById } from '@/src/services/productService'
import { editProduct } from '@/src/services/adminService'
import type { UpdateProductRequest } from '@/src/types/UpdateProductRequest'
import type { Product } from '@/src/types/Product'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useResponsive } from '@/src/hooks/useResponsive'

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { isDesktop } = useResponsive()

  const [nomeReceitas, setNomeReceitas] = useState('')
  const [descReceitas, setDescReceitas] = useState('')
  const [valorReceitas, setValorReceitas] = useState('')
  const [avaliacaoReceitas, setAvaliacaoReceitas] = useState('')
  const [disponivelReceitas, setDisponivelReceitas] = useState('')
  const [tipoquantidadeReceitas, setTipoquantidadeReceitas] =
    useState<'unidade' | 'peso'>('unidade')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProductById(id)

        if (!product) {
          Alert.alert('Erro', 'Produto não encontrado.')
          router.back()
          return
        }

        setNomeReceitas(product.nomeReceitas)
        setDescReceitas(product.descReceitas)
        setValorReceitas(String(product.valorReceitas))
        setAvaliacaoReceitas(String(product.avaliacaoReceitas))
        setDisponivelReceitas(String(product.disponivelReceitas))
        setTipoquantidadeReceitas(product.tipoquantidadeReceitas)
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar o produto.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  async function handleSave() {
    try {
      setSaving(true)

      const data: UpdateProductRequest = {
        nomeReceitas,
        descReceitas,
        valorReceitas: Number(valorReceitas.replace(',', '.')),
        avaliacaoReceitas: Number(avaliacaoReceitas.replace(',', '.')),
        disponivelReceitas: Number(disponivelReceitas),
        tipoquantidadeReceitas,
      }

      await editProduct(Number(id), data)

    } catch {
      Alert.alert('Erro', 'Não foi possível alterar o produto.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando produto...</Text>
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isDesktop && styles.contentDesktop,
      ]}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      {!isDesktop && (
        <Pressable
          style={styles.backButton}
          onPress={() => router.push('/admin/produtos/produtos')}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      )}

      <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
        Editar produto
      </Text>

      <View style={[styles.card, isDesktop && styles.cardDesktop]}>
        <TextInput
          placeholder="Nome"
          value={nomeReceitas}
          onChangeText={setNomeReceitas}
          style={styles.input}
        />

        <TextInput
          placeholder="Descrição"
          value={descReceitas}
          onChangeText={setDescReceitas}
          multiline
          style={[styles.input, styles.textArea]}
        />

        <TextInput
          placeholder="Preço"
          value={valorReceitas}
          onChangeText={setValorReceitas}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Avaliação"
          value={avaliacaoReceitas}
          onChangeText={setAvaliacaoReceitas}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Estoque"
          value={disponivelReceitas}
          onChangeText={setDisponivelReceitas}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.typeRow}>
          <Pressable
            style={[
              styles.typeButton,
              tipoquantidadeReceitas === 'unidade' && styles.typeButtonActive,
            ]}
            onPress={() => setTipoquantidadeReceitas('unidade')}
          >
            <Text style={styles.typeText}>Unidade</Text>
          </Pressable>

          <Pressable
            style={[
              styles.typeButton,
              tipoquantidadeReceitas === 'peso' && styles.typeButtonActive,
            ]}
            onPress={() => setTipoquantidadeReceitas('peso')}
          >
            <Text style={styles.typeText}>Peso</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f2',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  /*
   * No desktop, o conteúdo fica centralizado com
   * largura contida — como não há campo de imagem
   * aqui, uma coluna só já fica confortável de ler.
   */
  contentDesktop: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 20,
  },

  titleDesktop: {
    fontSize: 34,
    marginBottom: 28,
  },

  /*
   * CARD (desktop)
   *
   * No mobile, os campos ficam soltos na tela
   * (como antes). No desktop, tudo entra dentro
   * de um card branco com sombra.
   */
  card: {},

  cardDesktop: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    elevation: 3,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 14,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#b4513b',
  },
  typeText: {
    color: '#fff',
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
})