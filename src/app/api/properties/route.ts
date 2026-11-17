import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth/jwt";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const city = searchParams.get("city") || undefined;
    const locality = searchParams.get("locality") || undefined;
    const category = searchParams.get("category") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const genderPreference = searchParams.get("genderPreference") || undefined;
    const furnishingStatus = searchParams.get("furnishingStatus") || undefined;
    const sharingType = searchParams.get("sharingType") || undefined;
    const rating = searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined;
    const availableNow = searchParams.get("availableNow") === "true";
    const searchQuery = searchParams.get("q") || searchParams.get("searchQuery") || undefined;
    const sort = (searchParams.get("sort") as any) || "recommended";
    const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined;
    const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined;
    const radiusKm = searchParams.get("radiusKm") ? Number(searchParams.get("radiusKm")) : undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;

    const amenities = searchParams.getAll("amenity");

    const result = db.getProperties({
      city,
      locality,
      category,
      minPrice,
      maxPrice,
      genderPreference,
      furnishingStatus,
      sharingType,
      rating,
      availableNow,
      searchQuery,
      sort,
      lat,
      lng,
      radiusKm,
      page,
      limit,
      amenities: amenities.length > 0 ? amenities : undefined,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch properties" }, { status: 500 });
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
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.category || !body.city || !body.price) {
      return NextResponse.json({ error: "Missing required property fields" }, { status: 400 });
    }

    const newProperty = db.createProperty({
      ...body,
      ownerId: payload.id,
      ownerName: payload.name || "Verified Host",
    });

    return NextResponse.json({ success: true, property: newProperty }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create property" }, { status: 500 });
  }
}
