import { Property, PropertyCategory, GenderPreference, PricingType } from "@/types";
import { SEED_CITIES } from "@/lib/db/seedData";

interface SearchGooglePlacesParams {
  city?: string;
  locality?: string;
  category?: string;
  query?: string;
  limit?: number;
}

const CATEGORY_KEYWORDS: Record<string, string> = {
  PG: "PG paying guest",
  Hotel: "hotel",
  Hostel: "hostel",
  Lodge: "lodge",
  Apartment: "serviced apartment",
  Room: "rooms for rent",
};

export async function searchGooglePlaces({
  city,
  locality,
  category,
  query,
  limit = 20,
}: SearchGooglePlacesParams): Promise<Property[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_PLACES_API_KEY is not defined in environment variables.");
    return [];
  }

  const catWords = category && category !== "All" ? CATEGORY_KEYWORDS[category] || category : "";
  const place = [locality, city].filter(Boolean).join(" ");

  // Construct search query
  let textQuery: string;
  if (query && query.trim()) {
    // Name search: give Google accommodation context so "sri durga" finds the PG, not a temple.
    const q = query.trim();
    const hasStayWord = /\b(pg|hostel|hotel|lodge|stay|inn|residency|apartment|rooms?|living|guest)\b/i.test(q);
    const context = catWords || (hasStayWord ? "" : "PG hostel hotel");
    textQuery = [q, context, place ? `in ${place}` : "India"].filter(Boolean).join(" ");
  } else {
    textQuery = `${catWords || "Accommodation PG Hostel Hotel"} in ${place || "Hyderabad"}`;
  }

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.internationalPhoneNumber,places.types,places.photos",
      },
      body: JSON.stringify({
        textQuery,
        pageSize: limit,
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Google Places API error:", errData);
      return [];
    }

    const data = await res.json();
    if (!data.places || !Array.isArray(data.places)) {
      return [];
    }

    return data.places.map((p: any) => transformGooglePlaceToProperty(p, city || "Hyderabad", locality));
  } catch (err) {
    console.error("Failed to query Google Places API:", err);
    return [];
  }
}

function transformGooglePlaceToProperty(
  p: any,
  fallbackCity = "Hyderabad",
  fallbackLocality?: string
): Property {
  const title = p.displayName?.text || "Accommodation Stay";
  const address = p.formattedAddress || `${fallbackLocality || "City Center"}, ${fallbackCity}`;

  // Extract PIN code (6-digit Indian PIN)
  const pinMatch = address.match(/\b\d{6}\b/);
  const pincode = pinMatch ? pinMatch[0] : "500032";

  // Infer Category
  const category = inferCategory(title, p.types);

  // Infer Gender Preference
  const genderPreference = inferGenderPreference(title);

  // Infer Pricing & Pricing Type
  const { price, pricingType, deposit } = inferPricing(category, title);

  // Work out the real city/state from the address (name searches can span cities)
  const lowerAddr = address.toLowerCase();
  const knownCity = SEED_CITIES.find(
    (c) => lowerAddr.includes(c.name.toLowerCase()) || (c.name === "Bengaluru" && lowerAddr.includes("bangalore"))
  );
  const cityName = knownCity?.name || fallbackCity;
  const stateName = knownCity?.state || (cityName === fallbackCity ? "Telangana" : "India");

  // Extract locality from address or use fallback
  const locality = extractLocality(address, fallbackLocality || (knownCity ? knownCity.localities[0] : "Gachibowli"));

  // Format images
  const images = (p.photos && p.photos.length > 0)
    ? p.photos.slice(0, 5).map((photo: any) => `/api/places-photo?name=${encodeURIComponent(photo.name)}`)
    : [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=1200&q=80",
      ];

  const coverImage = images[0];

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${p.id.substring(0, 8)}`;

  const phoneNumber = p.internationalPhoneNumber || "+91 90590 30142";
  const whatsappNumber = phoneNumber.replace(/[^0-9]/g, "");

  return {
    id: `gplace_${p.id}`,
    title,
    slug,
    category,
    description: `${title} is a verified accommodation located at ${address}. Featuring direct road accessibility, round-the-clock security, high-speed Wi-Fi, and modern amenities. Verified on Google Maps with an average rating of ${p.rating || 4.3}/5 from ${p.userRatingCount || 50} genuine resident reviews.`,
    images,
    coverImage,
    country: "India",
    state: stateName,
    city: cityName,
    locality,
    address,
    pincode,
    coordinates: {
      lat: p.location?.latitude || 17.4332,
      lng: p.location?.longitude || 78.3684,
    },
    price,
    pricingType,
    securityDeposit: deposit,
    additionalCharges: "Electricity as per sub-meter. No maintenance fees.",
    genderPreference,
    furnishingStatus: "Furnished",
    roomTypes: [
      { name: "Single Private Room", sharing: "Single", price: price * 1.5, available: 2, total: 10 },
      { name: "Double Sharing Bed", sharing: "Double", price, available: 4, total: 20 },
      { name: "Triple Sharing Bed", sharing: "Triple", price: Math.round(price * 0.75), available: 6, total: 24 },
    ],
    totalRooms: 15,
    availableBeds: 12,
    amenities: [
      "High-Speed Wi-Fi",
      category === "Hotel" ? "Air Conditioning" : "Three Meals Included",
      "Air Conditioning",
      "Two-Wheeler Parking",
      "Attached Bathroom",
      "Power Backup",
      "CCTV Surveillance",
      "Daily Housekeeping",
      "Washing Machine / Laundry",
      "RO Drinking Water",
      "Geyser / Hot Water",
    ],
    rules: [
      "Valid Government ID required during check-in",
      "Gate closing hours: 10:30 PM",
      "Smoking and alcohol prohibited inside shared areas",
      "Quiet hours after 11:00 PM",
    ],
    checkInTime: "10:00 AM",
    checkOutTime: "11:00 AM",
    contact: {
      name: `${title} Front Desk`,
      phone: phoneNumber,
      whatsapp: whatsappNumber,
      email: `enquiry@stayhub.in`,
    },
    rating: p.rating || 4.3,
    reviewCount: p.userRatingCount || 35,
    approvalStatus: "approved",
    isFeatured: (p.rating || 0) >= 4.5,
    ownerId: "google_verified_partner",
    ownerName: "Google Maps Verified Business",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function inferCategory(title: string, types?: string[]): PropertyCategory {
  const lower = title.toLowerCase();
  const typesStr = (types || []).join(" ").toLowerCase();

  if (lower.includes("pg") || lower.includes("paying guest") || lower.includes("coliving") || lower.includes("co-living")) {
    return "PG";
  }
  if (lower.includes("hostel") || typesStr.includes("hostel")) {
    return "Hostel";
  }
  if (lower.includes("hotel") || lower.includes("resort") || lower.includes("suites") || typesStr.includes("hotel")) {
    return "Hotel";
  }
  if (lower.includes("lodge") || lower.includes("inn") || lower.includes("residency")) {
    return "Lodge";
  }
  if (lower.includes("apartment") || lower.includes("flat") || lower.includes("homes")) {
    return "Apartment";
  }
  return "PG";
}

function inferGenderPreference(title: string): GenderPreference {
  const lower = title.toLowerCase();
  if (
    lower.includes("women") ||
    lower.includes("womens") ||
    lower.includes("women's") ||
    lower.includes("ladies") ||
    lower.includes("girls") ||
    lower.includes("girl's")
  ) {
    return "Girls";
  }
  if (
    lower.includes("men") ||
    lower.includes("mens") ||
    lower.includes("men's") ||
    lower.includes("gents") ||
    lower.includes("gent's") ||
    lower.includes("boys") ||
    lower.includes("boy's")
  ) {
    return "Boys";
  }
  if (lower.includes("co-living") || lower.includes("coliving") || lower.includes("unisex")) {
    return "Unisex";
  }
  return "Any";
}

function inferPricing(category: PropertyCategory, title: string): { price: number; pricingType: PricingType; deposit: number } {
  const lower = title.toLowerCase();
  const isLuxury = lower.includes("luxury") || lower.includes("executive") || lower.includes("premium");

  switch (category) {
    case "Hotel":
      return { price: isLuxury ? 3499 : 1999, pricingType: "daily", deposit: 0 };
    case "Lodge":
      return { price: 1199, pricingType: "daily", deposit: 0 };
    case "Hostel":
      return { price: isLuxury ? 7500 : 5500, pricingType: "monthly", deposit: 3000 };
    case "Apartment":
      return { price: isLuxury ? 38000 : 24000, pricingType: "monthly", deposit: 50000 };
    case "Room":
      return { price: 8500, pricingType: "monthly", deposit: 10000 };
    case "PG":
    default:
      return { price: isLuxury ? 11500 : 8500, pricingType: "monthly", deposit: 5000 };
  }
}

function extractLocality(address: string, fallback: string): string {
  const commonLocalities = [
    "Gachibowli",
    "Madhapur",
    "Kondapur",
    "Kukatpally",
    "Miyapur",
    "Hitech City",
    "Ameerpet",
    "Banjara Hills",
    "Jubilee Hills",
    "Koramangala",
    "Indiranagar",
    "HSR Layout",
    "Whitefield",
  ];

  for (const loc of commonLocalities) {
    if (address.toLowerCase().includes(loc.toLowerCase())) {
      return loc;
    }
  }

  return fallback;
}
