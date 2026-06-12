import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { addProduct } from '@/src/services/authService'

export default function AddProductScreen() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [disponivel, setDisponivel] = useState('')
  const [tipoQuantidade, setTipoQuantidade] = useState<'unidade' | 'peso'>('unidade')
  const [imagem, setImagem] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })

    if (!result.canceled) {
      setImagem(result.assets[0])
    }
  }

  async function handleSave() {
    if (!nome || !descricao || !valor || !disponivel || !imagem) {
      Alert.alert('Erro', 'Preencha todos os campos.')
      return
    }

    try {
      setSaving(true)

      await addProduct({
        nome,
        descricao,
        valor: Number(valor.replace(',', '.')),
        disponivel: Number(disponivel),
        tipoQuantidade,
        imagem: {
          uri: imagem.uri,
          name: imagem.fileName ?? 'produto.jpg',
          type: imagem.mimeType ?? 'image/jpeg',
        },
      })

      Alert.alert('Sucesso', 'Produto cadastrado com sucesso.')

    setNome('')
    setDescricao('')
    setValor('')
    setDisponivel('')
    setTipoQuantidade('unidade')
    setImagem(null)
      router.replace(`/admin/produtos/produtos`)
    } catch {
      Alert.alert('Erro', 'Não foi possível cadastrar o produto.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
        <Pressable style={styles.backButton} onPress={() => router.push('/admin/produtos/produtos')}>
            <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>

      <Text style={styles.title}>Adicionar produto</Text>

      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        style={[styles.input, styles.textArea]}
      />

      <TextInput
        placeholder="Preço"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Estoque"
        value={disponivel}
        onChangeText={setDisponivel}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.typeRow}>
        <Pressable
          style={[styles.typeButton, tipoQuantidade === 'unidade' && styles.typeButtonActive]}
          onPress={() => setTipoQuantidade('unidade')}
        >
          <Text style={styles.typeText}>Unidade</Text>
        </Pressable>

        <Pressable
          style={[styles.typeButton, tipoQuantidade === 'peso' && styles.typeButtonActive]}
          onPress={() => setTipoQuantidade('peso')}
        >
          <Text style={styles.typeText}>Peso</Text>
        </Pressable>
      </View>

      <Pressable style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {imagem ? 'Trocar imagem' : 'Selecionar imagem'}
        </Text>
      </Pressable>

      {imagem && (
        <Image source={{ uri: imagem.uri }} style={styles.preview} resizeMode="cover" />
      )}

      <Pressable
        style={[styles.saveButton, saving && styles.disabledButton]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? 'Salvando...' : 'Cadastrar produto'}
        </Text>
      </Pressable>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf7f2' },
  content: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 14,
  },
  textArea: { minHeight: 110, textAlignVertical: 'top' },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeButton: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeButtonActive: { backgroundColor: '#b4513b' },
  typeText: { color: '#fff', fontWeight: '700' },
  imageButton: {
    backgroundColor: '#f5d7b5',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonText: { color: '#3b2417', fontWeight: '700' },
  preview: { width: '100%', height: 220, borderRadius: 16, marginBottom: 20 },
  saveButton: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
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