import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  slug: string;
  category: "PG" | "Hotel" | "Lodge" | "Hostel" | "Apartment" | "Room";
  description: string;
  images: string[];
  coverImage: string;
  country: string;
  state: string;
  city: string;
  locality: string;
  address: string;
  pincode: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat] for GeoJSON
  };
  price: number;
  pricingType: "monthly" | "daily" | "yearly";
  securityDeposit: number;
  additionalCharges?: string;
  genderPreference: "Boys" | "Girls" | "Unisex" | "Family" | "Any";
  furnishingStatus: "Furnished" | "Semi-Furnished" | "Unfurnished";
  roomTypes: Array<{
    name: string;
    sharing: string;
    price: number;
    available: number;
    total: number;
  }>;
  totalRooms: number;
  availableBeds: number;
  amenities: string[];
  rules: string[];
  checkInTime?: string;
  checkOutTime?: string;
  contact: {
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  rating: number;
  reviewCount: number;
  approvalStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  isFeatured: boolean;
  ownerId: string;
  ownerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ["PG", "Hotel", "Lodge", "Hostel", "Apartment", "Room"],
      index: true,
    },
    description: { type: String, required: true },
    images: [{ type: String }],
    coverImage: { type: String, required: true },
    country: { type: String, default: "India" },
    state: { type: String, required: true },
    city: { type: String, required: true, index: true },
    locality: { type: String, required: true, index: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    price: { type: Number, required: true, index: true },
    pricingType: {
      type: String,
      enum: ["monthly", "daily", "yearly"],
      default: "monthly",
    },
    securityDeposit: { type: Number, default: 0 },
    additionalCharges: { type: String },
    genderPreference: {
      type: String,
      enum: ["Boys", "Girls", "Unisex", "Family", "Any"],
      default: "Any",
    },
    furnishingStatus: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
      default: "Furnished",
    },
    roomTypes: [
      {
        name: String,
        sharing: String,
        price: Number,
        available: Number,
        total: Number,
      },
    ],
    totalRooms: { type: Number, default: 1 },
    availableBeds: { type: Number, default: 1 },
    amenities: [{ type: String }],
    rules: [{ type: String }],
    checkInTime: String,
    checkOutTime: String,
    contact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      whatsapp: { type: String },
      email: { type: String },
    },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    rejectionReason: String,
    isFeatured: { type: Boolean, default: false },
    ownerId: { type: String, required: true, index: true },
    ownerName: String,
  },
  { timestamps: true }
);

// Geospatial index for 2dsphere location searches
PropertySchema.index({ location: "2dsphere" });
PropertySchema.index({ city: 1, locality: 1, category: 1, price: 1 });

export default mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema);
