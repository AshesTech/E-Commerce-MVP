import { NextResponse } from "next/server";
import { getHealthStatus } from "@/backend/services/health.service";

export async function GET() {
  return NextResponse.json(getHealthStatus());
}
