-- Boom Informatique Store - Supabase Migration
-- Database schema for e-commerce application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN', 'MANAGER');
CREATE TYPE "AddressType" AS ENUM ('SHIPPING', 'BILLING');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- Users table (extends Supabase auth.users)
CREATE TABLE "users" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE "addresses" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'France',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Categories table
CREATE TABLE "categories" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "slug" TEXT NOT NULL UNIQUE,
    "image" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Products table
CREATE TABLE "products" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL UNIQUE,
    "sku" TEXT NOT NULL UNIQUE,
    "price" DECIMAL(10,2) NOT NULL,
    "comparePrice" DECIMAL(10,2),
    "costPrice" DECIMAL(10,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "weight" DECIMAL(8,2),
    "dimensions" TEXT,
    "brand" TEXT,
    "warranty" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Product images table
CREATE TABLE "product_images" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Product variants table
CREATE TABLE "product_variants" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sku" TEXT,
    "price" DECIMAL(10,2),
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Orders table
CREATE TABLE "orders" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL UNIQUE DEFAULT uuid_generate_v4()::text,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "total" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "shipping" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "shippingStreet" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingState" TEXT,
    "shippingPostalCode" TEXT NOT NULL,
    "shippingCountry" TEXT NOT NULL DEFAULT 'France',
    "billingStreet" TEXT,
    "billingCity" TEXT,
    "billingState" TEXT,
    "billingPostalCode" TEXT,
    "billingCountry" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Order items table
CREATE TABLE "order_items" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Shopping carts table
CREATE TABLE "carts" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Cart items table
CREATE TABLE "cart_items" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX "products_slug_idx" ON "products"("slug");
CREATE INDEX "products_sku_idx" ON "products"("sku");
CREATE INDEX "product_images_productId_idx" ON "product_images"("productId");
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");
CREATE INDEX "orders_userId_idx" ON "orders"("userId");
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");
CREATE INDEX "carts_userId_idx" ON "carts"("userId");
CREATE INDEX "cart_items_cartId_idx" ON "cart_items"("cartId");
CREATE INDEX "cart_items_productId_idx" ON "cart_items"("productId");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON "categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON "products" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON "orders" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON "carts" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "addresses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_variants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "carts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cart_items" ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON "users" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update their own profile" ON "users" FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "Admins can view all users" ON "users" FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM "users" WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
);
CREATE POLICY "Admins can update all users" ON "users" FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM "users" WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
);

-- Addresses policies
CREATE POLICY "Users can view their own addresses" ON "addresses" FOR SELECT USING (
    "userId" = auth.uid()::text
);
CREATE POLICY "Users can create their own addresses" ON "addresses" FOR INSERT WITH CHECK (
    "userId" = auth.uid()::text
);
CREATE POLICY "Users can update their own addresses" ON "addresses" FOR UPDATE USING (
    "userId" = auth.uid()::text
);
CREATE POLICY "Users can delete their own addresses" ON "addresses" FOR DELETE USING (
    "userId" = auth.uid()::text
);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON "categories" FOR SELECT USING (true);

-- Products policies (public read)
CREATE POLICY "Products are viewable by everyone" ON "products" FOR SELECT USING (true);

-- Product images policies (public read)
CREATE POLICY "Product images are viewable by everyone" ON "product_images" FOR SELECT USING (true);

-- Product variants policies (public read)
CREATE POLICY "Product variants are viewable by everyone" ON "product_variants" FOR SELECT USING (true);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON "orders" FOR SELECT USING (
    "userId" = auth.uid()::text
);
CREATE POLICY "Users can create their own orders" ON "orders" FOR INSERT WITH CHECK (
    "userId" = auth.uid()::text
);
CREATE POLICY "Users can update their own orders" ON "orders" FOR UPDATE USING (
    "userId" = auth.uid()::text
);
CREATE POLICY "Admins can view all orders" ON "orders" FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM "users" WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
);
CREATE POLICY "Admins can update all orders" ON "orders" FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM "users" WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
);

-- Order items policies
CREATE POLICY "Users can view their own order items" ON "order_items" FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM "orders" WHERE "orders".id = "order_items"."orderId" AND "orders"."userId" = auth.uid()::text
    )
);
CREATE POLICY "Users can create order items for their orders" ON "order_items" FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM "orders" WHERE "orders".id = "order_items"."orderId" AND "orders"."userId" = auth.uid()::text
    )
);
CREATE POLICY "Admins can view all order items" ON "order_items" FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM "users" WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
);

-- Carts policies
CREATE POLICY "Users can view their own cart" ON "carts" FOR SELECT USING (
    "userId" = auth.uid()::text
);
CREATE POLICY "Users can create their own cart" ON "carts" FOR INSERT WITH CHECK (
    "userId" = auth.uid()::text
);
CREATE POLICY "Users can update their own cart" ON "carts" FOR UPDATE USING (
    "userId" = auth.uid()::text
);
CREATE POLICY "Users can delete their own cart" ON "carts" FOR DELETE USING (
    "userId" = auth.uid()::text
);

-- Cart items policies
CREATE POLICY "Users can view their own cart items" ON "cart_items" FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM "carts" WHERE "carts".id = "cart_items"."cartId" AND "carts"."userId" = auth.uid()::text
    )
);
CREATE POLICY "Users can create cart items in their cart" ON "cart_items" FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM "carts" WHERE "carts".id = "cart_items"."cartId" AND "carts"."userId" = auth.uid()::text
    )
);
CREATE POLICY "Users can update their own cart items" ON "cart_items" FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM "carts" WHERE "carts".id = "cart_items"."cartId" AND "carts"."userId" = auth.uid()::text
    )
);
CREATE POLICY "Users can delete their own cart items" ON "cart_items" FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM "carts" WHERE "carts".id = "cart_items"."cartId" AND "carts"."userId" = auth.uid()::text
    )
);