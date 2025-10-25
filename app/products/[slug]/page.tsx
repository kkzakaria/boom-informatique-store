import { notFound } from "next/navigation"
import { Metadata } from "next"
import { createClient } from "@/utils/supabase/server"
import { ProductPageClient } from "@/components/product/product-page-client"

interface ProductImage {
  url: string
  alt?: string
  isPrimary?: boolean
}

interface ProductPageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const supabase = await createClient()

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .eq('slug', params.slug)
      .eq('isActive', true)
      .single()

    if (error || !product) {
      return {
        title: "Produit non trouvé | Boom Informatique Store",
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const productUrl = `${baseUrl}/products/${product.slug}`
    const productImage = product.images?.[0]?.url
      ? `${baseUrl}${product.images[0].url}`
      : `${baseUrl}/placeholder-product.jpg`

    return {
      title: `${product.name} | Boom Informatique Store`,
      description: product.description
        ? product.description.substring(0, 160)
        : `Découvrez ${product.name} - ${product.price}€. Livraison rapide et garantie qualité.`,
      keywords: [
        product.name,
        product.brand || "",
        product.category?.name || "",
        "informatique",
        "achat en ligne",
        "e-commerce"
      ].filter(Boolean),
      openGraph: {
        title: `${product.name} - ${product.price}€`,
        description: product.description || `Découvrez ${product.name} chez Boom Informatique Store`,
        url: productUrl,
        images: [
          {
            url: productImage,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Boom Informatique Store`,
        description: product.description?.substring(0, 160) || `Découvrez ${product.name}`,
        images: [productImage],
      },
      alternates: {
        canonical: productUrl,
      },
    }
  } catch (error) {
    return {
      title: "Produit | Boom Informatique Store",
    }
  }
}

// Fetch product data
async function getProduct(slug: string) {
  try {
    const supabase = await createClient()

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('slug', slug)
      .eq('isActive', true)
      .single()

    if (error || !product) return null

    // Transform data for compatibility
    return {
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      weight: product.weight ? Number(product.weight) : null,
      images: product.images?.map((img: ProductImage) => ({
        url: img.url,
        alt: img.alt || product.name,
        isPrimary: img.isPrimary,
      })) || [],
    }
  } catch (error) {
    return null
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return <ProductPageClient product={product} />
}