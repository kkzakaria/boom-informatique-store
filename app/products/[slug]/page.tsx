"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/lib/stores/cart-store"
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw, Check } from "lucide-react"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCartStore()

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.slug}`)
        if (!response.ok) {
          notFound()
        }
        const { product: productData } = await response.json()
        if (!productData) {
          notFound()
        }
        setProduct(productData)
      } catch (error) {
        console.error('Error fetching product:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  })

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return

    setAddingToCart(true)
    try {
      addItem({
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0]?.url || "/placeholder-product.jpg",
        stock: product.stock,
        maxQuantity: product.stock,
      })

      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const primaryImage = product.images.find((img: any) => img.isPrimary)?.url ||
                      product.images[0]?.url ||
                      "/placeholder-product.jpg"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au catalogue
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={primaryImage}
                alt={product.images.find((img: any) => img.isPrimary)?.alt || product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Produit vedette
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Additional images would go here */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image: any, index: number) => (
                  <div key={index} className="aspect-square relative overflow-hidden rounded bg-gray-100 cursor-pointer">
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <Link href="/products" className="hover:text-blue-600">Catalogue</Link>
              <span className="mx-2">/</span>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-blue-600">
                {product.category.name}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.brand && (
                <p className="text-lg text-gray-600 mt-1">par {product.brand}</p>
              )}
            </div>

            {/* SKU */}
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-green-600">
                {product.price.toFixed(2)} €
              </span>
              {product.comparePrice && (
                <span className="text-2xl text-gray-500 line-through">
                  {product.comparePrice.toFixed(2)} €
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">
                    En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Rupture de stock</span>
                </>
              )}
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full"
                disabled={product.stock === 0 || addingToCart}
                onClick={handleAddToCart}
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Ajout en cours...
                  </>
                ) : addedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Ajouté au panier !
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Livraison gratuite</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Garantie {product.warranty || '2 ans'}</span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {(product.weight || product.dimensions) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Spécifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Poids:</span>
                      <span>{product.weight} kg</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span>{product.dimensions}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Variants (if any) */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Options disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.variants.map((variant: any) => (
                    <div key={variant.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">{variant.name}: {variant.value}</span>
                        {variant.sku && <span className="text-sm text-gray-500 ml-2">({variant.sku})</span>}
                      </div>
                      <div className="text-right">
                        {variant.price && (
                          <div className="text-green-600 font-medium">
                            +{variant.price.toFixed(2)} €
                          </div>
                        )}
                        <div className={`text-sm ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {variant.stock > 0 ? `${variant.stock} disponible${variant.stock > 1 ? 's' : ''}` : 'Indisponible'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Related Products Section (placeholder for future implementation) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
          <div className="text-center py-8 text-gray-500">
            Fonctionnalité à venir - Produits de la même catégorie
          </div>
        </div>
      </div>
    </div>
  )
}