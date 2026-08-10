import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getVendorIdFromRequest } from "@/backend/lib/auth";
import { sendEmail } from "@/backend/lib/mailer";

// PATCH /api/vendor/orders/[id] - update an order's status (only if it belongs to the logged-in vendor)
export async function PATCH(
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

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["PLACED", "DISPATCHED", "DELIVERED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required (PLACED, DISPATCHED, or DELIVERED)" },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({ where: { id } });

    if (!existingOrder || existingOrder.vendorId !== user.ownedVendor.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } }, vendor: true },
    });

    // Email the buyer about the status update
    await sendEmail({
      to: updatedOrder.shippingEmail,
      subject: `Your order status has changed - ${updatedOrder.vendor.name}`,
      html: `
        <h2>Order Update</h2>
        <p><strong>Order ID:</strong> ${updatedOrder.id}</p>
        <p>Your order status is now: <strong>${status}</strong></p>
      `,
    });

    return NextResponse.json({
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}