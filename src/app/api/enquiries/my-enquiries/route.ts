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
      return NextResponse.json({ enquiries: [] });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ enquiries: [] });
    }

    const enquiries = db.getEnquiries({ userId: payload.id });
    return NextResponse.json({ enquiries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
