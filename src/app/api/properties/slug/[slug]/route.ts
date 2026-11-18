import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const property = db.getPropertyBySlug(params.slug);
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }
  return NextResponse.json({ property });
}
