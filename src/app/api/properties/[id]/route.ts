import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth/jwt";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const property = db.getPropertyById(params.id);
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }
  return NextResponse.json({ property });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    let token = extractTokenFromHeader(authHeader);
    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/auth_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    const existing = db.getPropertyById(params.id);
    if (!existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Check ownership or admin
    if (payload.role !== "admin" && existing.ownerId !== payload.id) {
      return NextResponse.json({ error: "Forbidden. You do not own this property." }, { status: 403 });
    }

    const updates = await request.json();
    const updated = db.updateProperty(params.id, updates);
    return NextResponse.json({ success: true, property: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    let token = extractTokenFromHeader(authHeader);
    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/auth_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    const existing = db.getPropertyById(params.id);
    if (!existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (payload.role !== "admin" && existing.ownerId !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    db.deleteProperty(params.id);
    return NextResponse.json({ success: true, message: "Property deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
