import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getVendorIdFromRequest } from "@/backend/lib/auth";

// GET /api/products - list the logged-in vendor's own products
export async function GET(request: NextRequest) {
  try {
    const userId = getVendorIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ownedVendor: true },
    });

    if (!user?.ownedVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { vendorId: user.ownedVendor.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/products - add a new product
export async function POST(request: NextRequest) {
  try {
    const userId = getVendorIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ownedVendor: true },
    });

    if (!user?.ownedVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, price, quantity, categoryId } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        quantity: quantity ?? 0,
        vendorId: user.ownedVendor.id,
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}