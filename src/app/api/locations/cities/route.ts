import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";

export async function GET() {
  const cities = db.getCities();
  return NextResponse.json({ cities });
}
