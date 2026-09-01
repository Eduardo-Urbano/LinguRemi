import { apiFetch } from './api'

import type { Product } from '../types/Product'
import type { UpdateProductRequest } from '../types/UpdateProductRequest'
import type { BlogRecipe } from '../types/BlogRecipe'
import type { AdminUser } from '../types/AdminUser'
import type { Insumo, LoteInsumo, MovimentacaoEstoque } from '../types/Insumo'

export async function getAdminProducts() {
  return await apiFetch<Product[]>('/admin/produtos')
}

export async function deleteProduct(id: number) {
  return await apiFetch(`/admin/produtos/${id}`, {
    method: 'DELETE',
  })
}

export async function editProduct(
  id: number,
  data: UpdateProductRequest
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    `/admin/editarReceita/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  )
}

export async function getAdminBlogRecipes(): Promise<BlogRecipe[]> {
  return apiFetch<BlogRecipe[]>('/admin/todosBlog')
}

export async function deleteBlogRecipe(
  id: number
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/blog/${id}`, {
    method: 'DELETE',
  })
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>('/admin/usuarios')
}

export async function toggleUserStatus(
  id: number
): Promise<{ message: string; ativo: boolean }> {
  return apiFetch(`/admin/usuarios/${id}/status`, {
    method: 'PUT',
  })
}

export type InsumoPayload = {
  nomeInsumo: string
  unidadeMedida: string
  estoqueMinimo: number
  custoUnitario?: number | null
}

export type LotePayload = {
  quantidade: number
  dataValidade: string // 'YYYY-MM-DD'
  fornecedor?: string | null
}

export type PerdaPayload = {
  quantidade?: number // se omitido, o backend usa o restante do lote
  tipoMovimentacao: 'PERDA_VALIDADE' | 'PERDA_OUTRO'
  motivo?: string | null
}

export async function getAdminInsumos(): Promise<Insumo[]> {
  return apiFetch('/admin/insumos')
}

export async function getInsumosBaixoEstoque(): Promise<Insumo[]> {
  return apiFetch('/admin/insumos/baixoEstoque')
}

export async function getLotesVencendo(dias = 7): Promise<LoteInsumo[]> {
  return apiFetch(`/admin/insumos/vencendo?dias=${dias}`)
}

export async function createInsumo(payload: InsumoPayload): Promise<Insumo> {
  return apiFetch('/admin/insumos', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function editInsumo(id: number, payload: InsumoPayload): Promise<Insumo> {
  return apiFetch(`/admin/insumos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteInsumo(id: number): Promise<{ message: string }> {
  return apiFetch(`/admin/insumos/${id}`, {
    method: 'DELETE',
  })
}

export async function getLotesDoInsumo(idInsumo: number): Promise<LoteInsumo[]> {
  return apiFetch(`/admin/insumos/${idInsumo}/lotes`)
}

export async function createLote(idInsumo: number, payload: LotePayload): Promise<LoteInsumo> {
  return apiFetch(`/admin/insumos/${idInsumo}/lotes`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function registrarPerda(idLote: number, payload: PerdaPayload): Promise<{ message: string }> {
  return apiFetch(`/admin/lotes/${idLote}/perda`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function getMovimentacoesDoInsumo(idInsumo: number): Promise<MovimentacaoEstoque[]> {
  return apiFetch(`/admin/insumos/${idInsumo}/movimentacoes`)
}