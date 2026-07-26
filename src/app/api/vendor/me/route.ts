import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/backend/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Not a vendor account" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { ownedVendor: true },
    });

    if (!user || !user.ownedVendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ vendor: user.ownedVendor });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Invalid or expired session" },
      { status: 401 }
    );
  }
}