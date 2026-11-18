"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCompare } from "@/lib/compare/context";
import { formatPrice } from "@/lib/utils/formatters";
<<<<<<< HEAD
import { getAccommodationFallback } from "@/lib/utils/fallbackImages";
=======
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
import EnquiryModal from "@/components/property/EnquiryModal";
import { Property } from "@/types";
import {
  Sparkles,
  X,
  Star,
  MapPin,
  Check,
  Minus,
  MessageCircle,
  ExternalLink,
  Building,
  ArrowLeft,
  Trash2,
} from "lucide-react";

const COMMON_AMENITIES = [
  "High-Speed Wi-Fi",
  "Three Meals Included",
  "Air Conditioning",
  "Two-Wheeler Parking",
  "Four-Wheeler Parking",
  "Attached Bathroom",
  "Power Backup",
  "CCTV Surveillance",
  "Daily Housekeeping",
  "Washing Machine / Laundry",
  "RO Drinking Water",
  "Elevator / Lift",
  "Geyser / Hot Water",
  "Biometric Security",
];

export default function ComparePage() {
  const { compareProperties, removeFromCompare, clearCompare } = useCompare();
  const [enquiryProperty, setEnquiryProperty] = useState<Property | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E7EDF3] shadow-soft">
          <div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#159A91] hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Search Results
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] tracking-tight">
              Compare Accommodations
            </h1>
            <p className="text-xs sm:text-sm text-[#667A91] mt-1">
              Side-by-side facility, pricing, and sharing comparison across your shortlisted stays.
            </p>
          </div>

          {compareProperties.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#142D4E] bg-[#E8F5F4] px-3 py-1.5 rounded-xl border border-[#159A91]/20">
                {compareProperties.length} of 4 Stays Selected
              </span>
              <button
                onClick={clearCompare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#E7EDF3] text-xs font-bold text-[#667A91] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {compareProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#E7EDF3] shadow-soft space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F8FA] border border-[#E7EDF3] text-[#667A91] flex items-center justify-center mx-auto">
              <Building className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#142D4E]">No Stays Added to Compare Yet</h2>
            <p className="text-sm text-[#667A91] max-w-md mx-auto">
              Browse PGs, hotels, hostels, and rooms across your preferred city, and click &quot;Compare&quot; on any card to compare them here side-by-side.
            </p>
            <div className="pt-2">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#142D4E] text-white text-xs font-bold hover:bg-[#159A91] transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#159A91]" />
                Explore Accommodations
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7EDF3] shadow-soft overflow-x-auto">
            <div className="min-w-[720px]">
              {/* Properties Grid Header Cards */}
              <div
                className="grid gap-4 items-start border-b border-[#E7EDF3] pb-6"
                style={{
                  gridTemplateColumns: `200px repeat(${compareProperties.length}, minmax(230px, 1fr))`,
                }}
              >
                <div className="font-bold text-xs uppercase tracking-wider text-[#667A91] pt-3">
                  Property Overview
                </div>

                {compareProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E7EDF3] space-y-3 relative flex flex-col justify-between"
                  >
                    <button
                      onClick={() => removeFromCompare(prop.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-slate-500 hover:text-rose-600 shadow-sm flex items-center justify-center transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-2">
                      <div className="aspect-[16/10] rounded-xl overflow-hidden bg-white border border-[#E7EDF3]">
                        <img
<<<<<<< HEAD
                          src={prop.coverImage || prop.images[0] || getAccommodationFallback(prop.category, prop.id)}
                          alt={prop.title}
                          onError={(e) => {
                            const fallback = getAccommodationFallback(prop.category, prop.id);
                            if (e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback;
                            }
                          }}
=======
                          src={prop.coverImage || prop.images[0]}
                          alt={prop.title}
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#142D4E] text-white">
                          {prop.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E8F5F4] text-[#159A91]">
                          {prop.genderPreference}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-[#142D4E] line-clamp-1" title={prop.title}>
                        {prop.title}
                      </h4>

                      <div className="flex items-center gap-1 text-xs text-[#667A91]">
                        <MapPin className="w-3.5 h-3.5 text-[#159A91] shrink-0" />
                        <span className="truncate">{prop.locality}, {prop.city}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-[#FEF7EE] px-2 py-1 rounded-md border border-[#E9A23B]/30 w-fit">
                        <Star className="w-3.5 h-3.5 fill-[#E9A23B] text-[#E9A23B]" />
                        <span className="text-xs font-bold text-[#142D4E]">{prop.rating}</span>
                        <span className="text-[10px] text-[#667A91]">({prop.reviewCount})</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E7EDF3] space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-[#667A91]">Price</span>
                        <span className="text-base font-extrabold text-[#142D4E]">
                          {formatPrice(prop.price, prop.pricingType)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <Link
                          href={`/property/${prop.slug}`}
                          className="py-1.5 px-2 rounded-lg bg-white border border-[#E7EDF3] text-center text-xs font-bold text-[#142D4E] hover:bg-[#E7EDF3] transition-colors flex items-center justify-center gap-1"
                        >
                          Details
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => {
                            setEnquiryProperty(prop);
                            setIsEnquiryOpen(true);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#159A91] text-center text-xs font-bold text-white hover:bg-[#118079] transition-colors flex items-center justify-center gap-1"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Details */}
              <div className="py-5 border-b border-[#E7EDF3]">
                <h3 className="font-extrabold text-sm text-[#142D4E] uppercase tracking-wider mb-3">
                  1. Pricing & Deposits
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div
                    className="grid gap-4 py-2.5 bg-[#F7F8FA] rounded-xl px-3 font-medium"
                    style={{
                      gridTemplateColumns: `200px repeat(${compareProperties.length}, minmax(230px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Billing Cycle</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="font-bold text-[#142D4E] capitalize">
                        Per {p.pricingType}
                      </span>
                    ))}
                  </div>

                  <div
                    className="grid gap-4 py-2.5 px-3 font-medium"
                    style={{
                      gridTemplateColumns: `200px repeat(${compareProperties.length}, minmax(230px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Security Deposit</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="font-bold text-[#142D4E]">
                        {p.securityDeposit ? `₹${p.securityDeposit.toLocaleString("en-IN")}` : "None / Nil"}
                      </span>
                    ))}
                  </div>

                  <div
                    className="grid gap-4 py-2.5 bg-[#F7F8FA] rounded-xl px-3 font-medium"
                    style={{
                      gridTemplateColumns: `200px repeat(${compareProperties.length}, minmax(230px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Additional Charges</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="text-[#374A60]">
                        {p.additionalCharges || "No hidden maintenance fees"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Room Sharing & Furnishing */}
              <div className="py-5 border-b border-[#E7EDF3]">
                <h3 className="font-extrabold text-sm text-[#142D4E] uppercase tracking-wider mb-3">
                  2. Room Sharing & Space
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div
                    className="grid gap-4 py-2.5 bg-[#F7F8FA] rounded-xl px-3 font-medium"
                    style={{
                      gridTemplateColumns: `200px repeat(${compareProperties.length}, minmax(230px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Furnishing State</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="font-bold text-[#142D4E]">
                        {p.furnishingStatus}
                      </span>
                    ))}
                  </div>

                  <div
                    className="grid gap-4 py-2.5 px-3 font-medium"
                    style={{
                      gridTemplateColumns: `200px repeat(${compareProperties.length}, minmax(230px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Available Beds</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="font-bold text-[#159A91]">
                        {p.availableBeds} beds available
                      </span>
                    ))}
                  </div>

                  <div
                    className="grid gap-4 py-2.5 bg-[#F7F8FA] rounded-xl px-3 font-medium"
                    style={{
                      gridTemplateColumns: `200px repeat(${compareProperties.length}, minmax(230px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Sharing Options</span>
                    {compareProperties.map((p) => (
                      <div key={p.id} className="flex flex-wrap gap-1.5">
                        {p.roomTypes.map((rt, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-[#E7EDF3] text-[#142D4E]"
                          >
                            {rt.sharing} (₹{rt.price.toLocaleString("en-IN")})
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amenities Matrix */}
              <div className="py-5 border-b border-[#E7EDF3]">
                <h3 className="font-extrabold text-sm text-[#142D4E] uppercase tracking-wider mb-3">
                  3. Key Facilities & Amenities
                </h3>
                <div className="space-y-1 text-xs sm:text-sm">
                  {COMMON_AMENITIES.map((amenity, idx) => (
                    <div
                      key={amenity}
                      className={`grid gap-4 py-2.5 px-3 items-center font-medium rounded-lg ${
                        idx % 2 === 0 ? "bg-[#F7F8FA]" : "bg-white"
                      }`}
                      style={{
                        gridTemplateColumns: `200px repeat(${compareProperties.length}, minmax(230px, 1fr))`,
                      }}
                    >
                      <span className="text-[#374A60] font-semibold truncate" title={amenity}>
                        {amenity}
                      </span>

                      {compareProperties.map((p) => {
                        const hasAmenity = p.amenities.some((a) =>
                          a.toLowerCase().includes(amenity.toLowerCase()) ||
                          amenity.toLowerCase().includes(a.toLowerCase())
                        );

                        return (
                          <div key={p.id} className="flex items-center gap-1.5">
                            {hasAmenity ? (
                              <div className="flex items-center gap-1 text-[#159A91] font-bold text-xs">
                                <div className="w-5 h-5 rounded-full bg-[#E8F5F4] flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                                <span>Included</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-slate-400 text-xs">
                                <Minus className="w-4 h-4" />
                                <span>No</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules & Check-in */}
              <div className="py-5">
                <h3 className="font-extrabold text-sm text-[#142D4E] uppercase tracking-wider mb-3">
                  4. House Rules & Timings
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div
                    className="grid gap-4 py-2.5 bg-[#F7F8FA] rounded-xl px-3 font-medium"
                    style={{
                      gridTemplateColumns: `200px repeat(${compareProperties.length}, minmax(230px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Timings</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="text-[#374A60]">
                        {p.checkInTime || "Flexible"} {p.checkOutTime ? `to ${p.checkOutTime}` : ""}
                      </span>
                    ))}
                  </div>

                  <div
                    className="grid gap-4 py-2.5 px-3 font-medium"
                    style={{
                      gridTemplateColumns: `200px repeat(${compareProperties.length}, minmax(230px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Key Guidelines</span>
                    {compareProperties.map((p) => (
                      <ul key={p.id} className="space-y-1 list-disc list-inside text-xs text-[#374A60]">
                        {p.rules.slice(0, 3).map((r, i) => (
                          <li key={i} className="truncate">{r}</li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        property={enquiryProperty}
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </div>
  );
}
