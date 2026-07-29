import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getVendorIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get("session_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== "VENDOR") {
      return null;
    }

    return decoded.userId;
  } catch {
    return null;
  }
}