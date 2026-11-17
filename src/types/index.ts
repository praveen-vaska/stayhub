export type UserRole = "user" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export type PropertyCategory = "PG" | "Hotel" | "Lodge" | "Hostel" | "Apartment" | "Room";

export type GenderPreference = "Boys" | "Girls" | "Unisex" | "Family" | "Any";

export type FurnishingStatus = "Furnished" | "Semi-Furnished" | "Unfurnished";

export type PricingType = "monthly" | "daily" | "yearly";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface RoomTypeOption {
  name: string;
  sharing: "Single" | "Double" | "Triple" | "Four+" | "Private Suite";
  price: number;
  available: number;
  total: number;
}

export interface PropertyContact {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  category: PropertyCategory;
  description: string;
  images: string[];
  coverImage: string;
  country: string;
  state: string;
  city: string;
  locality: string;
  address: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  price: number; // starting price
  pricingType: PricingType;
  securityDeposit?: number;
  additionalCharges?: string;
  genderPreference: GenderPreference;
  furnishingStatus: FurnishingStatus;
  roomTypes: RoomTypeOption[];
  totalRooms: number;
  availableBeds: number;
  amenities: string[];
  rules: string[];
  checkInTime?: string;
  checkOutTime?: string;
  contact: PropertyContact;
  rating: number;
  reviewCount: number;
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  isFeatured?: boolean;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = "New" | "Contacted" | "Visit Scheduled" | "Converted" | "Closed";

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage?: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  preferredVisitDate?: string;
  status: EnquiryStatus;
  ownerId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedStay: boolean;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
  property?: Property;
}

export interface CityData {
  name: string;
  state: string;
  country: string;
  localities: string[];
  lat: number;
  lng: number;
  popular?: boolean;
  image?: string;
}
