import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";

// GET /api/storefront/products - list the current vendor's products (optionally filtered by category)
export async function GET(request: NextRequest) {
  try {
    const vendorSlug = request.headers.get("x-vendor-slug");

    if (!vendorSlug) {
      return NextResponse.json(
        { error: "No vendor subdomain detected" },
        { status: 404 }
      );
    }

    const vendor = await prisma.vendor.findUnique({
      where: { slug: vendorSlug },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const products = await prisma.product.findMany({
      where: {
        vendorId: vendor.id,
        ...(categoryId && { categoryId }),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}