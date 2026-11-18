<<<<<<< HEAD
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
=======
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const photoName = searchParams.get("name");

  if (!photoName || !photoName.startsWith("places/")) {
    return Response.json({ error: "Invalid photo name parameter" }, { status: 400 });
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
<<<<<<< HEAD
    const fallback = getAccommodationFallback(category, photoName);
    return NextResponse.redirect(fallback, { status: 307 });
=======
    return Response.json({ error: "Google Places API key is not configured" }, { status: 500 });
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
  }

  try {
    const maxHeight = searchParams.get("maxHeight") || "800";
    const maxWidth = searchParams.get("maxWidth") || "1200";
    const googlePhotoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}&key=${apiKey}`;

    const res = await fetch(googlePhotoUrl, {
<<<<<<< HEAD
      redirect: "follow",
    });

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": res.headers.get("content-type") || "image/jpeg",
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
=======
      redirect: "manual",
    });

    const redirectUrl = res.headers.get("location");
    if (redirectUrl) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl,
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
        },
      });
    }

<<<<<<< HEAD
    // If Google Places API returned an error (e.g. quota, expired photo, permission), redirect to fallback
    console.warn(`[places-photo] Upstream returned status ${res.status} for ${photoName.slice(0, 40)}..., using fallback.`);
    const fallback = getAccommodationFallback(category, photoName);
    return NextResponse.redirect(fallback, { status: 307 });
  } catch (err: any) {
    console.error("[places-photo] Proxy error:", err?.message || err);
    const fallback = getAccommodationFallback(category, photoName);
    return NextResponse.redirect(fallback, { status: 307 });
=======
    if (res.ok) {
      const blob = await res.blob();
      return new Response(blob, {
        headers: {
          "Content-Type": res.headers.get("content-type") || "image/jpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    return Response.json({ error: "Failed to retrieve photo" }, { status: res.status });
  } catch (err: any) {
    console.error("Photo proxy error:", err);
    return Response.json({ error: "Internal photo proxy error" }, { status: 500 });
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
  }
}
