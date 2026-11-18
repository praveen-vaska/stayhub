"use client";

import React from "react";
import Link from "next/link";
import { Property } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
<<<<<<< HEAD
import { getAccommodationFallback } from "@/lib/utils/fallbackImages";
=======
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
import { useCompare } from "@/lib/compare/context";
import {
  X,
  Star,
  MapPin,
  Check,
  Minus,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Building,
  Sparkles,
} from "lucide-react";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry?: (property: Property) => void;
}

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

export default function CompareModal({ isOpen, onClose, onOpenEnquiry }: CompareModalProps) {
  const { compareProperties, removeFromCompare, clearCompare } = useCompare();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#142D4E]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-card w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-[#E7EDF3]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-[#142D4E] text-white border-b border-[#1C3C66]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#159A91] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Compare Accommodations
              </h2>
              <p className="text-xs text-slate-300">
                Side-by-side comparison of prices, facilities, and rules ({compareProperties.length}/4 selected)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareProperties.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs font-semibold text-slate-300 hover:text-white underline hidden sm:inline-block"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {compareProperties.length === 0 ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F8FA] border border-[#E7EDF3] text-[#667A91] flex items-center justify-center mx-auto">
              <Building className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#142D4E]">No Stays Selected for Comparison</h3>
            <p className="text-sm text-[#667A91] max-w-md mx-auto">
              Select up to 4 PGs, hotels, hostels, or apartments from search results by clicking the &quot;Compare&quot; button on their cards.
            </p>
            <Link
              href="/search"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#159A91] text-white text-xs font-bold hover:bg-[#118079] transition-colors"
            >
              Browse Available Accommodations
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
            <div className="min-w-[680px]">
              {/* Properties Grid Cards */}
              <div
                className="grid gap-4 items-start border-b border-[#E7EDF3] pb-6"
                style={{
                  gridTemplateColumns: `180px repeat(${compareProperties.length}, minmax(220px, 1fr))`,
                }}
              >
                <div className="font-bold text-xs uppercase tracking-wider text-[#667A91] pt-3">
                  Stay Summary
                </div>

                {compareProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E7EDF3] space-y-3 relative flex flex-col justify-between"
                  >
                    <button
                      onClick={() => removeFromCompare(prop.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-slate-500 hover:text-rose-600 shadow-sm flex items-center justify-center transition-colors"
                      title="Remove from comparison"
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
                        <span className="text-xs text-[#667A91]">Starts at</span>
                        <span className="text-base font-extrabold text-[#142D4E]">
                          {formatPrice(prop.price, prop.pricingType)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <Link
                          href={`/property/${prop.slug}`}
                          onClick={onClose}
                          className="py-1.5 px-2 rounded-lg bg-white border border-[#E7EDF3] text-center text-xs font-bold text-[#142D4E] hover:bg-[#E7EDF3] transition-colors flex items-center justify-center gap-1"
                        >
                          Details
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        {onOpenEnquiry ? (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenEnquiry(prop);
                            }}
                            className="py-1.5 px-2 rounded-lg bg-[#159A91] text-center text-xs font-bold text-white hover:bg-[#118079] transition-colors"
                          >
                            Enquire
                          </button>
                        ) : (
                          <a
                            href={`https://wa.me/${prop.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-2 rounded-lg bg-[#159A91] text-center text-xs font-bold text-white hover:bg-[#118079] transition-colors flex items-center justify-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Chat
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing & Commercials Comparison Row */}
              <div className="py-4 border-b border-[#E7EDF3]">
                <h3 className="font-extrabold text-sm text-[#142D4E] uppercase tracking-wider mb-3">
                  1. Pricing & Deposits
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div
                    className="grid gap-4 py-2 bg-[#F7F8FA] rounded-xl px-3 font-medium"
                    style={{
                      gridTemplateColumns: `180px repeat(${compareProperties.length}, minmax(220px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Pricing Type</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="font-bold text-[#142D4E] capitalize">
                        Per {p.pricingType === "monthly" ? "Month" : p.pricingType === "daily" ? "Night" : "Year"}
                      </span>
                    ))}
                  </div>

                  <div
                    className="grid gap-4 py-2 px-3 font-medium"
                    style={{
                      gridTemplateColumns: `180px repeat(${compareProperties.length}, minmax(220px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Security Deposit</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="font-bold text-[#142D4E]">
                        {p.securityDeposit ? `₹${p.securityDeposit.toLocaleString("en-IN")}` : "None / Included"}
                      </span>
                    ))}
                  </div>

                  <div
                    className="grid gap-4 py-2 bg-[#F7F8FA] rounded-xl px-3 font-medium"
                    style={{
                      gridTemplateColumns: `180px repeat(${compareProperties.length}, minmax(220px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Extra Charges</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="text-[#374A60]">
                        {p.additionalCharges || "No hidden fees"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Room Specifications & Capacities */}
              <div className="py-4 border-b border-[#E7EDF3]">
                <h3 className="font-extrabold text-sm text-[#142D4E] uppercase tracking-wider mb-3">
                  2. Room & Occupancy
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div
                    className="grid gap-4 py-2 bg-[#F7F8FA] rounded-xl px-3 font-medium"
                    style={{
                      gridTemplateColumns: `180px repeat(${compareProperties.length}, minmax(220px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Furnishing</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="font-bold text-[#142D4E]">
                        {p.furnishingStatus}
                      </span>
                    ))}
                  </div>

                  <div
                    className="grid gap-4 py-2 px-3 font-medium"
                    style={{
                      gridTemplateColumns: `180px repeat(${compareProperties.length}, minmax(220px, 1fr))`,
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
                    className="grid gap-4 py-2 bg-[#F7F8FA] rounded-xl px-3 font-medium"
                    style={{
                      gridTemplateColumns: `180px repeat(${compareProperties.length}, minmax(220px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Sharing Options</span>
                    {compareProperties.map((p) => (
                      <div key={p.id} className="flex flex-wrap gap-1">
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

              {/* Comprehensive Facilities Matrix */}
              <div className="py-4 border-b border-[#E7EDF3]">
                <h3 className="font-extrabold text-sm text-[#142D4E] uppercase tracking-wider mb-3">
                  3. Key Amenities & Facilities Matrix
                </h3>
                <div className="space-y-1 text-xs sm:text-sm">
                  {COMMON_AMENITIES.map((amenity, idx) => (
                    <div
                      key={amenity}
                      className={`grid gap-4 py-2 px-3 items-center font-medium rounded-lg ${
                        idx % 2 === 0 ? "bg-[#F7F8FA]" : "bg-white"
                      }`}
                      style={{
                        gridTemplateColumns: `180px repeat(${compareProperties.length}, minmax(220px, 1fr))`,
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
                                <span>Not Available</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules & Check-in Timings */}
              <div className="py-4">
                <h3 className="font-extrabold text-sm text-[#142D4E] uppercase tracking-wider mb-3">
                  4. House Rules & Timings
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div
                    className="grid gap-4 py-2 bg-[#F7F8FA] rounded-xl px-3 font-medium"
                    style={{
                      gridTemplateColumns: `180px repeat(${compareProperties.length}, minmax(220px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">Check-in / Gate</span>
                    {compareProperties.map((p) => (
                      <span key={p.id} className="text-[#374A60]">
                        {p.checkInTime || "Flexible"} {p.checkOutTime ? `to ${p.checkOutTime}` : ""}
                      </span>
                    ))}
                  </div>

                  <div
                    className="grid gap-4 py-2 px-3 font-medium"
                    style={{
                      gridTemplateColumns: `180px repeat(${compareProperties.length}, minmax(220px, 1fr))`,
                    }}
                  >
                    <span className="text-[#667A91] font-bold">House Rules</span>
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

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#F7F8FA] border-t border-[#E7EDF3] flex items-center justify-between">
          <p className="text-xs text-[#667A91]">
            Tip: You can add up to 4 stays to compare side-by-side.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#142D4E] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
