import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  stock: number
  isFeatured: boolean
  brand?: string | null
  images: Array<{
    url: string
    alt: string
  }>
  category: {
    name: string
    slug: string
  }
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const primaryImage = product.images[0]?.url || "/placeholder-product.jpg"

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={primaryImage}
            alt={product.images[0]?.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && (
            <Badge variant="secondary" className="bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              Vedette
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Stock status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-red-500 text-white">
              Rupture de stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Category */}
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            {product.category.name}
          </Link>

          {/* Product name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-lg line-clamp-2 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-gray-600">{product.brand}</p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-600">
              {product.price.toFixed(2)} €
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.comparePrice.toFixed(2)} €
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center justify-between">
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
            </span>
          </div>

          {/* Action button */}
          <Button
            className="w-full"
            disabled={product.stock === 0}
            asChild={product.stock > 0}
          >
            {product.stock > 0 ? (
              <Link href={`/products/${product.slug}`}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Voir le produit
              </Link>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Indisponible
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}