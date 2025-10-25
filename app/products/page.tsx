import { Suspense } from "react"
import ProductsPageClient from "./products-page-client"

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>}>
      <ProductsPageClient />
    </Suspense>
  )
}