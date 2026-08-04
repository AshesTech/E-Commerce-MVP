import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";

// GET /api/storefront - get the current vendor's public storefront info
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
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        colorPrimary: true,
        colorSecondary: true,
        colorAccent: true,
        slug: true,
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ vendor });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}