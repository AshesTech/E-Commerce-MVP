import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";

// GET /api/storefront/products/[id] - get a single product's details (scoped to current vendor)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product || product.vendorId !== vendor.id) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}