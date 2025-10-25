"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Grid, List } from "lucide-react"

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

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    products: number
  }
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<ProductsResponse['pagination'] | null>(null)

  // Filtres
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt")
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc")
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"))

  // Charger les catégories au montage
  useEffect(() => {
    fetchCategories()
  }, [])

  // Recharger les produits quand les filtres changent
  useEffect(() => {
    fetchProducts()
  }, [search, selectedCategory, sortBy, sortOrder, currentPage])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory }),
        sortBy,
        sortOrder,
      })

      const response = await fetch(`/api/products?${params}`)
      const data: ProductsResponse = await response.json()
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory("")
    setSortBy("createdAt")
    setSortOrder("desc")
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catalogue de Produits</h1>
              <p className="mt-2 text-gray-600">
                Découvrez notre sélection complète de produits informatiques
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">Retour à l'accueil</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtres */}
          <div className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recherche */}
                <div>
                  <Label htmlFor="search">Rechercher</Label>
                  <form onSubmit={handleSearch} className="flex gap-2 mt-2">
                    <Input
                      id="search"
                      type="text"
                      placeholder="Nom du produit, marque..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                {/* Catégories */}
                <div>
                  <Label>Catégorie</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les catégories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name} ({category._count.products})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tri */}
                <div>
                  <Label>Trier par</Label>
                  <div className="space-y-2 mt-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Date d'ajout</SelectItem>
                        <SelectItem value="name">Nom</SelectItem>
                        <SelectItem value="price">Prix</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Décroissant</SelectItem>
                        <SelectItem value="asc">Croissant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bouton de réinitialisation */}
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Effacer les filtres
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:w-3/4">
            {/* Résultats et pagination */}
            {pagination && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {pagination.total} produit{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} sur {pagination.totalPages}
                  </span>
                </div>
              </div>
            )}

            {/* Grille de produits */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-6 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                <p className="text-gray-400 mt-2">Essayez de modifier vos critères de recherche</p>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrev}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Précédent
                </Button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNumber = i + 1
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  disabled={!pagination.hasNext}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}