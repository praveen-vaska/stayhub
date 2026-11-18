import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  if (!city) {
    return NextResponse.json({ localities: [] });
  }
  const localities = db.getLocalities(city);
  return NextResponse.json({ localities });
}
