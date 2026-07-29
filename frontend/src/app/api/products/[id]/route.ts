import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getVendorIdFromRequest } from "@/backend/lib/auth";

// PUT /api/products/[id] - edit a product (only if it belongs to the logged-in vendor)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existingProduct.vendorId !== user.ownedVendor.id) {
      return NextResponse.json(
        { error: "You don't have permission to edit this product" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, price, quantity, categoryId } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price && { price }),
        ...(quantity !== undefined && { quantity }),
        ...(categoryId && { categoryId }),
      },
      include: { category: true },
    });

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE /api/products/[id] - delete a product (only if it belongs to the logged-in vendor)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existingProduct.vendorId !== user.ownedVendor.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this product" },
        { status: 403 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}