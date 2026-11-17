import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth/jwt";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    let token = extractTokenFromHeader(authHeader);

    if (!token) {
      // Check cookies
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/auth_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ user: null });
    }

    const user = db.getUserById(payload.id);
    return NextResponse.json({ user: user || null });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
