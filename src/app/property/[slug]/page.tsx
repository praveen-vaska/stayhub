"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Property, Review } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
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
} from "lucide-react";

export default function PropertyDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { isWishlisted, toggleWishlist } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
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

  const allImages = property.images && property.images.length > 0 ? property.images : [property.coverImage];

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

        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[480px] w-full rounded-2xl overflow-hidden bg-[#142D4E] shadow-card group">
            <img
              src={allImages[activeImageIdx]}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#142D4E] shadow-md transition-transform"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#142D4E] shadow-md transition-transform"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 right-4 bg-[#142D4E]/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-md">
              Photo {activeImageIdx + 1} of {allImages.length}
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIdx === idx
                      ? "border-[#159A91] shadow-sm"
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
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

      <EnquiryModal
        property={property}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </div>
  );
}
