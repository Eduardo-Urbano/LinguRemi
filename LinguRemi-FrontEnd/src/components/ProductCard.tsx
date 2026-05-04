import { getProductImage } from '../services/productService'
import type { Product } from '../types/Product'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  function handleOpenProduct() {
    window.location.href = `/product?id=${product.idReceitas}`
  }

  return (
    <article
      onClick={handleOpenProduct}
      className="flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <img
        src={getProductImage(product.imgReceitas)}
        alt={`Imagem do produto ${product.nomeReceitas}`}
        className="h-48 w-full object-cover"
      />

      <div className="flex flex-col p-4">
        <div className="flex flex-row justify-between gap-4">
          <h3 className="mb-2 pr-5 text-lg font-bold">
            {product.nomeReceitas}
          </h3>

          <p className="mt-1 text-sm">
            ★ {product.avaliacaoReceitas}
          </p>
        </div>

        <p className="text-sm text-gray-600">
          {product.descReceitas}
        </p>

        <h3 className="mt-5 font-semibold">
          R$ {product.valorReceitas.toFixed(2)}
        </h3>
      </div>
    </article>
  )
}