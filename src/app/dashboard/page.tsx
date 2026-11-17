"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { Property, Enquiry } from "@/types";
import PropertyCard from "@/components/search/PropertyCard";
import {
  User,
  Heart,
  MessageSquare,
  Calendar,
  ExternalLink,
} from "lucide-react";

function UserDashboardContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "wishlist";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [wishlistProperties, setWishlistProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const wishRes = await fetch("/api/wishlist");
        const wishData = await wishRes.json();
        setWishlistProperties(wishData.wishlist || []);

        const enqRes = await fetch("/api/enquiries/my-enquiries");
        const enqData = await enqRes.json();
        setEnquiries(enqData.enquiries || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const getStatusBadge = (status: Enquiry["status"]) => {
    switch (status) {
      case "New":
        return "bg-slate-100 text-[#142D4E] border-[#E7EDF3]";
      case "Contacted":
        return "bg-[#FEF7EE] text-[#E9A23B] border-[#E9A23B]/30";
      case "Visit Scheduled":
        return "bg-[#E8F5F4] text-[#159A91] border-[#159A91]/30";
      case "Converted":
        return "bg-[#E8F5F4] text-[#159A91] border-[#159A91]/30";
      case "Closed":
        return "bg-slate-100 text-slate-600 border-[#E7EDF3]";
      default:
        return "bg-slate-100 text-slate-700 border-[#E7EDF3]";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* Top Banner */}
      <div className="bg-[#142D4E] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#159A91]">
                  User Dashboard
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {user?.name || "Praveen Sharma"}
                </h1>
                <p className="text-xs text-slate-300">
                  {user?.email || "user@stayhub.com"} • {user?.phone || "+91 98765 43210"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/owner/dashboard"
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors"
              >
                Switch to Host View
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 rounded-xl bg-[#159A91]/20 text-[#159A91] border border-[#159A91]/30 text-xs font-bold hover:bg-[#159A91]/30 transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="bg-white border-b border-[#E7EDF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none text-sm font-bold">
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`py-4 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "wishlist"
                  ? "border-[#159A91] text-[#159A91] font-bold"
                  : "border-transparent text-[#667A91] hover:text-[#142D4E]"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Saved Properties ({wishlistProperties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("enquiries")}
              className={`py-4 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "enquiries"
                  ? "border-[#159A91] text-[#159A91] font-bold"
                  : "border-transparent text-[#667A91] hover:text-[#142D4E]"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>My Enquiries ({enquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "profile"
                  ? "border-[#159A91] text-[#159A91] font-bold"
                  : "border-transparent text-[#667A91] hover:text-[#142D4E]"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#142D4E]">Your Saved Stays</h2>
                <p className="text-xs text-[#667A91]">Compare and revisit accommodations you shortlisted</p>
              </div>
              <Link
                href="/search"
                className="text-xs font-bold text-[#159A91] hover:underline"
              >
                Explore more &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 rounded-2xl bg-white border border-[#E7EDF3] animate-pulse" />
                ))}
              </div>
            ) : wishlistProperties.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E7EDF3]">
                <Heart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#142D4E]">No saved properties yet</h3>
                <p className="text-xs text-[#667A91] max-w-sm mx-auto mt-1">
                  Click the heart icon on any accommodation card to bookmark it here for quick access.
                </p>
                <Link
                  href="/search"
                  className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-[#142D4E] text-white text-xs font-bold shadow-sm"
                >
                  Browse Stays
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "enquiries" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#142D4E]">Your Host Inquiries</h2>
              <p className="text-xs text-[#667A91]">Track visit requests, responses, and status from owners</p>
            </div>

            {enquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E7EDF3]">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#142D4E]">No enquiries submitted</h3>
                <p className="text-xs text-[#667A91] max-w-sm mx-auto mt-1">
                  When you send an enquiry or schedule a visit on any accommodation page, it will appear here with live updates.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="bg-white rounded-2xl p-5 border border-[#E7EDF3] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      {enq.propertyImage && (
                        <img
                          src={enq.propertyImage}
                          alt=""
                          className="w-18 h-18 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div className="space-y-1">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(enq.status)}`}>
                          {enq.status}
                        </span>
                        <h4 className="text-base font-bold text-[#142D4E]">
                          {enq.propertyTitle}
                        </h4>
                        <p className="text-xs text-[#667A91]">{enq.propertyLocation}</p>
                        <p className="text-xs text-[#374A60] bg-[#F7F8FA] p-2.5 rounded-lg border border-[#E7EDF3] max-w-xl">
                          &quot;{enq.message}&quot;
                        </p>
                        {enq.preferredVisitDate && (
                          <span className="text-[11px] text-[#667A91] flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#159A91]" />
                            Requested Visit: {enq.preferredVisitDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-400 block mb-2">
                        {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <Link
                        href={`/property/${enq.propertyId}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F7F8FA] border border-[#E7EDF3] text-xs font-bold text-[#142D4E] hover:bg-[#E7EDF3] transition-colors"
                      >
                        <span>View Stay</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-2xl bg-white rounded-2xl p-7 border border-[#E7EDF3] shadow-soft space-y-5">
            <h2 className="text-xl font-bold text-[#142D4E]">Profile & Security Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || "Praveen Sharma"}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || "user@stayhub.com"}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">Mobile Number</label>
                <input
                  type="tel"
                  defaultValue={user?.phone || "+91 98765 43210"}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-sm font-semibold text-[#142D4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">Account Role</label>
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase bg-[#E8F5F4] text-[#159A91]">
                  {user?.role || "user"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7EDF3] flex items-center justify-between">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-[#142D4E] text-white text-xs font-bold hover:bg-[#159A91] transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#667A91]">Loading dashboard...</div>}>
      <UserDashboardContent />
    </Suspense>
  );
}
