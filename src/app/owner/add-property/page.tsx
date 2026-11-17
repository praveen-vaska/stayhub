"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { PropertyCategory, GenderPreference, FurnishingStatus, PricingType } from "@/types";
import { SEED_CITIES } from "@/lib/db/seedData";
import { formatPrice } from "@/lib/utils/formatters";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function AddPropertyPage() {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProperty, setSubmittedProperty] = useState<any>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "PG" as PropertyCategory,
    description: "",

    country: "India",
    state: "Telangana",
    city: "Hyderabad",
    locality: "Gachibowli",
    address: "",
    pincode: "500032",
    lat: 17.4401,
    lng: 78.3489,

    price: 8500,
    pricingType: "monthly" as PricingType,
    securityDeposit: 5000,
    additionalCharges: "Electricity as per sub-meter",

    genderPreference: "Unisex" as GenderPreference,
    furnishingStatus: "Furnished" as FurnishingStatus,
    totalRooms: 12,
    availableBeds: 5,
    roomTypes: [
      { name: "Single Private Room", sharing: "Single", price: 16000, available: 2, total: 4 },
      { name: "Double Sharing", sharing: "Double", price: 9500, available: 3, total: 8 },
    ],

    amenities: ["Wi-Fi", "Food", "AC", "Attached Bathroom", "Power Backup", "Housekeeping", "CCTV"],

    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    ],
    coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
    newImageUrl: "",

    contact: {
      name: user?.name || "Vikram Reddy",
      phone: user?.phone || "+91 91234 56789",
      whatsapp: user?.phone || "+91 91234 56789",
      email: user?.email || "owner@stayhub.com",
    },

    rules: [
      "Visitors allowed in lounge area until 9:00 PM",
      "Smoking strictly prohibited in rooms",
      "Notice period: 30 days mandatory",
    ],
  });

  const selectedCityData = SEED_CITIES.find((c) => c.name.toLowerCase() === formData.city.toLowerCase()) || SEED_CITIES[0];

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleAddImage = () => {
    if (formData.newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, prev.newImageUrl.trim()],
        newImageUrl: "",
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        coverImage: updated[0] || "",
      };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        title: formData.title || "Modern Coliving PG & Rooms",
        category: formData.category,
        description: formData.description || "Well maintained accommodation with all premium amenities.",
        images: formData.images,
        coverImage: formData.coverImage || formData.images[0],
        country: formData.country,
        state: formData.state,
        city: formData.city,
        locality: formData.locality,
        address: formData.address || `${formData.locality}, ${formData.city}`,
        pincode: formData.pincode,
        coordinates: {
          lat: formData.lat,
          lng: formData.lng,
        },
        price: Number(formData.price),
        pricingType: formData.pricingType,
        securityDeposit: Number(formData.securityDeposit),
        additionalCharges: formData.additionalCharges,
        genderPreference: formData.genderPreference,
        furnishingStatus: formData.furnishingStatus,
        roomTypes: formData.roomTypes,
        totalRooms: Number(formData.totalRooms),
        availableBeds: Number(formData.availableBeds),
        amenities: formData.amenities,
        rules: formData.rules,
        contact: formData.contact,
        isFeatured: false,
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit property");
      }

      setSubmittedProperty(data.property);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allAmenitiesList = [
    "Wi-Fi",
    "Food",
    "AC",
    "Attached Bathroom",
    "Power Backup",
    "Housekeeping",
    "CCTV",
    "Security",
    "Parking",
    "Lift",
    "Laundry",
  ];

  if (submittedProperty) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] py-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 sm:p-12 max-w-lg w-full text-center border border-[#E7EDF3] shadow-card space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#E8F5F4] text-[#159A91] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E9A23B] bg-[#FEF7EE] px-3 py-1 rounded-md border border-[#E9A23B]/30">
              Status: Pending Admin Approval
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] mt-3">
              Property Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-[#667A91] mt-2 leading-relaxed">
              &quot;{submittedProperty.title}&quot; in {submittedProperty.locality}, {submittedProperty.city} has been received. Our admin team will verify the listing within 24 hours.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/owner/dashboard"
              className="flex-1 py-3 px-4 rounded-xl bg-[#142D4E] text-white text-xs font-bold hover:bg-[#0E2038] transition-colors text-center"
            >
              Go to Host Dashboard
            </Link>
            <Link
              href="/admin/dashboard"
              className="flex-1 py-3 px-4 rounded-xl bg-[#E8F5F4] text-[#159A91] border border-[#159A91]/30 text-xs font-bold hover:bg-[#E8F5F4]/80 transition-colors text-center"
            >
              Approve in Admin Panel &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* Top Header */}
      <div className="bg-[#142D4E] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/owner/dashboard" className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            List Your Accommodation Property
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Complete the 8 simple steps below to publish your stay on StayHub
          </p>

          {/* Stepper Progress */}
          <div className="mt-6 flex items-center justify-between overflow-x-auto pb-2 scrollbar-none gap-2">
            {[
              { num: 1, title: "Basics" },
              { num: 2, title: "Location" },
              { num: 3, title: "Pricing" },
              { num: 4, title: "Rooms" },
              { num: 5, title: "Amenities" },
              { num: 6, title: "Photos" },
              { num: 7, title: "Contact" },
              { num: 8, title: "Review" },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  step === s.num
                    ? "bg-[#159A91] text-white shadow-sm"
                    : step > s.num
                    ? "bg-[#0E2038] text-[#159A91]"
                    : "bg-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <span>{s.num}.</span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white rounded-2xl p-6 sm:p-9 border border-[#E7EDF3] shadow-soft space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              {error}
            </div>
          )}

          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#159A91]">Step 1 of 8</span>
                <h2 className="text-lg font-bold text-[#142D4E] mt-1">Property Basic Details</h2>
                <p className="text-xs text-[#667A91]">Provide an attractive title and describe the stay</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">Accommodation Name / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zolo CyberSpace Luxury PG for Men & Women"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none focus:border-[#159A91]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">Accommodation Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as PropertyCategory })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none focus:border-[#159A91]"
                >
                  <option value="PG">PG Accommodation (Coliving)</option>
                  <option value="Hotel">Hotel & Suites</option>
                  <option value="Hostel">Backpacker Hostel</option>
                  <option value="Apartment">Apartment & Flats (1/2/3 BHK)</option>
                  <option value="Lodge">Budget Lodge</option>
                  <option value="Room">1RK / Independent Room</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe proximity to metro stations, tech parks, meal offerings, Wi-Fi speed, community events..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm text-[#142D4E] focus:outline-none focus:border-[#159A91] resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#159A91]">Step 2 of 8</span>
                <h2 className="text-lg font-bold text-[#142D4E] mt-1">Exact Location & Neighborhood</h2>
                <p className="text-xs text-[#667A91]">Pick city and select registered locality</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      const cData = SEED_CITIES.find((c) => c.name === newCity);
                      setFormData({
                        ...formData,
                        city: newCity,
                        state: cData ? cData.state : formData.state,
                        locality: cData ? cData.localities[0] : formData.locality,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  >
                    {SEED_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>{c.name} ({c.state})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Locality in {formData.city} *</label>
                  <select
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  >
                    {selectedCityData.localities.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">Complete Address / Street / Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plot 42, Telecom Nagar, Near DLF Cyber City Gate 2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">PIN Code *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#159A91]">Step 3 of 8</span>
                <h2 className="text-lg font-bold text-[#142D4E] mt-1">Pricing & Deposits</h2>
                <p className="text-xs text-[#667A91]">Define rent amounts and terms</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Starting Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-bold text-[#142D4E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Pricing Interval *</label>
                  <select
                    value={formData.pricingType}
                    onChange={(e) => setFormData({ ...formData, pricingType: e.target.value as PricingType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  >
                    <option value="monthly">Monthly (PGs, Flats, Rooms)</option>
                    <option value="daily">Daily / Per Night (Hotels, Hostels, Lodges)</option>
                    <option value="yearly">Yearly Lease</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-bold text-[#142D4E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Additional Charges (if any)</label>
                  <input
                    type="text"
                    placeholder="e.g. Electricity as per meter (₹10/unit)"
                    value={formData.additionalCharges}
                    onChange={(e) => setFormData({ ...formData, additionalCharges: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Accommodation Details */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#159A91]">Step 4 of 8</span>
                <h2 className="text-lg font-bold text-[#142D4E] mt-1">Accommodation Details</h2>
                <p className="text-xs text-[#667A91]">Gender rules, room count, and furnishing</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Gender Preference *</label>
                  <select
                    value={formData.genderPreference}
                    onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value as GenderPreference })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  >
                    <option value="Unisex">Co-living (Unisex / Anyone)</option>
                    <option value="Boys">Men Only</option>
                    <option value="Girls">Women Only</option>
                    <option value="Family">Families Welcome</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Furnishing Status *</label>
                  <select
                    value={formData.furnishingStatus}
                    onChange={(e) => setFormData({ ...formData, furnishingStatus: e.target.value as FurnishingStatus })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  >
                    <option value="Furnished">Fully Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Total Rooms</label>
                  <input
                    type="number"
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Available Beds</label>
                  <input
                    type="number"
                    value={formData.availableBeds}
                    onChange={(e) => setFormData({ ...formData, availableBeds: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Amenities */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#159A91]">Step 5 of 8</span>
                <h2 className="text-lg font-bold text-[#142D4E] mt-1">Select Facilities & Amenities</h2>
                <p className="text-xs text-[#667A91]">Check all amenities available at the premises</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allAmenitiesList.map((am) => {
                  const isChecked = formData.amenities.includes(am);
                  return (
                    <button
                      key={am}
                      type="button"
                      onClick={() => handleAmenityToggle(am)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                        isChecked
                          ? "bg-[#E8F5F4] border-[#159A91] text-[#159A91]"
                          : "bg-[#F7F8FA] border-[#E7EDF3] text-[#667A91] hover:bg-[#E7EDF3]"
                      }`}
                    >
                      <span>{am}</span>
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${isChecked ? "bg-[#159A91] border-[#159A91] text-white" : "border-slate-300 bg-white"}`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Images */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#159A91]">Step 6 of 8</span>
                <h2 className="text-lg font-bold text-[#142D4E] mt-1">Property Photos</h2>
                <p className="text-xs text-[#667A91]">Add image links for rooms and amenities</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL (Unsplash, Cloudinary, etc.)"
                  value={formData.newImageUrl}
                  onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-5 py-2.5 rounded-xl bg-[#142D4E] text-white text-xs font-bold hover:bg-[#159A91]"
                >
                  Add Image
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#E7EDF3] aspect-[16/10]">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-rose-600 text-white shadow-sm hover:bg-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#142D4E]/90 text-white text-[10px] font-bold">
                        Cover Photo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Contact Information */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#159A91]">Step 7 of 8</span>
                <h2 className="text-lg font-bold text-[#142D4E] mt-1">Host Contact Information</h2>
                <p className="text-xs text-[#667A91]">Contact details for tenant enquiries & WhatsApp</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Host / Manager Name *</label>
                  <input
                    type="text"
                    value={formData.contact.name}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, name: e.target.value } })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">WhatsApp Number *</label>
                  <input
                    type="tel"
                    value={formData.contact.whatsapp}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, whatsapp: e.target.value } })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142D4E] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Preview & Submit */}
          {step === 8 && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#159A91]">Step 8 of 8</span>
                <h2 className="text-lg font-bold text-[#142D4E] mt-1">Preview & Submit Listing</h2>
                <p className="text-xs text-[#667A91]">Review all details before submitting for approval</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] space-y-3">
                <div className="flex items-start gap-4">
                  <img
                    src={formData.coverImage || formData.images[0]}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase text-[#159A91]">{formData.category} • {formData.genderPreference}</span>
                    <h3 className="text-base font-bold text-[#142D4E]">{formData.title || "Untitled Property"}</h3>
                    <p className="text-xs text-[#667A91]">{formData.address || formData.locality}, {formData.city}</p>
                    <p className="text-base font-extrabold text-[#142D4E] mt-1">
                      {formatPrice(formData.price, formData.pricingType)}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E7EDF3] text-xs text-[#667A91]">
                  <span className="font-bold text-[#142D4E]">Amenities: </span>
                  {formData.amenities.join(", ")}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FEF7EE] border border-[#E9A23B]/30 text-xs text-[#142D4E]">
                <p className="font-bold text-[#E9A23B]">Submission Verification Policy:</p>
                <p className="text-slate-600 mt-0.5">
                  New accommodation listings are marked as <strong>Pending Verification</strong> until verified by administrators to prevent incorrect pricing or spam listings.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-5 border-t border-[#E7EDF3] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-[#E7EDF3] text-xs font-bold text-[#142D4E] hover:bg-[#F7F8FA] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Step
              </button>
            ) : (
              <div />
            )}

            {step < 8 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 px-5 py-2 rounded-xl bg-[#142D4E] text-white text-xs font-bold hover:bg-[#159A91] transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#159A91] hover:bg-[#118079] text-white text-xs font-bold shadow-sm disabled:opacity-50 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting..." : "Submit Listing for Approval"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
