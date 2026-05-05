import { useEffect, useState } from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { RecipeCard } from '../components/RecipeCard'
import { getRandomRecipes } from '../services/recipeService'
import type { Recipe } from '../types/Recipe'
import { clearAuthData, isAuthenticated as checkAuth } from '../services/authService'
import { useAuthModal } from '../contexts/AuthModalContext'

export function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { openLogin } = useAuthModal()

  useEffect(() => {
    async function loadRecipes() {
      const data = await getRandomRecipes()
      setRecipes(data)
      setIsLoading(false)
    }

    setIsAuthenticated(checkAuth())

    loadRecipes()
  }, [])

  return (
    <div className="flex min-h-screen flex-col scroll-mt-4">
      <Header
        onLoginClick={openLogin}
        isAuthenticated={isAuthenticated}
        onLogout={() => {
          clearAuthData()
          setIsAuthenticated(false)
        }}
      />

      <section className="relative h-[70vh] w-full overflow-x-hidden md:h-[82vh]" aria-label="Apresentação da LinguRemi">
        <div className="absolute inset-0 z-40 flex items-center justify-start px-6 md:px-20">
          <h1 className="text-3xl font-bold text-white brightness-150 drop-shadow-lg md:text-5xl">
            Doce que encanta, sabor que fica.
          </h1>
        </div>

        <div className="absolute z-30 h-full w-full bg-gray-950 opacity-25" />

        <video autoPlay muted loop playsInline className="z-0 h-full w-full object-cover shadow-2xl">
          <source src="/assets/videos/65692-515098526.mp4" type="video/mp4" />
        </video>
      </section>

      <main className="container mx-auto flex-1 px-4 pb-12">
        <section aria-labelledby="recipes-title">
          <div className="flex w-full text-center">
            <h2 id="recipes-title" className="mx-auto my-6 flex self-center text-4xl font-bold">
              Descubra novos sabores
            </h2>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-600">Carregando receitas...</p>
          ) : recipes.length === 0 ? (
            <p className="text-center text-gray-600">Nenhuma receita encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.idReceitas} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}