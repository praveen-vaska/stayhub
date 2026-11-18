import { NextResponse } from "next/server";
import { getAccommodationFallback } from "@/lib/utils/fallbackImages";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const photoName = searchParams.get("name");
  const category = searchParams.get("category") || "PG";

  // If photoName is missing or invalid, gracefully redirect to a category-matched fallback image
  if (!photoName || !photoName.startsWith("places/")) {
    const fallback = getAccommodationFallback(category, photoName || "default");
    return NextResponse.redirect(fallback, { status: 307 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    const fallback = getAccommodationFallback(category, photoName);
    return NextResponse.redirect(fallback, { status: 307 });
  }

  try {
    const maxHeight = searchParams.get("maxHeight") || "800";
    const maxWidth = searchParams.get("maxWidth") || "1200";
    const googlePhotoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}&key=${apiKey}`;

    const res = await fetch(googlePhotoUrl, {
      redirect: "follow",
    });

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": res.headers.get("content-type") || "image/jpeg",
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }

    // If Google Places API returned an error (e.g. quota, expired photo, permission), redirect to fallback
    console.warn(`[places-photo] Upstream returned status ${res.status} for ${photoName.slice(0, 40)}..., using fallback.`);
    const fallback = getAccommodationFallback(category, photoName);
    return NextResponse.redirect(fallback, { status: 307 });
  } catch (err: any) {
    console.error("[places-photo] Proxy error:", err?.message || err);
    const fallback = getAccommodationFallback(category, photoName);
    return NextResponse.redirect(fallback, { status: 307 });
  }
}
