import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth/jwt";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ reviews: [] });
  }

  const reviews = db.getReviews(propertyId);
  return NextResponse.json({ reviews });
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
      return NextResponse.json({ error: "Please log in to submit a review" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { propertyId, rating, comment } = await request.json();
    if (!propertyId || !rating || !comment) {
      return NextResponse.json({ error: "Property ID, rating, and comment are required" }, { status: 400 });
    }

    const newReview = db.addReview({
      propertyId,
      userId: payload.id,
      userName: payload.name || "Verified Resident",
      rating: Number(rating),
      comment,
      verifiedStay: true,
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
