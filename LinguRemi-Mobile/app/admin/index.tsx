import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { useResponsive } from '@/src/hooks/useResponsive'
import { BlogAdminPanel } from '@/src/screens/BlogAdminPanel'
import { ProdutosAdminPanel } from '@/src/screens/ProdutosAdminPanel'
import { UsuariosAdminPanel } from '@/src/screens/UsuariosAdminPanel'
import { InsumosAdminPanel } from '@/src/screens/InsumoAdminPanel'

type Section = 'blog' | 'produtos' | 'usuarios' | 'insumos'

const SECTIONS: { key: Section; label: string }[] = [
  { key: 'blog', label: 'Gerenciar blog' },
  { key: 'produtos', label: 'Gerenciar Produtos' },
  { key: 'usuarios', label: 'Gerenciar usuarios' },
  { key: 'insumos', label: 'Controle de insumos' },
]

export default function IndexAdmin() {
  const { isDesktop } = useResponsive()
  const [activeSection, setActiveSection] = useState<Section>('blog')

  function handleSelect(section: Section) {
    if (isDesktop) {
      // Desktop: só troca o que é exibido na área de conteúdo
      setActiveSection(section)
      return
    }

    // Mobile: navega para a rota dedicada, como já era
    if (section === 'blog') router.push('/admin/blog/blog')
    if (section === 'produtos') router.push('/admin/produtos/produtos')
    if (section === 'usuarios') router.push('/admin/usuarios/usuarios')
    if (section === 'insumos') router.push('/admin/insumos/insumos')
  }

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      {/* =====================================================
          MENU (sidebar no desktop, lista de botões no mobile)
      ===================================================== */}

      <View style={[styles.menu, isDesktop && styles.sidebarDesktop]}>
        {SECTIONS.map((section) => (
          <Pressable
            key={section.key}
            style={[
              styles.button,
              isDesktop && styles.menuItemDesktop,
              isDesktop &&
                activeSection === section.key &&
                styles.menuItemActiveDesktop,
            ]}
            onPress={() => handleSelect(section.key)}
          >
            <Text style={styles.buttonText}>{section.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* =====================================================
          ÁREA DE CONTEÚDO (só existe no desktop — no mobile
          cada seção é uma rota própria, aberta por navegação)
      ===================================================== */}

      {isDesktop && (
        <View style={styles.content}>
          {activeSection === 'blog' && (
            <BlogAdminPanel showBackButton={false} />
          )}
          {activeSection === 'produtos' && (
            <ProdutosAdminPanel showBackButton={false} />
          )}
          {activeSection === 'usuarios' && (
            <UsuariosAdminPanel showBackButton={false} />
          )}
          {activeSection === 'insumos' && (
            <InsumosAdminPanel showBackButton={false} />
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f2',
    justifyContent: 'center',
    padding: 20,
  },

  containerDesktop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 0,
  },

  /*
   * MENU
   *
   * Mobile: lista de botões empilhados, centralizada
   * na tela (comportamento original).
   * Desktop: vira uma sidebar fixa à esquerda.
   */
  menu: {},

  sidebarDesktop: {
    width: 260,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ece6dc',
    padding: 20,
  },

  button: {
    backgroundColor: '#000',
    padding: 14,
    marginBottom: 10,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  menuItemDesktop: {
    alignItems: 'flex-start',
    borderRadius: 12,
  },

  menuItemActiveDesktop: {
    backgroundColor: '#b4513b',
  },

  /*
   * CONTEÚDO
   *
   * Ocupa o restante da tela ao lado da sidebar,
   * renderizando o painel selecionado.
   */
  content: {
    flex: 1,
  },
})