import type { Metadata } from "next";
import { headers } from "next/headers";
import { prisma } from "@/backend/lib/prisma";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Commerce MVP",
  description: "Multi-brand E-Commerce MVP built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const vendorSlug = headersList.get("x-vendor-slug");

  let vendor = null;

  if (vendorSlug) {
    vendor = await prisma.vendor.findUnique({
      where: { slug: vendorSlug },
    });
  }

  const cssVariables = vendor
    ? ({
        "--color-primary": vendor.colorPrimary,
        "--color-secondary": vendor.colorSecondary || "#666666",
        "--color-accent": vendor.colorAccent || "#999999",
      } as React.CSSProperties)
    : undefined;

  return (
    <html lang="en">
      <body style={cssVariables}>
        {vendor && (
          <div style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
            {vendor.logoUrl && (
              <img
                src={vendor.logoUrl}
                alt={vendor.name}
                style={{ height: "40px" }}
              />
            )}
            <h1 style={{ color: "var(--color-primary)" }}>{vendor.name}</h1>
          </div>
        )}
        {children}
      </body>
    </html>
  );
}