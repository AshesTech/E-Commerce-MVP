import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  const hostname = host.split(":")[0];

  const parts = hostname.split(".");

  let subdomain: string | null = null;

  if (parts.length > 2 || (parts.length === 2 && parts[1] === "localhost")) {
    const candidate = parts[0];
    if (candidate !== "www") {
      subdomain = candidate;
    }
  }

  const requestHeaders = new Headers(request.headers);

  if (subdomain) {
    requestHeaders.set("x-vendor-slug", subdomain);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};