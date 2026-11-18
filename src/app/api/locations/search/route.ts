import { NextResponse } from "next/server";
import { db, LocationSuggestion } from "@/lib/db/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const cleanQ = q.trim();

  if (!cleanQ || cleanQ.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  // 1. Get local suggestions (Sub-localities, Colonies, Landmarks, Properties, Cities, Localities)
  const localSuggestions = db.searchLocations(cleanQ);

  // 2. Query Google Places Autocomplete API for live address & sub-locality discovery
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const googleSuggestions: LocationSuggestion[] = [];

  if (apiKey) {
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({
          input: cleanQ,
          includedRegionCodes: ["in"],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && Array.isArray(data.suggestions)) {
          for (const s of data.suggestions) {
            const text = s.placePrediction?.text?.text;
            if (!text) continue;

            const parts = text.split(",").map((p: string) => p.trim());
            const name = parts[0];
            const locality = parts.length > 2 ? parts[1] : undefined;
            const city = parts.length > 3 ? parts[2] : (parts.length > 2 ? parts[parts.length - 3] : "Hyderabad");
            const state = parts.length > 4 ? parts[parts.length - 2] : "Telangana";

            googleSuggestions.push({
              type: "sublocality",
              name,
              fullName: text,
              locality: locality || name,
              city,
              state,
            });
          }
        }
      }
    } catch (err) {
      console.warn("Google Places Autocomplete non-critical warning:", err);
    }
  }

  // 3. Deduplicate by name and return top results
  const seen = new Set<string>();
  const merged: LocationSuggestion[] = [];

  // Prioritize local suggestions (since they already have properties in our system)
  for (const item of [...localSuggestions, ...googleSuggestions]) {
    const key = `${item.name.toLowerCase()}__${item.city.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }

  return NextResponse.json({ suggestions: merged.slice(0, 12) });
}
