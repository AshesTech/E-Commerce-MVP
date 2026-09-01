import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getUserIdFromRequest } from "@/backend/lib/auth";

// GET /api/buyer/orders - list all orders placed by the logged-in buyer
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      include: {
        items: { include: { product: true } },
        vendor: {
          select: { name: true, slug: true, logoUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}