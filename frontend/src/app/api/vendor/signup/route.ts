import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/backend/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      colorPrimary,
      colorSecondary,
      colorAccent,
      email,
      password,
    } = body;

    if (!name || !colorPrimary || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.vendor.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "VENDOR",
        ownedVendor: {
          create: {
            name,
            slug,
            description,
            colorPrimary,
            colorSecondary,
            colorAccent,
          },
        },
      },
      include: {
        ownedVendor: true,
      },
    });

    return NextResponse.json(
      {
        message: "Vendor created successfully",
        vendor: user.ownedVendor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}