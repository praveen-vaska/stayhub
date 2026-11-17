import {
  Property,
  CityData,
  User,
  Enquiry,
  Review,
  WishlistItem,
  PropertyCategory,
  GenderPreference,
  FurnishingStatus,
} from "@/types";
import { SEED_CITIES, SEED_PROPERTIES, SEED_USERS } from "./seedData";
import { calculateDistance, slugify } from "../utils/formatters";

// Memory storage structure with global caching for hot reloads in Next.js
interface StoreData {
  properties: Property[];
  cities: CityData[];
  users: User[];
  enquiries: Enquiry[];
  reviews: Review[];
  wishlists: WishlistItem[];
}

declare global {
  // eslint-disable-next-line no-var
  var __appStore: StoreData | undefined;
}

function initializeStore(): StoreData {
  if (global.__appStore) {
    return global.__appStore;
  }

  const initialEnquiries: Enquiry[] = [
    {
      id: "enq_demo_1",
      propertyId: "prop_1",
      propertyTitle: "Zolo CyberSpace Luxury PG for Men & Women",
      propertyLocation: "Gachibowli, Hyderabad",
      propertyImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80",
      userId: "usr_demo_1",
      userName: "Praveen Sharma",
      userEmail: "user@stayhub.com",
      userPhone: "+91 98765 43210",
      message: "Hi, I am looking for a Double Sharing AC room starting from 1st of next month. Is food included in the rent?",
      preferredVisitDate: "2026-11-20",
      status: "New",
      ownerId: "own_demo_1",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "enq_demo_2",
      propertyId: "prop_2",
      propertyTitle: "Urban Nest Luxury Boutique Hotel & Suites",
      propertyLocation: "Madhapur, Hyderabad",
      propertyImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
      userId: "usr_demo_1",
      userName: "Praveen Sharma",
      userEmail: "user@stayhub.com",
      userPhone: "+91 98765 43210",
      message: "Need 2 Deluxe King Rooms for corporate guests arriving this weekend. Can we get corporate discounts?",
      preferredVisitDate: "2026-11-22",
      status: "Contacted",
      ownerId: "own_demo_1",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];

  const initialReviews: Review[] = [
    {
      id: "rev_1",
      propertyId: "prop_1",
      userId: "usr_rev_1",
      userName: "Rahul Verma",
      rating: 5,
      comment: "Super clean rooms and the food is genuinely homely! The high-speed Wi-Fi is great for WFH and DLF is just a 5 min walk.",
      verifiedStay: true,
      createdAt: "2026-01-20T14:32:00.000Z",
    },
    {
      id: "rev_2",
      propertyId: "prop_1",
      userId: "usr_rev_2",
      userName: "Pooja Hegde",
      rating: 4.5,
      comment: "Very safe for working women with biometric entry and attentive staff. Gym and gaming zone are great bonuses.",
      verifiedStay: true,
      createdAt: "2026-02-02T11:15:00.000Z",
    },
    {
      id: "rev_3",
      propertyId: "prop_2",
      userId: "usr_rev_3",
      userName: "Arjun Rao",
      rating: 5,
      comment: "Incredible boutique hotel right in Madhapur. Room decor is top notch, super comfy bed, and the rooftop cafe is amazing.",
      verifiedStay: true,
      createdAt: "2026-02-08T09:40:00.000Z",
    },
  ];

  const initialWishlists: WishlistItem[] = [
    {
      id: "wish_1",
      userId: "usr_demo_1",
      propertyId: "prop_1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "wish_2",
      userId: "usr_demo_1",
      propertyId: "prop_4",
      createdAt: new Date().toISOString(),
    },
  ];

  let googlePlaces: Property[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    googlePlaces = require("./googlePlacesData.json");
  } catch (e) {
    console.warn("No googlePlacesData.json file found, continuing with seed properties only.");
  }

  const store: StoreData = {
    properties: [...SEED_PROPERTIES, ...googlePlaces],
    cities: [...SEED_CITIES],
    users: [...SEED_USERS],
    enquiries: initialEnquiries,
    reviews: initialReviews,
    wishlists: initialWishlists,
  };

  global.__appStore = store;
  return store;
}

const store = initializeStore();

export interface PropertyFilterParams {
  city?: string;
  locality?: string;
  category?: PropertyCategory | "All" | string;
  minPrice?: number;
  maxPrice?: number;
  genderPreference?: GenderPreference | "Any" | string;
  furnishingStatus?: FurnishingStatus | string;
  amenities?: string[];
  sharingType?: string;
  rating?: number;
  availableNow?: boolean;
  searchQuery?: string;
  sort?: "recommended" | "price_asc" | "price_desc" | "rating_desc" | "newest";
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
  includeAllStatus?: boolean; // For admin/owner
  ownerId?: string;
  /** Property ids that should survive the text-search filter regardless of wording. */
  includeIds?: string[];
}

/** Lowercase, strip punctuation, and unify common spelling variants (sree→sri, paying guest→pg). */
function normalizeText(s: string) {
  return s
    .toLowerCase()
    .replace(/paying\s+guest/g, "pg")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(sree|shri|shree)\b/g, "sri")
    .replace(/\s+/g, " ")
    .trim();
}

export const db = {
  // Properties
  getProperties(params: PropertyFilterParams = {}) {
    let list = [...store.properties];

    // Filter by approval status unless specifically requesting all/owner's
    if (!params.includeAllStatus) {
      list = list.filter((p) => p.approvalStatus === "approved");
    }

    if (params.ownerId) {
      list = list.filter((p) => p.ownerId === params.ownerId);
    }

    // City filter
    if (params.city && params.city !== "All") {
      const cityClean = params.city.toLowerCase().trim();
      list = list.filter((p) => p.city.toLowerCase() === cityClean);
    }

    // Locality filter
    if (params.locality && params.locality !== "All") {
      const locClean = params.locality.toLowerCase().trim();
      list = list.filter((p) => p.locality.toLowerCase() === locClean);
    }

    // Category filter
    if (params.category && params.category !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    // Free text search (name, locality, city, address, category).
    // Every word must appear somewhere, so "durga pg" matches "Sri Durga Ladies PG".
    // Ids in `includeIds` (e.g. Google Places hits for this query) are always kept.
    // Relevance: 3 = name contains the whole phrase, 2 = name has every word,
    // 1 = words found elsewhere (area/address), 0 = kept only because Google matched it.
    const relevance = new Map<string, number>();
    if (params.searchQuery) {
      const phrase = normalizeText(params.searchQuery);
      const tokens = phrase.split(" ").filter(Boolean);
      const keep = new Set(params.includeIds || []);
      if (tokens.length > 0) {
        list = list.filter((p) => {
          const title = normalizeText(p.title);
          const haystack = normalizeText(`${p.title} ${p.locality} ${p.city} ${p.address} ${p.category}`);
          const score = title.includes(phrase)
            ? 3
            : tokens.every((t) => title.includes(t))
              ? 2
              : tokens.every((t) => haystack.includes(t))
                ? 1
                : keep.has(p.id)
                  ? 0
                  : -1;
          if (score < 0) return false;
          relevance.set(p.id, score);
          return true;
        });
      }
    }

    // Price range
    if (params.minPrice !== undefined) {
      list = list.filter((p) => p.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= params.maxPrice!);
    }

    // Gender preference
    if (params.genderPreference && params.genderPreference !== "Any") {
      list = list.filter(
        (p) => p.genderPreference === "Unisex" || p.genderPreference === "Any" || p.genderPreference === params.genderPreference
      );
    }

    // Furnishing status
    if (params.furnishingStatus && params.furnishingStatus !== "All") {
      list = list.filter((p) => p.furnishingStatus === params.furnishingStatus);
    }

    // Amenities
    if (params.amenities && params.amenities.length > 0) {
      list = list.filter((p) =>
        params.amenities!.every((a) => p.amenities.some((item) => item.toLowerCase() === a.toLowerCase()))
      );
    }

    // Sharing type
    if (params.sharingType && params.sharingType !== "All") {
      list = list.filter((p) =>
        p.roomTypes.some((r) => r.sharing.toLowerCase() === params.sharingType!.toLowerCase())
      );
    }

    // Minimum rating
    if (params.rating) {
      list = list.filter((p) => p.rating >= params.rating!);
    }

    // Available now (has beds available)
    if (params.availableNow) {
      list = list.filter((p) => p.availableBeds > 0);
    }

    // Geospatial distance filter if lat & lng provided
    if (params.lat && params.lng) {
      const radius = params.radiusKm || 15; // default 15km
      list = list.filter((p) => {
        const d = calculateDistance(params.lat!, params.lng!, p.coordinates.lat, p.coordinates.lng);
        return d <= radius;
      });
    }

    // Sorting
    switch (params.sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "recommended":
      default:
        // Best text match first (when searching), then featured, then highest rating
        list.sort((a, b) => {
          const rel = (relevance.get(b.id) ?? 0) - (relevance.get(a.id) ?? 0);
          if (rel !== 0) return rel;
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    const total = list.length;
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 12);
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      properties: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  getPropertyById(id: string): Property | null {
    return store.properties.find((p) => p.id === id) || null;
  },

  getPropertyBySlug(slug: string): Property | null {
    return store.properties.find((p) => p.slug === slug) || null;
  },

  createProperty(data: Omit<Property, "id" | "slug" | "createdAt" | "updatedAt" | "rating" | "reviewCount" | "approvalStatus">): Property {
    const id = `prop_${Date.now()}`;
    const baseSlug = slugify(data.title);
    const slug = `${baseSlug}-${id.slice(-4)}`;

    const newProperty: Property = {
      ...data,
      id,
      slug,
      rating: 4.5,
      reviewCount: 0,
      approvalStatus: "pending", // Pending approval until admin approves
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.properties.unshift(newProperty);
    return newProperty;
  },

  updateProperty(id: string, updates: Partial<Property>): Property | null {
    const index = store.properties.findIndex((p) => p.id === id);
    if (index === -1) return null;

    store.properties[index] = {
      ...store.properties[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return store.properties[index];
  },

  addGoogleProperties(props: Property[]) {
    for (const p of props) {
      if (!store.properties.some((existing) => existing.id === p.id || existing.slug === p.slug)) {
        store.properties.push(p);
      }
    }
  },

  deleteProperty(id: string): boolean {
    const index = store.properties.findIndex((p) => p.id === id);
    if (index === -1) return false;
    store.properties.splice(index, 1);
    return true;
  },

  approveProperty(id: string): Property | null {
    return this.updateProperty(id, { approvalStatus: "approved", rejectionReason: undefined });
  },

  rejectProperty(id: string, reason: string): Property | null {
    return this.updateProperty(id, { approvalStatus: "rejected", rejectionReason: reason });
  },

  // Locations
  getCities(): CityData[] {
    return store.cities;
  },

  getLocalities(cityName: string): string[] {
    const city = store.cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    return city ? city.localities : [];
  },

  searchLocations(query: string): Array<{ type: "city" | "locality"; name: string; city: string; state: string }> {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: Array<{ type: "city" | "locality"; name: string; city: string; state: string }> = [];

    store.cities.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        results.push({ type: "city", name: c.name, city: c.name, state: c.state });
      }
      c.localities.forEach((loc) => {
        if (loc.toLowerCase().includes(q)) {
          results.push({ type: "locality", name: loc, city: c.name, state: c.state });
        }
      });
    });

    return results.slice(0, 8);
  },

  // Enquiries
  getEnquiries(filter: { userId?: string; ownerId?: string; propertyId?: string }): Enquiry[] {
    let list = [...store.enquiries];
    if (filter.userId) {
      list = list.filter((e) => e.userId === filter.userId);
    }
    if (filter.ownerId) {
      list = list.filter((e) => e.ownerId === filter.ownerId);
    }
    if (filter.propertyId) {
      list = list.filter((e) => e.propertyId === filter.propertyId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createEnquiry(data: Omit<Enquiry, "id" | "status" | "createdAt">): Enquiry {
    const newEnquiry: Enquiry = {
      ...data,
      id: `enq_${Date.now()}`,
      status: "New",
      createdAt: new Date().toISOString(),
    };
    store.enquiries.unshift(newEnquiry);
    return newEnquiry;
  },

  updateEnquiryStatus(id: string, status: Enquiry["status"]): Enquiry | null {
    const enquiry = store.enquiries.find((e) => e.id === id);
    if (!enquiry) return null;
    enquiry.status = status;
    return enquiry;
  },

  // Reviews
  getReviews(propertyId: string): Review[] {
    return store.reviews
      .filter((r) => r.propertyId === propertyId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addReview(data: Omit<Review, "id" | "createdAt">): Review {
    const newReview: Review = {
      ...data,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.reviews.unshift(newReview);

    // Update property rating & count
    const propReviews = store.reviews.filter((r) => r.propertyId === data.propertyId);
    const avg = propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
    this.updateProperty(data.propertyId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: propReviews.length,
    });

    return newReview;
  },

  // Wishlist
  getWishlist(userId: string): Property[] {
    const items = store.wishlists.filter((w) => w.userId === userId);
    return items
      .map((w) => store.properties.find((p) => p.id === w.propertyId))
      .filter(Boolean) as Property[];
  },

  toggleWishlist(userId: string, propertyId: string): { saved: boolean } {
    const index = store.wishlists.findIndex((w) => w.userId === userId && w.propertyId === propertyId);
    if (index > -1) {
      store.wishlists.splice(index, 1);
      return { saved: false };
    } else {
      store.wishlists.push({
        id: `wish_${Date.now()}`,
        userId,
        propertyId,
        createdAt: new Date().toISOString(),
      });
      return { saved: true };
    }
  },

  isWishlisted(userId: string, propertyId: string): boolean {
    return store.wishlists.some((w) => w.userId === userId && w.propertyId === propertyId);
  },

  // Users
  getUserByEmail(email: string): User | null {
    return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserById(id: string): User | null {
    return store.users.find((u) => u.id === id) || null;
  },

  createUser(data: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...data,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    return newUser;
  },

  getAllUsers(): User[] {
    return store.users;
  },

  // Stats
  getAdminStats() {
    return {
      totalUsers: store.users.filter((u) => u.role === "user").length,
      totalOwners: store.users.filter((u) => u.role === "owner").length,
      totalProperties: store.properties.length,
      activeProperties: store.properties.filter((p) => p.approvalStatus === "approved").length,
      pendingProperties: store.properties.filter((p) => p.approvalStatus === "pending").length,
      rejectedProperties: store.properties.filter((p) => p.approvalStatus === "rejected").length,
      totalEnquiries: store.enquiries.length,
      totalCities: store.cities.length,
      totalLocalities: store.cities.reduce((sum, c) => sum + c.localities.length, 0),
    };
  },

  getOwnerStats(ownerId: string) {
    const ownerProps = store.properties.filter((p) => p.ownerId === ownerId);
    const propIds = ownerProps.map((p) => p.id);
    const ownerEnquiries = store.enquiries.filter((e) => e.ownerId === ownerId || propIds.includes(e.propertyId));

    return {
      totalProperties: ownerProps.length,
      activeListings: ownerProps.filter((p) => p.approvalStatus === "approved").length,
      pendingApprovals: ownerProps.filter((p) => p.approvalStatus === "pending").length,
      totalEnquiries: ownerEnquiries.length,
      propertyViews: ownerProps.length * 142 + 28,
      recentEnquiries: ownerEnquiries.slice(0, 5),
    };
  },
};
