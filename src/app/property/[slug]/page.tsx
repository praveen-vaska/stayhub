"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Property, Review } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
import { getAccommodationFallback } from "@/lib/utils/fallbackImages";
import { useAuth } from "@/lib/auth/context";
import EnquiryModal from "@/components/property/EnquiryModal";
import InteractiveMap from "@/components/search/InteractiveMap";
import {
  Star,
  MapPin,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  ShieldCheck,
  Wifi,
  Utensils,
  Wind,
  Car,
  Home,
  Layers,
  ChevronLeft,
  ChevronRight,
  Send,
  Building,
  CheckCircle2,
  Info,
  ExternalLink,
  Maximize2,
  Minimize2,
  Grid,
  Camera,
  X,
  Sparkles,
} from "lucide-react";

export default function PropertyDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { isWishlisted, toggleWishlist } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [galleryView, setGalleryView] = useState<"carousel" | "grid">("carousel");
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/properties/slug/${slug}`);
        const data = await res.json();
        if (data.property) {
          setProperty(data.property);
          const revRes = await fetch(`/api/reviews?propertyId=${data.property.id}`);
          const revData = await revRes.json();
          setReviews(revData.reviews || []);
        }
      } catch (err) {
        console.error("Error loading property:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // Fullscreen Lightbox keyboard controls (Escape to close, Left/Right arrows to flip)
  const allImages = property?.images && property.images.length > 0 ? property.images : (property ? [property.coverImage] : []);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
      if (e.key === "ArrowRight") setActiveImageIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, allImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="w-8 h-8 border-3 border-[#159A91] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F7F8FA]">
        <h2 className="text-xl font-bold text-[#142D4E] mb-2">Property Not Found</h2>
        <p className="text-sm text-[#667A91] mb-6">The accommodation you are looking for does not exist or has been removed.</p>
        <Link href="/search" className="px-5 py-2.5 rounded-xl bg-[#142D4E] text-white text-sm font-bold">
          Explore Available Stays
        </Link>
      </div>
    );
  }

  const saved = isWishlisted(property.id);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          rating: newRating,
          comment: newComment,
        }),
      });
      const data = await res.json();
      if (res.ok && data.review) {
        setReviews([data.review, ...reviews]);
        setNewComment("");
        setProperty((prev) =>
          prev
            ? {
                ...prev,
                reviewCount: prev.reviewCount + 1,
              }
            : null
        );
      }
    } catch (err) {
      console.error("Failed to post review", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi ${property.contact.name}, I am inquiring about "${property.title}" on StayHub.`
  );
  const whatsappUrl = `https://wa.me/${property.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.coordinates.lat},${property.coordinates.lng}`;

  const amenityIconMap: Record<string, any> = {
    "Wi-Fi": Wifi,
    Food: Utensils,
    AC: Wind,
    Parking: Car,
    "Attached Bathroom": Home,
    "Power Backup": Layers,
    Housekeeping: ShieldCheck,
    Laundry: Home,
    CCTV: ShieldCheck,
    Security: ShieldCheck,
    Lift: Building,
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-[#E7EDF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#667A91] font-medium">
              <Link href="/" className="hover:text-[#142D4E]">Home</Link>
              <span>/</span>
              <Link href={`/search?city=${encodeURIComponent(property.city)}`} className="hover:text-[#142D4E]">{property.city}</Link>
              <span>/</span>
              <Link href={`/search?city=${encodeURIComponent(property.city)}&locality=${encodeURIComponent(property.locality)}`} className="hover:text-[#142D4E]">{property.locality}</Link>
              <span>/</span>
              <span className="text-[#142D4E] font-bold truncate max-w-[200px]">{property.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7EDF3] text-[#142D4E] hover:bg-[#F7F8FA] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? "Link Copied!" : "Share"}</span>
              </button>

              <button
                onClick={() => toggleWishlist(property.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                  saved
                    ? "bg-rose-50 border-rose-200 text-rose-600 font-bold"
                    : "border-[#E7EDF3] text-[#142D4E] hover:bg-[#F7F8FA]"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{saved ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Title & Key Highlights Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#142D4E] text-white">
              {property.category}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#E8F5F4] text-[#159A91]">
              {property.genderPreference === "Unisex" ? "Co-Living (Unisex)" : `${property.genderPreference} Only`}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#F7F8FA] text-[#667A91] border border-[#E7EDF3]">
              {property.furnishingStatus}
            </span>
            {property.ownerId === "google_verified_partner" ? (
              <span className="flex items-center gap-1 text-xs font-bold text-[#142D4E] bg-teal-50 px-2.5 py-1 rounded-md border border-[#159A91]/30">
                <ShieldCheck className="w-3.5 h-3.5 text-[#159A91]" /> Google Maps Verified Business
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-[#159A91] bg-[#E8F5F4] px-2.5 py-1 rounded-md border border-[#159A91]/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] tracking-tight">
            {property.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#667A91]">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#159A91] shrink-0" />
              <span>{property.address}, {property.locality}, {property.city} - {property.pincode}</span>
            </div>

            <div className="flex items-center gap-1 bg-[#FEF7EE] px-2.5 py-1 rounded-md border border-[#E9A23B]/30">
              <Star className="w-4 h-4 fill-[#E9A23B] text-[#E9A23B]" />
              <span className="font-bold text-[#142D4E]">{property.rating}</span>
              <span className="text-[#667A91] font-medium">({property.reviewCount} verified reviews)</span>
            </div>
          </div>
        </div>

        {/* Modern Image Gallery & Controls */}
        <div className="space-y-3">
          {/* Gallery Header Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5F4] text-[#159A91] border border-[#159A91]/20 shadow-xs">
                <Camera className="w-3.5 h-3.5" />
                {allImages.length} Verified Photos
              </span>
              <span className="text-xs text-[#667A91] hidden sm:inline">
                • Click any photo to inspect full uncropped view
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Fit / Fill toggle button */}
              <button
                type="button"
                onClick={() => setFitMode((m) => (m === "contain" ? "cover" : "contain"))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7EDF3] bg-white text-xs font-bold text-[#142D4E] hover:border-[#159A91]/50 hover:bg-[#F7F8FA] transition-all shadow-xs active:scale-95"
                title={fitMode === "contain" ? "Switch to Fill Banner" : "Fit Whole Uncropped Photo"}
              >
                {fitMode === "contain" ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#159A91]" />
                    <span>Fit Whole Photo</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-[#E9A23B]" />
                    <span>Fill Banner</span>
                  </>
                )}
              </button>

              {/* Grid / Carousel View Toggle (for 3+ photos) */}
              {allImages.length >= 3 && (
                <button
                  type="button"
                  onClick={() => setGalleryView((v) => (v === "carousel" ? "grid" : "carousel"))}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7EDF3] bg-white text-xs font-bold text-[#142D4E] hover:border-[#159A91]/50 hover:bg-[#F7F8FA] transition-all shadow-xs active:scale-95"
                >
                  <Grid className="w-3.5 h-3.5 text-[#159A91]" />
                  <span>{galleryView === "carousel" ? "Grid View" : "Cinema Stage"}</span>
                </button>
              )}

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7EDF3] bg-white text-xs font-bold text-[#142D4E] hover:border-[#159A91]/50 hover:bg-[#F7F8FA] transition-all shadow-xs active:scale-95"
                title="Fullscreen Lightbox"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#142D4E]" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Carousel / Stage View */}
          {galleryView === "carousel" ? (
            <div className="space-y-3">
              <div className="relative h-[380px] sm:h-[480px] lg:h-[520px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-[#E7EDF3] shadow-card group select-none flex items-center justify-center">
                {/* Dual Layer: Ambient Blurred Background (Matches photo tones with NO harsh letterbox!) */}
                <img
                  src={allImages[activeImageIdx]}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-35 scale-110 pointer-events-none transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />

                {/* Foreground Image: 100% full uncropped image in contain mode */}
                <img
                  src={allImages[activeImageIdx]}
                  alt={property.title}
                  onClick={() => setIsLightboxOpen(true)}
                  onError={(e) => {
                    const fallback = getAccommodationFallback(property.category, `${property.id}-${activeImageIdx}`);
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                  className={`relative z-10 w-full h-full transition-all duration-500 cursor-zoom-in drop-shadow-2xl ${
                    fitMode === "contain"
                      ? "object-contain p-2 sm:p-5 group-hover:scale-[1.01]"
                      : "object-cover group-hover:scale-105"
                  }`}
                />

                {/* Left & Right Chevron Controls */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
                      }}
                      className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#142D4E] shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-slate-200/60"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
                      }}
                      className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#142D4E] shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-slate-200/60"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Bottom Overlay Pills */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  <div className="pointer-events-auto bg-[#142D4E]/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-[#159A91] animate-pulse" />
                    <span className="hidden sm:inline">Click photo for fullscreen view</span>
                    <span className="sm:hidden">Tap to zoom</span>
                  </div>

                  <div className="pointer-events-auto bg-[#142D4E]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 shadow-md">
                    Photo {activeImageIdx + 1} of {allImages.length}
                  </div>
                </div>
              </div>

              {/* Thumbnails Strip with active ring, modern borders & smooth hover */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto py-2.5 px-1 scrollbar-none">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 shadow-xs ${
                        activeImageIdx === idx
                          ? "border-[#159A91] ring-2 ring-[#159A91]/50 ring-offset-2 scale-105 shadow-md"
                          : "border-transparent opacity-65 hover:opacity-100 hover:scale-102"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        onError={(e) => {
                          const fallback = getAccommodationFallback(property.category, `${property.id}-${idx}`);
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Bento Grid View (Airbnb Style 5-photo mosaic) */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[460px] sm:h-[500px] rounded-2xl overflow-hidden border border-[#E7EDF3] bg-white p-2.5 shadow-card">
              {/* Main large item on left */}
              <div
                onClick={() => {
                  setActiveImageIdx(0);
                  setIsLightboxOpen(true);
                }}
                className="md:col-span-2 relative h-full rounded-xl overflow-hidden cursor-pointer group bg-slate-900 border border-slate-200/80 shadow-xs"
              >
                <img
                  src={allImages[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-3 left-3 bg-[#142D4E]/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  Main Photo
                </span>
              </div>

              {/* Right 2x2 grid */}
              <div className="md:col-span-2 grid grid-cols-2 gap-3 h-full">
                {allImages.slice(1, 5).map((img, idx) => (
                  <div
                    key={idx + 1}
                    onClick={() => {
                      setActiveImageIdx(idx + 1);
                      setIsLightboxOpen(true);
                    }}
                    className="relative h-full rounded-xl overflow-hidden cursor-pointer group bg-slate-900 border border-slate-200/80 shadow-xs"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    {idx === 3 && allImages.length > 5 && (
                      <div className="absolute inset-0 bg-[#142D4E]/80 backdrop-blur-sm flex flex-col items-center justify-center text-white font-bold text-sm">
                        <Grid className="w-5 h-5 mb-1 text-[#159A91]" />
                        <span>+{allImages.length - 5} more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Overview / Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDF3] shadow-soft space-y-4">
              <h2 className="text-lg font-bold text-[#142D4E]">About this accommodation</h2>
              <p className="text-sm text-[#374A60] leading-relaxed whitespace-pre-line">
                {property.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E7EDF3] text-xs sm:text-sm">
                <div>
                  <span className="text-[#667A91] block font-medium">Total Capacity</span>
                  <span className="font-bold text-[#142D4E]">{property.totalRooms} Rooms</span>
                </div>
                <div>
                  <span className="text-[#667A91] block font-medium">Current Vacancy</span>
                  <span className="font-bold text-[#159A91]">{property.availableBeds} beds available</span>
                </div>
                <div>
                  <span className="text-[#667A91] block font-medium">Check-In / Out</span>
                  <span className="font-bold text-[#142D4E]">{property.checkInTime || "11:00 AM"} / {property.checkOutTime || "10:00 AM"}</span>
                </div>
              </div>
            </div>

            {/* Room Types & Pricing Table */}
            {property.roomTypes && property.roomTypes.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDF3] shadow-soft space-y-4">
                <h2 className="text-lg font-bold text-[#142D4E]">Available Room & Sharing Types</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-[#E7EDF3] text-[#667A91] uppercase tracking-wider text-[11px]">
                        <th className="pb-3 font-bold">Room Category</th>
                        <th className="pb-3 font-bold">Sharing</th>
                        <th className="pb-3 font-bold">Price</th>
                        <th className="pb-3 font-bold">Availability</th>
                        <th className="pb-3 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7EDF3] font-medium">
                      {property.roomTypes.map((room, idx) => (
                        <tr key={idx} className="hover:bg-[#F7F8FA] transition-colors">
                          <td className="py-3.5 font-bold text-[#142D4E]">{room.name}</td>
                          <td className="py-3.5 text-[#667A91]">{room.sharing} Sharing</td>
                          <td className="py-3.5 font-extrabold text-[#142D4E]">
                            {formatPrice(room.price, property.pricingType)}
                          </td>
                          <td className="py-3.5">
                            {room.available > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[#159A91] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#159A91]" />
                                {room.available} beds left
                              </span>
                            ) : (
                              <span className="text-slate-400">Sold out</span>
                            )}
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => setIsEnquiryModalOpen(true)}
                              className="px-3 py-1.5 rounded-lg bg-[#142D4E] text-white text-xs font-bold hover:bg-[#159A91] transition-colors"
                            >
                              Enquire
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Facilities & Amenities */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDF3] shadow-soft space-y-4">
              <h2 className="text-lg font-bold text-[#142D4E]">Facilities & What&apos;s Included</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {property.amenities.map((amenity) => {
                  const Icon = amenityIconMap[amenity] || CheckCircle2;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3]"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#E8F5F4] text-[#159A91] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#142D4E]">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* House Rules */}
            {property.rules && property.rules.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDF3] shadow-soft space-y-4">
                <h2 className="text-lg font-bold text-[#142D4E]">House Policies & Rules</h2>
                <ul className="space-y-2">
                  {property.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#374A60]">
                      <Info className="w-4 h-4 text-[#159A91] shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDF3] shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#142D4E]">Location & Neighborhood</h2>
                  <p className="text-xs text-[#667A91]">{property.address}, {property.locality}, {property.city}</p>
                </div>
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E8F5F4] text-[#159A91] text-xs font-bold border border-[#159A91]/20 hover:bg-[#E8F5F4]/80 transition-colors self-start"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Get Directions in Google Maps</span>
                </a>
              </div>

              <div className="h-72 w-full rounded-xl overflow-hidden border border-[#E7EDF3]">
                <InteractiveMap
                  properties={[property]}
                  selectedProperty={property}
                  zoom={15}
                />
              </div>
            </div>

            {/* Verified Reviews Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDF3] shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#142D4E]">Verified Reviews</h2>
                  <p className="text-xs text-[#667A91]">Feedback from confirmed residents</p>
                </div>
                <div className="flex items-center gap-1.5 text-base font-extrabold text-[#142D4E] bg-[#FEF7EE] px-3 py-1.5 rounded-xl border border-[#E9A23B]/30">
                  <Star className="w-4 h-4 fill-[#E9A23B] text-[#E9A23B]" />
                  <span>{property.rating}</span>
                  <span className="text-xs font-normal text-[#667A91]">/ 5</span>
                </div>
              </div>

              {/* Add Review */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#142D4E]">Write a Review:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-0.5 hover:scale-105 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            newRating >= star
                              ? "fill-[#E9A23B] text-[#E9A23B]"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={2}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your stay experience, food quality, Wi-Fi speed, host behavior..."
                  className="w-full p-3 rounded-lg bg-white border border-[#E7EDF3] text-xs sm:text-sm text-[#142D4E] focus:outline-none focus:border-[#159A91] resize-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#142D4E] text-white text-xs font-bold hover:bg-[#159A91] disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmittingReview ? "Submitting..." : "Post Review"}
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#E8F5F4] text-[#159A91] font-bold text-xs flex items-center justify-center">
                          {rev.userName[0]}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#142D4E] block">{rev.userName}</span>
                          <span className="text-[10px] text-[#667A91]">
                            {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#E9A23B] text-[#E9A23B]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#374A60] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDF3] shadow-card space-y-5">
              <div>
                <span className="text-xs text-[#667A91] font-semibold block uppercase tracking-wider">
                  Starting Rent
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-[#142D4E]">
                    {formatPrice(property.price, property.pricingType)}
                  </span>
                </div>
                {property.additionalCharges && (
                  <p className="text-xs text-[#667A91] mt-1">
                    {property.additionalCharges}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] space-y-2 text-xs">
                <div className="flex justify-between text-[#667A91]">
                  <span>Security Deposit:</span>
                  <span className="font-bold text-[#142D4E]">
                    {property.securityDeposit ? `₹${property.securityDeposit.toLocaleString("en-IN")}` : "Zero Deposit"}
                  </span>
                </div>
                <div className="flex justify-between text-[#667A91]">
                  <span>Notice Period:</span>
                  <span className="font-bold text-[#142D4E]">30 Days</span>
                </div>
                <div className="flex justify-between text-[#667A91]">
                  <span>Brokerage:</span>
                  <span className="font-bold text-[#159A91]">Zero (Direct Owner)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#E8F5F4] border border-[#159A91]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white text-[#159A91] font-bold flex items-center justify-center text-sm shadow-sm">
                    {property.contact.name[0]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#142D4E] block">{property.contact.name}</span>
                    <span className="text-[11px] text-[#159A91] font-semibold">Verified Property Host</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#159A91] hover:bg-[#118079] text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Free Enquiry</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#142D4E] text-white text-xs font-bold hover:bg-[#0E2038] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#159A91]" />
                  <span>Chat on WhatsApp</span>
                </a>

                {showPhone ? (
                  <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-center font-bold text-sm text-[#142D4E]">
                    {property.contact.phone}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#E7EDF3] text-[#142D4E] text-xs font-bold hover:bg-[#F7F8FA] transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#667A91]" />
                    <span>View Phone Number</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-center text-[#667A91]">
                No booking fees • Transparent pricing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen High-Res Lightbox Modal (Escape to close, Arrows to navigate) */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 text-white select-none animate-fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10 shrink-0">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-lg">{property.title}</h3>
              <p className="text-xs text-slate-400">
                {property.locality}, {property.city} • Photo {activeImageIdx + 1} of {allImages.length}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setFitMode((m) => (m === "contain" ? "cover" : "contain"))}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-1.5 border border-white/15"
              >
                {fitMode === "contain" ? "Fit to Screen" : "Fill Frame"}
              </button>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-all border border-white/15"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image with Left / Right Navigation */}
          <div className="relative flex-1 flex items-center justify-center my-3 overflow-hidden">
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 hover:scale-110 active:scale-95 shadow-xl"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={allImages[activeImageIdx]}
              alt={property.title}
              onError={(e) => {
                const fallback = getAccommodationFallback(property.category, `${property.id}-${activeImageIdx}`);
                if (e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback;
                }
              }}
              className={`max-h-[72vh] max-w-full drop-shadow-2xl transition-all duration-300 ${
                fitMode === "contain" ? "object-contain" : "object-cover w-full h-full"
              }`}
            />

            {allImages.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveImageIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 hover:scale-110 active:scale-95 shadow-xl"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pt-3 border-t border-white/10 scrollbar-none shrink-0">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIdx === idx
                      ? "border-[#159A91] scale-110 shadow-lg ring-2 ring-[#159A91]/50"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <EnquiryModal
        property={property}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </div>
  );
}
