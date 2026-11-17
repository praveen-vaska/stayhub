import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const suggestions = db.searchLocations(q);
  return NextResponse.json({ suggestions });
}
