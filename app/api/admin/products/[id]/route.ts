import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, description, sku, price, stock, categoryId, brand, isActive } = body;

    // Validate required fields
    if (!name || !sku || !price || !stock) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if SKU is already used by another product
    if (sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku },
      });

      if (skuExists) {
        return NextResponse.json({ error: "SKU already exists" }, { status: 400 });
      }
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        slug,
        sku,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: categoryId || existingProduct.categoryId,
        brand,
        isActive: isActive !== undefined ? isActive : existingProduct.isActive,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            url: true,
            isPrimary: true,
          },
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
        cartItems: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product is used in orders or carts
    if (existingProduct.orderItems.length > 0 || existingProduct.cartItems.length > 0) {
      return NextResponse.json({
        error: "Cannot delete product that is referenced in orders or carts"
      }, { status: 400 });
    }

    // Delete product (cascade will handle related images and variants)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}