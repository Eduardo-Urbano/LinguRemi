import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { clearAuthData, isAdmin, isAuthenticated } from '../services/authService'
import {
    createAdminProduct,
    deleteAdminProduct,
    getAdminProducts,
    updateAdminProduct,
    updateAdminProductQuantity,
    type AdminProductRequest
} from '../services/adminService'
import type { Product } from '../types/Product'
import { getProductImage } from '../services/productService'
import { useAuthModal } from '../contexts/AuthModalContext'

const emptyForm: AdminProductRequest = {
    nome: '',
    descricao: '',
    valor: 0,
    imagem: '',
    disponivel: 0,
    tipoQuantidade: 'unidade',
}

export function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [form, setForm] = useState<AdminProductRequest>(emptyForm)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const { openLogin } = useAuthModal()
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    async function loadProducts() {
        try {
            const data = await getAdminProducts()
            setProducts(data)
        } catch {
            setMessage('Erro ao carregar produtos do painel admin.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
        navigate('/')
        return
    }

    loadProducts()
    }, [navigate])

    function openCreateModal() {
        setEditingProduct(null)
        setForm(emptyForm)
        setIsModalOpen(true)
    }

    function openEditModal(product: Product) {
        setEditingProduct(product)

        setForm({
            nome: product.nomeReceitas,
            descricao: product.descReceitas,
            valor: product.valorReceitas,
            imagem: product.imgReceitas || '',
            disponivel: product.disponivelReceitas,
            tipoQuantidade: product.tipoquantidadeReceitas,
        })

        setIsModalOpen(true)
    }

    async function handleUpdateQuantity(id: number, quantidade: number) {
        if (quantidade < 0) {
            setMessage('A quantidade não pode ser negativa.')
            return
        }

        try {
            await updateAdminProductQuantity(id, quantidade)
            setMessage('Estoque atualizado com sucesso.')
            await loadProducts()
        } catch {
            setMessage('Erro ao atualizar estoque.')
        }
    }

    function openDeleteModal(id: number) {
        setDeleteProductId(id)
        setIsDeleteModalOpen(true)
    }

    async function confirmDelete() {
        if (!deleteProductId) return

        try {
            await deleteAdminProduct(deleteProductId)

            setMessage('Produto excluído com sucesso.')

            setIsDeleteModalOpen(false)
            setDeleteProductId(null)

            await loadProducts()
        } catch {
            setMessage('Erro ao excluir produto.')
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setMessage('')

        if (!form.nome || !form.descricao || form.valor <= 0 || form.disponivel < 0) {
            setMessage('Preencha os campos obrigatórios corretamente.')
            return
        }

        try {
            if (editingProduct) {
                await updateAdminProduct(editingProduct.idReceitas, form)
                setMessage('Produto atualizado com sucesso.')
            } else {
                await createAdminProduct(form)
                setMessage('Produto criado com sucesso.')
            }

            setIsModalOpen(false)
            setForm(emptyForm)
            setEditingProduct(null)
            await loadProducts()
        } catch {
            setMessage('Erro ao salvar produto.')
        }
    }

    function handleLogout() {
        clearAuthData()
        navigate('/')
    }

    return (
    <>
        <Header
            onLoginClick={openLogin}
            isAuthenticated={isAuthenticated()}
            onLogout={handleLogout}
        />

        <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
                <h1 className="text-3xl font-bold">Painel Admin</h1>
                <p className="text-gray-600">
                    Gerenciamento de produtos da LinguRémi
                </p>
            </div>

            <button
                type="button"
                onClick={openCreateModal}
                className="rounded-xl bg-black cursor-pointer px-5 py-2 text-white shadow hover:bg-gray-800"
            >
                Novo produto
            </button>
        </div>

        {message && (
            <p className="mb-4 rounded-lg bg-gray-100 p-3 text-gray-800">
                {message}
            </p>
        )}

        {isLoading ? (
            <p className="text-center text-gray-600">Carregando produtos...</p>
        ) : products.length === 0 ? (
            <p className="text-center text-gray-600">Nenhum produto encontrado.</p>
        ) : (
            <section className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full min-w-[900px] border-collapse">
                <thead className="bg-gray-900 text-white">
                    <tr>
                        <th className="p-3 text-left">Imagem</th>
                        <th className="p-3 text-left">Nome</th>
                        <th className="p-3 text-left">Preço</th>
                        <th className="p-3 text-left">Estoque</th>
                        <th className="p-3 text-left">Tipo</th>
                        <th className="p-3 text-left">Avaliação</th>
                        <th className="p-3 text-left">Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.idReceitas} className="border-b">
                            <td className="p-3">
                                <img
                                    src={getProductImage(product.imgReceitas)}
                                    alt={product.nomeReceitas}
                                    className="h-16 w-20 rounded object-cover"
                                />
                            </td>

                            <td className="p-3 font-semibold">{product.nomeReceitas}</td>

                            <td className="p-3">
                                R$ {product.valorReceitas.toFixed(2)}
                            </td>

                            <td className="p-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={0}
                                        defaultValue={product.disponivelReceitas}
                                        onBlur={(event) =>
                                            handleUpdateQuantity(product.idReceitas,Number(event.target.value),)
                                        }
                                        className="w-20 rounded border p-1 text-center"
                                    />
                                    <span className="text-xs text-gray-500">
                                        auto
                                    </span>
                                </div>
                            </td>

                            <td className="p-3">{product.tipoquantidadeReceitas}</td>

                            <td className="p-3">★ {product.avaliacaoReceitas}</td>

                            <td className="p-3">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(product)}
                                        className="rounded-lg bg-gray-200 cursor-pointer px-3 py-1 hover:bg-gray-300"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => openDeleteModal(product.idReceitas)}
                                        className="rounded-lg bg-red-100 cursor-pointer px-3 py-1 text-red-700 hover:bg-red-200"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </section>
        )}
        </main>

        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div
                    className="absolute inset-0 bg-black/60"
                    onClick={() => setIsModalOpen(false)}
                />

                <form
                    onSubmit={handleSubmit}
                    className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                >
                    <h2 className="mb-4 text-2xl font-bold">
                        {editingProduct ? 'Editar produto' : 'Novo produto'}
                    </h2>

                    <input
                        type="text"
                        placeholder="Nome"
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        className="mb-3 w-full rounded border p-2"
                    />

                    <textarea
                        placeholder="Descrição"
                        value={form.descricao}
                        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        className="mb-3 w-full rounded border p-2"
                    />

                    <input
                        type="number"
                        placeholder="Valor"
                        value={form.valor}
                        onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
                        className="mb-3 w-full rounded border p-2"
                    />

                    <input
                        type="text"
                        placeholder="Imagem. Ex: uploads/bolo.png"
                        value={form.imagem}
                        onChange={(e) => setForm({ ...form, imagem: e.target.value })}
                        className="mb-3 w-full rounded border p-2"
                    />

                    <input
                        type="number"
                        placeholder="Estoque"
                        value={form.disponivel}
                        onChange={(e) =>
                        setForm({ ...form, disponivel: Number(e.target.value) })
                        }
                        className="mb-3 w-full rounded border p-2"
                    />

                    <select
                        value={form.tipoQuantidade}
                        onChange={(e) =>
                        setForm({
                            ...form,
                            tipoQuantidade: e.target.value as 'unidade' | 'peso',
                        })
                        }
                        className="mb-5 w-full rounded border p-2"
                    >
                        <option value="unidade">Unidade</option>
                        <option value="peso">Peso</option>
                    </select>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="rounded-lg bg-gray-200 px-4 py-2 cursor-pointer hover:bg-gray-300"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-black px-4 py-2 cursor-pointer text-white hover:bg-gray-800"
                        >
                            {editingProduct ? 'Salvar alterações' : 'Criar produto'}
                        </button>
                    </div>
                </form>
            </div>
        )}

        {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div
                    className="absolute inset-0 bg-black/60"
                    onClick={() => setIsDeleteModalOpen(false)}
                />

                <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                    <h2 className="mb-4 text-2xl font-bold">
                        Confirmar exclusão
                    </h2>

                    <p className="mb-6 text-gray-600">
                        Tem certeza que deseja excluir este produto?
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="rounded-lg bg-gray-200 cursor-pointer px-4 py-2 hover:bg-gray-300"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="rounded-lg bg-red-600 cursor-pointer px-4 py-2 text-white hover:bg-red-700"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        )}

        <Footer />
    </>
    )
}