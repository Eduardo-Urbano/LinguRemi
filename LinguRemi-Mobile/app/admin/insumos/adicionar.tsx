import { router } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { createInsumo } from '@/src/services/adminService'
import { useResponsive } from '@/src/hooks/useResponsive'

export default function AddInsumoScreen() {
  const { isDesktop } = useResponsive()

  const [nomeInsumo, setNomeInsumo] = useState('')
  const [unidadeMedida, setUnidadeMedida] = useState('')
  const [estoqueMinimo, setEstoqueMinimo] = useState('')
  const [custoUnitario, setCustoUnitario] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!nomeInsumo || !unidadeMedida || !estoqueMinimo) {
      Alert.alert('Erro', 'Preencha nome, unidade e estoque mínimo.')
      return
    }

    try {
      setSaving(true)

      await createInsumo({
        nomeInsumo,
        unidadeMedida,
        estoqueMinimo: Number(estoqueMinimo.replace(',', '.')),
        custoUnitario: custoUnitario
          ? Number(custoUnitario.replace(',', '.'))
          : null,
      })

      Alert.alert('Sucesso', 'Insumo cadastrado com sucesso.')
      router.replace('../')
    } catch {
      Alert.alert('Erro', 'Não foi possível cadastrar o insumo.')
    } finally {
      setSaving(false)
    }
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
          onPress={() => router.push('../insumos')}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      )}

      <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
        Cadastrar insumo
      </Text>

      <View style={[styles.card, isDesktop && styles.cardDesktop]}>
        <TextInput
          placeholder="Nome (ex: Farinha de trigo)"
          value={nomeInsumo}
          onChangeText={setNomeInsumo}
          style={styles.input}
        />

        <TextInput
          placeholder="Unidade de medida (ex: kg, g, ml, un)"
          value={unidadeMedida}
          onChangeText={setUnidadeMedida}
          style={styles.input}
        />

        <TextInput
          placeholder="Estoque mínimo"
          value={estoqueMinimo}
          onChangeText={setEstoqueMinimo}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Custo unitário (opcional)"
          value={custoUnitario}
          onChangeText={setCustoUnitario}
          keyboardType="numeric"
          style={styles.input}
        />

        <Pressable
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Salvando...' : 'Cadastrar insumo'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf7f2' },
  content: { flexGrow: 1, padding: 20, paddingBottom: 40 },

  contentDesktop: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
  },

  title: { fontSize: 26, fontWeight: '800', marginBottom: 20 },
  titleDesktop: { fontSize: 34, marginBottom: 28 },

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

  saveButton: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  backButtonText: { color: '#fff', fontWeight: '700' },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
})