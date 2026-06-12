import { apiFetch } from './api'

import type { Product } from '../types/Product'
import type { UpdateProductRequest } from '../types/UpdateProductRequest'
import type { BlogRecipe } from '../types/BlogRecipe'
import type { AdminUser } from '../types/AdminUser'

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