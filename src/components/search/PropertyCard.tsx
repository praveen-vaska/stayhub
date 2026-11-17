"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Property } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
import { useAuth } from "@/lib/auth/context";
import { useCompare } from "@/lib/compare/context";
import {
  Star,
  MapPin,
  Wifi,
  Utensils,
  Wind,
  Car,
  Heart,
  ChevronRight,
  Phone,
  ArrowRightLeft,
  Check,
} from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onContactClick?: (property: Property) => void;
  priority?: boolean;
}

export default function PropertyCard({ property, onContactClick }: PropertyCardProps) {
  const { isWishlisted, toggleWishlist } = useAuth();
  const { isInCompare, toggleCompare } = useCompare();
  const [saved, setSaved] = useState(isWishlisted(property.id));
  const inCompare = isInCompare(property.id);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = await toggleWishlist(property.id);
    setSaved(newStatus);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "PG":
        return "bg-[#E8F5F4] text-[#159A91] border-[#159A91]/30";
      case "Hotel":
        return "bg-[#F0F4F8] text-[#142D4E] border-[#E7EDF3]";
      case "Hostel":
        return "bg-[#FEF7EE] text-[#E9A23B] border-[#E9A23B]/30";
      case "Apartment":
        return "bg-[#E8F5F4] text-[#159A91] border-[#159A91]/30";
      default:
        return "bg-[#F7F8FA] text-[#667A91] border-[#E7EDF3]";
    }
  };

  const getGenderBadge = (gender: string) => {
    switch (gender) {
      case "Boys":
        return { label: "Men Only", color: "bg-slate-100 text-slate-800" };
      case "Girls":
        return { label: "Women Only", color: "bg-rose-50 text-rose-800" };
      case "Unisex":
        return { label: "Co-living (Unisex)", color: "bg-[#E8F5F4] text-[#159A91]" };
      case "Family":
        return { label: "Family Stays", color: "bg-slate-100 text-slate-800" };
      default:
        return null;
    }
  };

  const genderBadge = getGenderBadge(property.genderPreference);

  return (
    <div className="group h-full bg-white rounded-2xl overflow-hidden border border-[#E7EDF3] shadow-card hover:shadow-card-hover hover:border-[#159A91]/30 transition-all duration-300 ease-out flex flex-col justify-between transform hover:-translate-y-1.5">
      <div>
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#F7F8FA]">
          <img
            src={property.coverImage || property.images[0]}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span
              className={`px-2.5 py-0.5 rounded-md text-xs font-bold border backdrop-blur-md shadow-sm ${getCategoryBadgeClass(
                property.category
              )}`}
            >
              {property.category}
            </span>

            {genderBadge && (
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold backdrop-blur-md shadow-sm ${genderBadge.color}`}>
                {genderBadge.label}
              </span>
            )}

            {property.ownerId === "google_verified_partner" && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#142D4E]/90 text-teal-300 backdrop-blur-md shadow-sm border border-teal-500/30">
                Google Verified
              </span>
            )}
          </div>

          {/* Heart / Wishlist Button */}
          <button
            onClick={handleHeartClick}
            type="button"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-rose-500 hover:scale-105 active:scale-95 transition-all shadow-sm z-10"
            title={saved ? "Remove from wishlist" : "Save property"}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                saved ? "fill-rose-500 text-rose-500 scale-110" : "text-[#142D4E] scale-100"
              }`}
            />
          </button>

          {/* Availability Tag */}
          <div className="absolute bottom-2.5 left-2.5 bg-[#142D4E]/90 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#159A91]" />
            {property.availableBeds > 0 ? `${property.availableBeds} beds available` : "Enquire for availability"}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Rating & Location */}
          <div className="flex items-center justify-between gap-2 text-xs mb-2">
            <div className="flex items-center gap-1 min-w-0 flex-1 text-[#667A91] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#159A91] shrink-0" />
              <span className="truncate" title={`${property.locality}, ${property.city}`}>
                {property.locality}, {property.city}
              </span>
            </div>

            <div
              className="flex items-center gap-1 shrink-0 bg-[#FEF7EE] px-1.5 py-0.5 rounded-md border border-[#E9A23B]/30"
              title={`${property.rating} from ${property.reviewCount} reviews`}
            >
              <Star className="w-3 h-3 fill-[#E9A23B] text-[#E9A23B]" />
              <span className="font-bold text-[#142D4E]">{property.rating}</span>
              <span className="text-[#667A91] font-medium">({property.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/property/${property.slug}`} title={property.title}>
            <h3 className="text-base font-bold leading-snug text-[#142D4E] group-hover:text-[#159A91] transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Amenities Mini-Row — each chip stays on one line, row wraps if narrow */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#667A91] py-2.5 border-y border-[#E7EDF3]">
            {property.amenities.includes("Wi-Fi") && (
              <span className="flex items-center gap-1 whitespace-nowrap" title="High speed Wi-Fi">
                <Wifi className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Wi‑Fi
              </span>
            )}
            {property.amenities.includes("Food") && (
              <span className="flex items-center gap-1 whitespace-nowrap" title="Meals included / available">
                <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Meals
              </span>
            )}
            {property.amenities.includes("AC") && (
              <span className="flex items-center gap-1 whitespace-nowrap" title="Air Conditioned">
                <Wind className="w-3.5 h-3.5 text-slate-400 shrink-0" /> AC
              </span>
            )}
            {property.amenities.includes("Parking") && (
              <span className="flex items-center gap-1 whitespace-nowrap" title="Parking available">
                <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Parking
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Price & Actions */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="flex items-end justify-between gap-2 mb-3">
          <div className="min-w-0">
            <span className="text-[11px] text-[#667A91] block font-medium">Starting from</span>
            <span className="block text-lg sm:text-xl font-bold leading-tight text-[#142D4E] whitespace-nowrap">
              {formatPrice(property.price, property.pricingType)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(property);
            }}
            className={`shrink-0 whitespace-nowrap text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-bold active:scale-95 ${
              inCompare
                ? "bg-[#E8F5F4] text-[#159A91] border-[#159A91]/40 shadow-sm"
                : "bg-[#F7F8FA] text-[#667A91] border-[#E7EDF3] hover:text-[#142D4E] hover:border-[#142D4E]/30"
            }`}
            title={inCompare ? "Remove from comparison" : "Add to comparison"}
          >
            {inCompare ? <Check className="w-3.5 h-3.5" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
            <span>{inCompare ? "Added" : "Compare"}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {onContactClick ? (
            <button
              type="button"
              onClick={() => onContactClick(property)}
              className="flex items-center justify-center gap-1.5 whitespace-nowrap py-2 px-3 rounded-xl border border-[#E7EDF3] text-xs font-bold text-[#142D4E] hover:bg-[#E8F5F4] hover:text-[#159A91] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#159A91]" />
              Contact
            </button>
          ) : (
            <Link
              href={`/property/${property.slug}#contact`}
              className="flex items-center justify-center gap-1.5 whitespace-nowrap py-2 px-3 rounded-xl border border-[#E7EDF3] text-xs font-bold text-[#142D4E] hover:bg-[#E8F5F4] hover:text-[#159A91] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#159A91]" />
              Contact
            </Link>
          )}

          <Link
            href={`/property/${property.slug}`}
            className="flex items-center justify-center gap-1.5 whitespace-nowrap py-2 px-3 rounded-xl bg-[#142D4E] text-white text-xs font-bold hover:bg-[#159A91] transition-colors shadow-sm"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
