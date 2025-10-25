import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { z } from "zod"

const productsQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("12"),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["name", "price", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  featured: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = productsQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      category: searchParams.get("category"),
      search: searchParams.get("search"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
      featured: searchParams.get("featured"),
    })

    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const from = (page - 1) * limit
    const to = from + limit - 1

    const supabase = await createClient()

    // Build the query
    let supabaseQuery = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images!inner(*)
      `, { count: 'exact' })
      .eq('isActive', true)
      .eq('product_images.isPrimary', true)
      .range(from, to)
      .order(query.sortBy, { ascending: query.sortOrder === 'asc' })

    // Add category filter
    if (query.category) {
      supabaseQuery = supabaseQuery.eq('categories.slug', query.category)
    }

    // Add search filter
    if (query.search) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query.search}%,description.ilike.%${query.search}%,brand.ilike.%${query.search}%`)
    }

    // Add featured filter
    if (query.featured === "true") {
      supabaseQuery = supabaseQuery.eq('isFeatured', true)
    }

    const { data: products, error, count } = await supabaseQuery

    if (error) {
      console.error("Erreur Supabase:", error)
      return NextResponse.json(
        { error: "Erreur lors de la récupération des produits" },
        { status: 500 }
      )
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Paramètres invalides", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Erreur lors de la récupération des produits:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}