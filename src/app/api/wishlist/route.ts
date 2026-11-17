import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth/jwt";

export async function GET(request: Request) {
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
      return NextResponse.json({ wishlist: [] });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ wishlist: [] });
    }

    const wishlist = db.getWishlist(payload.id);
    return NextResponse.json({ wishlist });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
      return NextResponse.json({ error: "Please log in to save properties" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const result = db.toggleWishlist(payload.id, propertyId);
    return NextResponse.json({ success: true, saved: result.saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
