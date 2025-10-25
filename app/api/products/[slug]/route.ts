import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params
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

    if (error || !product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}