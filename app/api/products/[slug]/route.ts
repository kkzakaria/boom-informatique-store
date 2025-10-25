import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: {
    slug: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = params

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        variants: true,
      },
    })

    if (!product) {
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