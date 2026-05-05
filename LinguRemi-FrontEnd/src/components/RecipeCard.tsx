import type { Recipe } from '../types/Recipe'
import { getRecipeImageUrl } from '../services/recipeService'

type RecipeCardProps = {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  function handleOpenRecipe() {
    window.location.assign(`/product?id=${recipe.idReceitas}`)
  }

  return (
    <article
      onClick={handleOpenRecipe}
      className="flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <img
        src={getRecipeImageUrl(recipe.imgReceitas)}
        alt={`Imagem da receita ${recipe.nomeReceitas}`}
        className="h-48 w-full object-cover"
      />

      <div className="flex flex-col p-4">
        <div className="flex flex-row justify-between gap-4">
          <h3 className="mb-2 pr-5 text-lg font-bold">
            {recipe.nomeReceitas}
          </h3>

          <p className="mt-1 text-sm" aria-label={`Avaliação ${recipe.avaliacaoReceitas}`}>
            ★ {recipe.avaliacaoReceitas}
          </p>
        </div>

        <p className="text-sm text-gray-600">
          {recipe.descReceitas}
        </p>
      </div>
    </article>
  )
}