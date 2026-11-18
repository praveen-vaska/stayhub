import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { reason = "Listing does not comply with verification criteria" } = await request.json().catch(() => ({}));
    const updated = db.rejectProperty(params.id, reason);
    if (!updated) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, property: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
