import { useEffect, useMemo, useState } from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { getBlogRecipeImage, getBlogRecipes } from '../services/blogService'
import type { BlogRecipe } from '../types/BlogRecipe'
import { clearAuthData, isAuthenticated as checkAuth } from '../services/authService'

export function Blog() {
  const [recipes, setRecipes] = useState<BlogRecipe[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function loadRecipes() {
      const data = await getBlogRecipes()
      setRecipes(data)
      setIsLoading(false)
    }

    setIsAuthenticated(checkAuth())
    loadRecipes()
  }, [])

  const filteredRecipes = useMemo(() => {
    const term = search.toLowerCase().trim()

    if (!term) return recipes

    return recipes.filter((recipe) => {
      return (
        recipe.nomeReceitablog.toLowerCase().includes(term) ||
        recipe.descricaoReceitablog.toLowerCase().includes(term) ||
        recipe.ingredientesReceitablog?.toLowerCase().includes(term)
      )
    })
  }, [recipes, search])

  return (
    <div className="flex min-h-screen flex-col scroll-mt-4">
      <Header
        onLoginClick={() => {
          window.location.href = '/login'
        }}
        isAuthenticated={isAuthenticated}
        onLogout={() => {
          clearAuthData()
          setIsAuthenticated(false)
        }}
      />

      <main className="flex-1">
        <section className="mt-5 flex flex-col items-center justify-center gap-4 px-4 md:flex-row">
          <div className="flex h-10 w-full max-w-2xl items-center justify-between overflow-hidden rounded-xl border border-black pl-3 shadow-lg">
            <input
              type="text"
              placeholder="Buscar receitas..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="grow border-none bg-transparent outline-none"
            />

            <img
              src="/assets/icons/lupa.png"
              alt=""
              className="mr-2 h-6 w-6"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl p-2 shadow-lg"
          >
            Adicionar Receita <strong>+</strong>
          </button>
        </section>

        <section className="container mx-auto px-4 py-8" aria-labelledby="blog-title">
          <h1 id="blog-title" className="sr-only">
            Blog de receitas
          </h1>

          {isLoading ? (
            <p className="text-center text-gray-600">Carregando receitas...</p>
          ) : filteredRecipes.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma receita encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filteredRecipes.map((recipe) => (
                <article
                  key={recipe.idReceitaBlog}
                  onClick={() => {
                    window.location.href = `/receita?id=${recipe.idReceitaBlog}`
                  }}
                  className="flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:flex-row"
                >
                  <img
                    src={getBlogRecipeImage(recipe.imgReceitablog)}
                    alt={`Imagem da receita ${recipe.nomeReceitablog}`}
                    className="h-48 w-full object-cover sm:w-60"
                  />

                  <div className="flex flex-col p-4">
                    <time className="font-light text-gray-400">
                      {new Date(recipe.dataReceitablog).toLocaleDateString('pt-BR')}
                    </time>

                    <h2 className="mb-2 text-lg font-bold">
                      {recipe.nomeReceitablog}
                    </h2>

                    <p className="text-sm text-gray-600">
                      {recipe.descricaoReceitablog}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <form className="relative z-10 w-11/12 max-w-sm rounded-lg bg-white p-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-1.5 top-1 cursor-pointer rounded-full bg-red-400 px-2 py-0.5 text-white hover:bg-red-600"
            >
              X
            </button>

            <h2 className="mb-4 text-center text-2xl font-bold">
              Adicione Sua Receita
            </h2>

            <input type="text" placeholder="Nome" className="mb-3 w-full rounded border p-2" />
            <input type="text" placeholder="Ingredientes" className="mb-3 w-full rounded border p-2" />
            <input type="text" placeholder="Modo de Preparo" className="mb-3 w-full rounded border p-2" />
            <input type="text" placeholder="Uma breve descrição" className="mb-3 w-full rounded border p-2" />
            <input type="text" placeholder="Ex: 15min" className="mb-3 w-full rounded border p-2" />

            <label className="mx-auto mt-2 flex w-3/4 cursor-pointer justify-center rounded-2xl bg-black py-2 text-white hover:bg-blue-600">
              Adicionar Imagem
              <input type="file" accept="image/*" className="hidden" />
            </label>

            <button
              type="button"
              className="mx-auto mt-5 flex w-3/4 justify-center rounded-2xl bg-black py-2 text-white hover:bg-blue-600"
            >
              Adicionar
            </button>
          </form>
        </div>
      )}

      <Footer />
    </div>
  )
}