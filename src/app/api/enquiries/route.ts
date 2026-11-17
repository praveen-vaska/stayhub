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

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId") || undefined;
    const ownerId = searchParams.get("ownerId") || undefined;
    const userId = searchParams.get("userId") || undefined;

    const enquiries = db.getEnquiries({ propertyId, ownerId, userId });
    return NextResponse.json({ enquiries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch enquiries" }, { status: 500 });
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

    let userId: string | undefined = undefined;
    if (token) {
      const payload = verifyToken(token);
      if (payload) userId = payload.id;
    }

    const body = await request.json();
    const { propertyId, userName, userEmail, userPhone, message, preferredVisitDate } = body;

    if (!propertyId || !userName || !userEmail || !userPhone || !message) {
      return NextResponse.json({ error: "Please fill all required enquiry fields" }, { status: 400 });
    }

    const property = db.getPropertyById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const newEnquiry = db.createEnquiry({
      propertyId,
      propertyTitle: property.title,
      propertyLocation: `${property.locality}, ${property.city}`,
      propertyImage: property.coverImage || (property.images && property.images[0]),
      userId,
      userName,
      userEmail,
      userPhone,
      message,
      preferredVisitDate,
      ownerId: property.ownerId,
    });

    return NextResponse.json({ success: true, enquiry: newEnquiry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit enquiry" }, { status: 500 });
  }
}
