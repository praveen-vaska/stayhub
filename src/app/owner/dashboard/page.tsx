"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Property, Enquiry } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
<<<<<<< HEAD
import { getAccommodationFallback } from "@/lib/utils/fallbackImages";
=======
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
import {
  Building2,
  PlusCircle,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ExternalLink,
} from "lucide-react";

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState<any>({
    totalProperties: 0,
    activeListings: 0,
    pendingApprovals: 0,
    totalEnquiries: 0,
    propertyViews: 0,
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const statsRes = await fetch("/api/owner/dashboard");
        const statsData = await statsRes.json();
        if (statsData.stats) setStats(statsData.stats);

        const propsRes = await fetch("/api/owner/properties");
        const propsData = await propsRes.json();
        if (propsData.properties) setProperties(propsData.properties);

        const enqRes = await fetch("/api/owner/enquiries");
        const enqData = await enqRes.json();
        if (enqData.enquiries) setEnquiries(enqData.enquiries);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const handleStatusUpdate = async (enquiryId: string, newStatus: string) => {
    setUpdatingId(enquiryId);
    try {
      const res = await fetch(`/api/owner/enquiries/${enquiryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus as any } : e))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const getApprovalBadge = (status: Property["approvalStatus"]) => {
    switch (status) {
      case "approved":
        return {
          label: "Active & Approved",
          cls: "bg-[#E8F5F4] text-[#159A91] border-[#159A91]/30",
          icon: CheckCircle2,
        };
      case "pending":
        return {
          label: "Pending Verification",
          cls: "bg-[#FEF7EE] text-[#E9A23B] border-[#E9A23B]/30",
          icon: Clock,
        };
      case "rejected":
        return {
          label: "Rejected by Admin",
          cls: "bg-rose-50 text-rose-700 border-rose-200",
          icon: XCircle,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* Top Banner */}
      <div className="bg-[#142D4E] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#159A91]">
                Host & Property Manager Console
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Owner Dashboard
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Manage your listings, review pending approvals, and communicate with prospective tenants.
              </p>
            </div>

            <Link
              href="/owner/add-property"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#159A91] text-white text-sm font-bold hover:bg-[#118079] transition-all self-start md:self-auto shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Stay</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E7EDF3] shadow-soft space-y-1">
            <span className="text-xs font-bold text-[#667A91] uppercase tracking-wider">Total Listings</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#142D4E]">{stats.totalProperties}</span>
              <div className="w-9 h-9 rounded-lg bg-[#E8F5F4] text-[#159A91] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-[#159A91] font-semibold">{stats.activeListings} Active on Search</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7EDF3] shadow-soft space-y-1">
            <span className="text-xs font-bold text-[#667A91] uppercase tracking-wider">Total Inquiries</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#142D4E]">{stats.totalEnquiries}</span>
              <div className="w-9 h-9 rounded-lg bg-[#E8F5F4] text-[#159A91] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-[#667A91] font-medium">Customer leads</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7EDF3] shadow-soft space-y-1">
            <span className="text-xs font-bold text-[#667A91] uppercase tracking-wider">Pending Approvals</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#E9A23B]">{stats.pendingApprovals}</span>
              <div className="w-9 h-9 rounded-lg bg-[#FEF7EE] text-[#E9A23B] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-[#667A91] font-medium">Under admin review</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7EDF3] shadow-soft space-y-1">
            <span className="text-xs font-bold text-[#667A91] uppercase tracking-wider">Listing Views</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#142D4E]">{stats.propertyViews}</span>
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#142D4E] flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-[#159A91] font-semibold">+18% this week</span>
          </div>
        </div>

        {/* Property Listings Management Table */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDF3] shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#142D4E]">Your Registered Properties</h2>
              <p className="text-xs text-[#667A91]">Live listings, vacancy status, and details</p>
            </div>
            <Link
              href="/owner/add-property"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#142D4E] text-white text-xs font-bold hover:bg-[#159A91] transition-colors self-start"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Another Stay</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E7EDF3] text-[#667A91] uppercase tracking-wider text-[11px]">
                  <th className="pb-3 font-bold">Property</th>
                  <th className="pb-3 font-bold">Category</th>
                  <th className="pb-3 font-bold">Location</th>
                  <th className="pb-3 font-bold">Price</th>
                  <th className="pb-3 font-bold">Vacancy</th>
                  <th className="pb-3 font-bold">Approval Status</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7EDF3] font-medium">
                {properties.map((prop) => {
                  const badge = getApprovalBadge(prop.approvalStatus);
                  const BadgeIcon = badge.icon;
                  return (
                    <tr key={prop.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
<<<<<<< HEAD
                            src={prop.coverImage || prop.images[0] || getAccommodationFallback(prop.category, prop.id)}
                            alt=""
                            onError={(e) => {
                              const fallback = getAccommodationFallback(prop.category, prop.id);
                              if (e.currentTarget.src !== fallback) {
                                e.currentTarget.src = fallback;
                              }
                            }}
=======
                            src={prop.coverImage || prop.images[0]}
                            alt=""
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#142D4E] line-clamp-1 max-w-[200px]">
                              {prop.title}
                            </span>
                            <span className="text-[11px] text-[#667A91]">ID: {prop.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#F7F8FA] text-[#142D4E] border border-[#E7EDF3]">
                          {prop.category}
                        </span>
                      </td>
                      <td className="py-4 text-[#667A91]">
                        {prop.locality}, {prop.city}
                      </td>
                      <td className="py-4 font-bold text-[#142D4E]">
                        {formatPrice(prop.price, prop.pricingType)}
                      </td>
                      <td className="py-4">
                        <span className="text-[#159A91] font-bold">{prop.availableBeds} beds free</span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold border ${badge.cls}`}>
                          <BadgeIcon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/property/${prop.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E7EDF3] text-xs font-bold text-[#142D4E] hover:bg-[#F7F8FA] transition-colors"
                        >
                          <span>View Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incoming Customer Inquiries */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDF3] shadow-soft space-y-5">
          <div>
            <h2 className="text-lg font-bold text-[#142D4E]">Incoming Customer Inquiries</h2>
            <p className="text-xs text-[#667A91]">Respond to customer requests and schedule room visits</p>
          </div>

          <div className="space-y-3">
            {enquiries.length === 0 ? (
              <p className="text-sm text-[#667A91] text-center py-8">No enquiries received yet.</p>
            ) : (
              enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#142D4E] text-sm">{enq.userName}</span>
                      <span className="text-xs text-[#667A91]">• {enq.userPhone} • {enq.userEmail}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#159A91]">
                      Inquiring for: {enq.propertyTitle}
                    </p>
                    <p className="text-xs text-[#374A60] bg-white p-2.5 rounded-lg border border-[#E7EDF3] max-w-xl">
                      &quot;{enq.message}&quot;
                    </p>
                    {enq.preferredVisitDate && (
                      <span className="text-[11px] text-[#667A91] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#159A91]" />
                        Requested Visit Date: {enq.preferredVisitDate}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#667A91]">Status:</span>
                    <select
                      value={enq.status}
                      disabled={updatingId === enq.id}
                      onChange={(e) => handleStatusUpdate(enq.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E7EDF3] text-xs font-bold text-[#142D4E] focus:outline-none focus:border-[#159A91] cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Visit Scheduled">Visit Scheduled</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <a
                      href={`https://wa.me/${enq.userPhone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#159A91] text-white text-xs font-bold hover:bg-[#118079] transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
