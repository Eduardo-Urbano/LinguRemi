import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { getBlogRecipeById, getBlogRecipeImage } from '../services/blogService'

type RecipeBlog = {
  nomeReceitablog: string
  descricaoReceitablog: string
  ingredientesReceitablog: string
  preparoReceitaBlog: string
  tempoReceitablog: string
  imgReceitablog: string
}

export function RecipeBlogDetails() {
  const [recipe, setRecipe] = useState<RecipeBlog | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')

    if (!id) {
      setNotFound(true)
      return
    }

    async function load(recipeId: string) {
        const data = await getBlogRecipeById(recipeId)

        if (!data) {
            setNotFound(true)
            return
        }

        setRecipe(data)
    }

    load(id)

  }, [])

  if (notFound) {
    return <p className="text-center mt-10">Receita não encontrada.</p>
  }

  if (!recipe) {
    return <p className="text-center mt-10">Carregando receita...</p>
  }

  const ingredientes = recipe.ingredientesReceitablog
    ? recipe.ingredientesReceitablog.split(',').map((i) => i.trim())
    : []

  return (
    <>
      <Header onLoginClick={() => {}} isAuthenticated={false} onLogout={() => {}} />

      <main className="container mx-auto p-4">
        
        <button
          onClick={() => window.history.back()}
          className="mb-4 rounded-xl bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          ← Voltar
        </button>

        <div className="flex flex-col items-center">
          <h1 className="mb-5 text-2xl font-bold">
            {recipe.nomeReceitablog}
          </h1>

          <img
            src={getBlogRecipeImage(recipe.imgReceitablog)}
            alt={recipe.nomeReceitablog}
            className="h-[400px] w-full max-w-4xl rounded-xl object-cover"
          />

          <h2 className="py-5 text-lg font-bold">
            Tempo de preparo: {recipe.tempoReceitablog}
          </h2>

          <section className="w-full max-w-3xl">
            <h3 className="text-xl font-bold mb-3">Ingredientes:</h3>

            <ul className="grid grid-cols-2 gap-2 list-disc pl-6 text-lg">
              {ingredientes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="w-full max-w-3xl mt-6">
            <h3 className="text-xl font-bold">Descrição:</h3>
            <p className="pl-2 text-lg">{recipe.descricaoReceitablog}</p>
          </section>

          <section className="w-full max-w-3xl mt-6">
            <h3 className="text-xl font-bold">Modo de Preparo:</h3>
            <p className="pl-2 text-lg">{recipe.preparoReceitaBlog}</p>
          </section>
        </div>

      </main>

      <Footer />
    </>
  )
}