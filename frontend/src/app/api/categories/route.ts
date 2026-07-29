import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";

// GET /api/categories - list all categories (public, no login needed)
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
