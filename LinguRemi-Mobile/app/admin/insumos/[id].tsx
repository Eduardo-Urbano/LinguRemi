import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import {
  getAdminInsumos,
  getLotesDoInsumo,
  createLote,
  registrarPerda,
} from '@/src/services/adminService'
import type { Insumo, LoteInsumo } from '@/src/types/Insumo'
import { useResponsive } from '@/src/hooks/useResponsive'

const COLORS = {
  bg: '#faf7f2',
  surface: '#ffffff',
  text: '#1a1a1a',
  textMuted: '#6b6b6b',
  border: '#ece6dc',
  accent: '#b4513b',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
  warning: '#d97706',
  warningSoft: '#fef3c7',
}

// Lotes vencendo em até N dias entram no destaque visual amarelo
const DIAS_ALERTA_VENCIMENTO = 7

function diasAteVencimento(dataValidade: string) {
  const hoje = new Date()
  const validade = new Date(dataValidade)
  const diffMs = validade.getTime() - hoje.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export default function InsumoLotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { isDesktop } = useResponsive()

  const [insumo, setInsumo] = useState<Insumo | null>(null)
  const [lotes, setLotes] = useState<LoteInsumo[]>([])
  const [loading, setLoading] = useState(true)

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [novaQuantidade, setNovaQuantidade] = useState('')
  const [novaValidade, setNovaValidade] = useState('') // 'YYYY-MM-DD'
  const [novoFornecedor, setNovoFornecedor] = useState('')
  const [savingLote, setSavingLote] = useState(false)

  const [perdaModalVisible, setPerdaModalVisible] = useState(false)
  const [selectedLote, setSelectedLote] = useState<LoteInsumo | null>(null)
  const [perdaMotivo, setPerdaMotivo] = useState('')
  const [savingPerda, setSavingPerda] = useState(false)

  const load = useCallback(async () => {
    if (!id) return

    try {
      const [todosInsumos, dataLotes] = await Promise.all([
        getAdminInsumos(),
        getLotesDoInsumo(Number(id)),
      ])

      const encontrado = todosInsumos.find((i) => i.idInsumo === Number(id))
      setInsumo(encontrado ?? null)
      // O backend já retorna ordenado por dataValidade ASC (FEFO):
      // o primeiro item da lista é sempre o próximo a vencer.
      setLotes(Array.isArray(dataLotes) ? dataLotes : [])
    } catch (error) {
      console.log('Erro ao carregar lotes do insumo:', error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  async function handleAddLote() {
    if (!novaQuantidade || !novaValidade) {
      Alert.alert('Erro', 'Preencha quantidade e data de validade.')
      return
    }

    try {
      setSavingLote(true)

      await createLote(Number(id), {
        quantidade: Number(novaQuantidade.replace(',', '.')),
        dataValidade: novaValidade,
        fornecedor: novoFornecedor || null,
      })

      setAddModalVisible(false)
      setNovaQuantidade('')
      setNovaValidade('')
      setNovoFornecedor('')

      await load()
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar o lote.')
    } finally {
      setSavingLote(false)
    }
  }

  async function handleRegistrarPerda(tipo: 'PERDA_VALIDADE' | 'PERDA_OUTRO') {
    if (!selectedLote) return

    try {
      setSavingPerda(true)

      await registrarPerda(selectedLote.idLote, {
        tipoMovimentacao: tipo,
        motivo: perdaMotivo || null,
        // quantidade omitida: backend descarta o restante do lote inteiro
      })

      setPerdaModalVisible(false)
      setSelectedLote(null)
      setPerdaMotivo('')

      await load()
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar a perda.')
    } finally {
      setSavingPerda(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando insumo...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      {!isDesktop && (
        <Pressable
          style={styles.backButton}
          onPress={() => router.push('/admin/insumos/insumos')}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      )}

      <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
        {insumo?.nomeInsumo ?? 'Insumo'}
      </Text>

      <Text style={styles.subtitle}>
        {insumo?.estoqueAtual} {insumo?.unidadeMedida} em estoque · mínimo{' '}
        {insumo?.estoqueMinimo} {insumo?.unidadeMedida}
      </Text>

      <Pressable
        style={styles.addLoteButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Ionicons name="add" size={18} color="#fff" />
        <Text style={styles.addLoteButtonText}>Registrar entrada de lote</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>
        Lotes (ordenados por validade — FEFO)
      </Text>

      <FlatList
        data={lotes}
        keyExtractor={(l) => String(l.idLote)}
        contentContainerStyle={{ paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Nenhum lote ativo. Registre uma entrada acima.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const dias = diasAteVencimento(item.dataValidade)
          const vencendo = dias <= DIAS_ALERTA_VENCIMENTO

          return (
            <View
              style={[
                styles.loteCard,
                vencendo && styles.loteCardVencendo,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.loteQuantidade}>
                  {item.quantidadeAtual} {insumo?.unidadeMedida}
                </Text>

                <Text style={styles.loteValidade}>
                  Validade:{' '}
                  {new Date(item.dataValidade).toLocaleDateString('pt-BR')}
                  {vencendo && (
                    <Text style={styles.loteValidadeAlerta}>
                      {'  '}
                      {dias <= 0 ? '· vencido' : `· vence em ${dias}d`}
                    </Text>
                  )}
                </Text>

                {item.fornecedor && (
                  <Text style={styles.loteFornecedor}>
                    Fornecedor: {item.fornecedor}
                  </Text>
                )}
              </View>

              <Pressable
                style={styles.perdaButton}
                onPress={() => {
                  setSelectedLote(item)
                  setPerdaModalVisible(true)
                }}
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                <Text style={styles.perdaButtonText}>Registrar perda</Text>
              </Pressable>
            </View>
          )
        }}
      />

      {/* =====================================================
          MODAL: NOVO LOTE
      ===================================================== */}

      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setAddModalVisible(false)}
        >
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Registrar entrada de lote</Text>

            <TextInput
              placeholder={`Quantidade (${insumo?.unidadeMedida ?? ''})`}
              value={novaQuantidade}
              onChangeText={setNovaQuantidade}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Validade (AAAA-MM-DD)"
              value={novaValidade}
              onChangeText={setNovaValidade}
              style={styles.input}
            />

            <TextInput
              placeholder="Fornecedor (opcional)"
              value={novoFornecedor}
              onChangeText={setNovoFornecedor}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.confirmButton, savingLote && styles.disabledButton]}
                onPress={handleAddLote}
                disabled={savingLote}
              >
                <Text style={styles.confirmButtonText}>
                  {savingLote ? 'Salvando...' : 'Registrar'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* =====================================================
          MODAL: REGISTRAR PERDA
      ===================================================== */}

      <Modal
        visible={perdaModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPerdaModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPerdaModalVisible(false)}
        >
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Registrar perda do lote</Text>

            <Text style={styles.modalText}>
              {selectedLote?.quantidadeAtual} {insumo?.unidadeMedida} serão
              descartados deste lote.
            </Text>

            <TextInput
              placeholder="Motivo (opcional)"
              value={perdaMotivo}
              onChangeText={setPerdaMotivo}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setPerdaModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.confirmButton, savingPerda && styles.disabledButton]}
                onPress={() =>
                  handleRegistrarPerda(
                    selectedLote &&
                      diasAteVencimento(selectedLote.dataValidade) <= 0
                      ? 'PERDA_VALIDADE'
                      : 'PERDA_OUTRO'
                  )
                }
                disabled={savingPerda}
              >
                <Text style={styles.confirmButtonText}>
                  {savingPerda ? 'Registrando...' : 'Confirmar perda'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  containerDesktop: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
  },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: COLORS.textMuted },

  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  backButtonText: { color: '#fff', fontWeight: '700' },

  title: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  titleDesktop: { fontSize: 34 },
  subtitle: { color: COLORS.textMuted, marginTop: 4, marginBottom: 16 },

  addLoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  addLoteButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },

  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: COLORS.textMuted, textAlign: 'center' },

  loteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loteCardVencendo: {
    borderColor: COLORS.warning,
    backgroundColor: COLORS.warningSoft,
  },

  loteQuantidade: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  loteValidade: { color: COLORS.textMuted, marginTop: 4 },
  loteValidadeAlerta: { color: COLORS.warning, fontWeight: '700' },
  loteFornecedor: { color: COLORS.textMuted, marginTop: 2, fontSize: 12 },

  perdaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.dangerSoft,
  },
  perdaButtonText: { color: COLORS.danger, fontWeight: '700', fontSize: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#3b2417', marginBottom: 14 },
  modalText: { color: '#666', lineHeight: 22, marginBottom: 14 },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  cancelButtonText: { color: '#444', fontWeight: '700' },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },
  confirmButtonText: { color: '#fff', fontWeight: '700' },
  disabledButton: { opacity: 0.6 },
})