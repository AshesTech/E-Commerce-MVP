import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getVendorIdFromRequest } from "@/backend/lib/auth";

// GET /api/vendor/orders - list all orders placed with the logged-in vendor
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

    const orders = await prisma.order.findMany({
      where: { vendorId: user.ownedVendor.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}