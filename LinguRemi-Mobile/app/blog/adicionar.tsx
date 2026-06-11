import { router } from 'expo-router'
import { addReceitaBlog } from '@/src/services/authService'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function NewBlogRecipeScreen() {
  const [nomeReceita, setNomeReceita] = useState('')
  const [ingReceita, setIngReceita] = useState('')
  const [preparoReceita, setPreparoReceita] = useState('')
  const [descReceita, setDescReceita] = useState('')
  const [tempoReceita, setTempoReceita] = useState('')
  const [imgReceita, setImgReceita] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })

    if (!result.canceled) {
      setImgReceita(result.assets[0])
    }
  }

  async function cadastrarReceita() {
    if (
      !nomeReceita ||
      !ingReceita ||
      !preparoReceita ||
      !descReceita ||
      !tempoReceita ||
      !imgReceita
    ) {
      Alert.alert('Erro', 'Preencha todos os campos.')
      return
    }

    try {
      setLoading(true)

      await addReceitaBlog({nomeReceita,
        ingReceita,
        preparoReceita,
        descReceita,
        tempoReceita,
        imgReceita: {
          uri: imgReceita.uri,
          name: imgReceita.fileName ?? 'receita.jpg',
          type: imgReceita.mimeType ?? 'image/jpeg',
        },
      })

      setNomeReceita('')
      setIngReceita('')
      setPreparoReceita('')
      setDescReceita('')
      setTempoReceita('')
      setImgReceita(null)
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a receita.')
    } finally {
      setLoading(false)
    }
  }

  return (
    
    <KeyboardAwareScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content} 
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={30}
      >
      <Pressable style={styles.backButton} onPress={() => router.push('/blog')}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>
      <Text style={styles.title}>Cadastrar receita do blog</Text>

      <Text style={styles.textCategoria}>Nome da receita</Text>
      <TextInput
        placeholder="Bolo de ..."
        placeholderTextColor={'#A9A9AC'}
        value={nomeReceita}
        onChangeText={setNomeReceita}
        style={styles.input}
      />

      <Text style={styles.textCategoria}>Ingredientes</Text>
      <TextInput
        placeholder="1/2 xicara de leite, 2 xicaras de ..."
        placeholderTextColor={'#A9A9AC'}
        value={ingReceita}
        onChangeText={setIngReceita}
        style={[styles.input, styles.textArea]}
        multiline
      />
      
      <Text style={styles.textCategoria}>Modo de preparo</Text>
      <TextInput
        placeholder="Bata tudo no liquidificador ..."
        placeholderTextColor={'#A9A9AC'}
        value={preparoReceita}
        onChangeText={setPreparoReceita}
        style={[styles.input, styles.textArea]}
        multiline
      />

      <Text style={styles.textCategoria}>Descrição</Text>
      <TextInput
        placeholder="Bolo fofinho e ..."
        placeholderTextColor={'#A9A9AC'}
        value={descReceita}
        onChangeText={setDescReceita}
        style={[styles.input, styles.textArea]}
        multiline
      />

      <Text style={styles.textCategoria}>Tempo de preparo</Text>
      <TextInput
        placeholder="45 minutos"
        placeholderTextColor={'#A9A9AC'}
        value={tempoReceita}
        onChangeText={setTempoReceita}
        style={styles.input}
      />

      <Pressable style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {imgReceita ? 'Trocar imagem' : 'Selecionar imagem'}
        </Text>
      </Pressable>

      {imgReceita && (
        <Image
          source={{ uri: imgReceita.uri }}
          style={styles.preview}
          resizeMode="cover"
        />
      )}

      <Pressable
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={cadastrarReceita}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Cadastrando...' : 'Cadastrar receita'}
        </Text>
      </Pressable>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f2',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 24,
    color: '#3b2417',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },

  imageButton: {
    backgroundColor: '#f5d7b5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },

  imageButtonText: {
    color: '#3b2417',
    fontWeight: '700',
    fontSize: 16,
  },

  preview: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },

  submitButton: {
    backgroundColor: '#3b2417',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 16,
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

  backButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  textCategoria: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
})