import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";
import { searchGooglePlaces } from "@/lib/services/googlePlaces";

// Avoid hitting Google on every keystroke / repeated query (per server instance).
const CACHE_TTL_MS = 10 * 60 * 1000;
const placesCache = new Map<string, { at: number; ids: string[] }>();

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
    const userLat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined;
    const userLng = searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined;
    const radiusKm = searchParams.get("radiusKm") ? Number(searchParams.get("radiusKm")) : undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;
    const amenities = searchParams.getAll("amenity");

    const cityParam = city && city !== "All" ? city : undefined;
    const localityParam = locality && locality !== "All" ? locality : undefined;
    const categoryParam = category && category !== "All" ? category : undefined;

    // Sanitize common typos before hitting Google Places (e.g. srre -> sree)
    const sanitizedSearchQuery = searchQuery
      ? searchQuery
          .replace(/\b(srre|sre|sreee|srie)\b/gi, "sree")
          .replace(/\b(hostle|hostal)\b/gi, "hostel")
          .replace(/\b(gachoiboli|gachobli|gachobliw)\b/gi, "gachibowli")
          .trim()
      : undefined;

    // 1. Query indexed properties from database (instant in-memory search)
    let result = db.getProperties({
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
      userLat,
      userLng,
      lat: userLat,
      lng: userLng,
      radiusKm,
      page,
      limit,
      amenities: amenities.length > 0 ? amenities : undefined,
    });

    // 2. If results are low (< 4) and user searched a specific query (>= 3 chars), discover live places via Google
    if (
      result.total < 4 &&
      process.env.GOOGLE_PLACES_API_KEY &&
      sanitizedSearchQuery &&
      sanitizedSearchQuery.length >= 3
    ) {
      const cacheKey = JSON.stringify([cityParam, localityParam, categoryParam, sanitizedSearchQuery.toLowerCase()]);
      const cached = placesCache.get(cacheKey);
      let googleIds: string[] = [];

      if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
        googleIds = cached.ids;
      } else {
        try {
          const livePlaces = await searchGooglePlaces({
            city: cityParam,
            locality: localityParam,
            category: categoryParam,
            query: sanitizedSearchQuery,
            limit: 20,
          });

          if (livePlaces.length > 0) {
            db.addGoogleProperties(livePlaces);
            googleIds = livePlaces.map((p) => p.id);
            placesCache.set(cacheKey, { at: Date.now(), ids: googleIds });
          }
        } catch (placeErr) {
          console.warn("Google Places fetch non-critical warning:", placeErr);
        }
      }

      if (googleIds.length > 0) {
        result = db.getProperties({
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
          includeIds: googleIds,
          sort,
          userLat,
          userLng,
          lat: userLat,
          lng: userLng,
          radiusKm,
          page,
          limit,
          amenities: amenities.length > 0 ? amenities : undefined,
        });
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}
