import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let result = db.getProperties({
      includeAllStatus: true,
      limit: 100,
    });

    let properties = result.properties;
    if (status && status !== "All") {
      properties = properties.filter((p) => p.approvalStatus === status);
    }

    return NextResponse.json({ properties });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
