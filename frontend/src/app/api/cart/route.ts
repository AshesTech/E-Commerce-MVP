import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getUserIdFromRequest } from "@/backend/lib/auth";

// GET /api/cart - view the logged-in buyer's cart
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { buyerId: userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ cart: { items: [] } });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/cart - add a product to the cart (or increase quantity if already there)
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const cart = await prisma.cart.upsert({
      where: { buyerId: userId },
      update: {},
      create: { buyerId: userId },
    });

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity ?? 1) },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: quantity ?? 1,
        },
        include: { product: true },
      });
    }

    return NextResponse.json({ message: "Added to cart", item: cartItem }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}