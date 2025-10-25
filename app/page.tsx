import Link from "next/link"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop, Smartphone, Headphones, Monitor } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Boom Informatique
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <CartDrawer />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Votre magasin informatique en ligne
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection d&apos;ordinateurs, accessoires et composants informatiques.
              Qualité, prix compétitifs et livraison rapide.
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <Link href="/products">Explorer nos produits</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <Link href="/products?featured=true">Produits vedettes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">
              Nos catégories
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Tout ce dont vous avez besoin pour votre setup informatique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Laptop className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>Ordinateurs</CardTitle>
                <CardDescription>
                  Portables et fixes pour tous les usages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products?category=ordinateurs-portables">
                    Voir les produits
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Monitor className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <CardTitle>Composants</CardTitle>
                <CardDescription>
                  Cartes graphiques, RAM, SSD et plus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products?category=composants">
                    Voir les produits
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Headphones className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <CardTitle>Accessoires</CardTitle>
                <CardDescription>
                  Souris, claviers, casques et périphériques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products?category=peripheriques">
                    Voir les produits
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Smartphone className="h-12 w-12 mx-auto text-red-600 mb-4" />
                <CardTitle>Logiciels</CardTitle>
                <CardDescription>
                  Licences et logiciels pour votre productivité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products?category=logiciels">
                    Voir les produits
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Boom Informatique Store. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
