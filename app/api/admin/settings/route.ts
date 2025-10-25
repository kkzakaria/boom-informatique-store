import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// In a real application, you'd store these settings in a database
// For this demo, we'll use a simple in-memory store or environment variables
const defaultSettings = {
  name: process.env.STORE_NAME || "Boom Informatique",
  description: process.env.STORE_DESCRIPTION || "Votre magasin d'informatique en ligne",
  email: process.env.STORE_EMAIL || "contact@boom-informatique.fr",
  phone: process.env.STORE_PHONE || "+33 1 23 45 67 89",
  address: process.env.STORE_ADDRESS || "123 Rue de l'Informatique, 75001 Paris, France",
  currency: process.env.STORE_CURRENCY || "EUR",
  taxRate: parseFloat(process.env.STORE_TAX_RATE || "20"),
  shippingEnabled: process.env.STORE_SHIPPING_ENABLED !== "false",
  maintenanceMode: process.env.STORE_MAINTENANCE_MODE === "true",
  allowGuestCheckout: process.env.STORE_ALLOW_GUEST_CHECKOUT !== "false",
};

// Simple in-memory storage for demo purposes
let storeSettings = { ...defaultSettings };

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(storeSettings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'currency'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate tax rate
    if (body.taxRate < 0 || body.taxRate > 100) {
      return NextResponse.json({ error: "Tax rate must be between 0 and 100" }, { status: 400 });
    }

    // Update settings
    storeSettings = {
      ...storeSettings,
      ...body,
    };

    // In a real application, you'd save these to a database
    // For now, we'll just return the updated settings

    return NextResponse.json(storeSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}