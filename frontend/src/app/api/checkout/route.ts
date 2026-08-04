import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getVendorIdFromRequest } from "@/backend/lib/auth";

// POST /api/checkout - convert the buyer's cart into an order
export async function POST(request: NextRequest) {
  try {
    const userId = getVendorIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const { shippingName, shippingEmail, shippingAddress } = body;

    if (!shippingName || !shippingEmail || !shippingAddress) {
      return NextResponse.json(
        { error: "Shipping name, email, and address are required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { buyerId: userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // All items in a cart should belong to the same vendor's store
    const vendorId = cart.items[0].product.vendorId;
    const mismatchedItem = cart.items.find(
      (item) => item.product.vendorId !== vendorId
    );

    if (mismatchedItem) {
      return NextResponse.json(
        { error: "Cart contains items from multiple vendors" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        buyerId: userId,
        vendorId,
        shippingName,
        shippingEmail,
        shippingAddress,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // Clear the cart after successful checkout
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json(
      { message: "Order placed successfully", order },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}