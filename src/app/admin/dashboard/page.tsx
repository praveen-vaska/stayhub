"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { Property, User, Enquiry } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  MapPin,
  Trash2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalOwners: 0,
    totalProperties: 0,
    activeProperties: 0,
    pendingProperties: 0,
    rejectedProperties: 0,
    totalEnquiries: 0,
    totalCities: 0,
    totalLocalities: 0,
  });

  const [activeTab, setActiveTab] = useState<"properties" | "users" | "owners" | "enquiries">("properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [ownersList, setOwnersList] = useState<User[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const statsRes = await fetch("/api/admin/dashboard");
        const statsData = await statsRes.json();
        if (statsData.stats) setStats(statsData.stats);

        const propsRes = await fetch("/api/admin/properties");
        const propsData = await propsRes.json();
        if (propsData.properties) setProperties(propsData.properties);

        const usersRes = await fetch("/api/admin/users");
        const usersData = await usersRes.json();
        if (usersData.users) setUsersList(usersData.users);

        const ownersRes = await fetch("/api/admin/owners");
        const ownersData = await ownersRes.json();
        if (ownersData.owners) setOwnersList(ownersData.owners);

        const enqRes = await fetch("/api/enquiries");
        const enqData = await enqRes.json();
        if (enqData.enquiries) setEnquiries(enqData.enquiries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}/approve`, { method: "PUT" });
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, approvalStatus: "approved" } : p))
        );
        setStats((prev: any) => ({
          ...prev,
          activeProperties: prev.activeProperties + 1,
          pendingProperties: Math.max(0, prev.pendingProperties - 1),
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Incomplete address verification or incorrect pricing info" }),
      });
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, approvalStatus: "rejected" } : p))
        );
        setStats((prev: any) => ({
          ...prev,
          rejectedProperties: prev.rejectedProperties + 1,
          pendingProperties: Math.max(0, prev.pendingProperties - 1),
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (statusFilter === "All") return true;
    return p.approvalStatus === statusFilter;
  });

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Top Banner */}
      <div className="bg-primary text-white py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Super Administrator Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                Admin Control Center
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Moderate property submissions, oversee hosts, and manage marketplace integrity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-accent/20 text-teal-200 border border-accent/30 text-xs font-bold">
                Logged in as Administrator
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Statistics Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-card p-4 rounded-2xl border border-coolBorder shadow-soft">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Stays</span>
            <span className="text-2xl font-black text-primary">{stats.totalProperties}</span>
            <span className="text-[11px] text-slate-500 block">{stats.totalCities} Cities</span>
          </div>

          <div className="bg-card p-4 rounded-2xl border border-coolBorder shadow-soft">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Stays</span>
            <span className="text-2xl font-black text-accent">{stats.activeProperties}</span>
            <span className="text-[11px] text-accent font-semibold">Live on Search</span>
          </div>

          <div className="bg-card p-4 rounded-2xl border border-coolBorder shadow-soft">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pending Review</span>
            <span className="text-2xl font-black text-warmAmber">{stats.pendingProperties}</span>
            <span className="text-[11px] text-warmAmber font-semibold">Action Required</span>
          </div>

          <div className="bg-card p-4 rounded-2xl border border-coolBorder shadow-soft">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Registered Users</span>
            <span className="text-2xl font-black text-primary">{stats.totalUsers}</span>
            <span className="text-[11px] text-slate-500">Tenants</span>
          </div>

          <div className="bg-card p-4 rounded-2xl border border-coolBorder shadow-soft">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Verified Hosts</span>
            <span className="text-2xl font-black text-accent">{stats.totalOwners}</span>
            <span className="text-[11px] text-slate-500">Property Owners</span>
          </div>

          <div className="bg-card p-4 rounded-2xl border border-coolBorder shadow-soft">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Inquiries</span>
            <span className="text-2xl font-black text-primary">{stats.totalEnquiries}</span>
            <span className="text-[11px] text-slate-500">Leads Generated</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-coolBorder pb-2 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab("properties")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "properties"
                ? "bg-primary text-white shadow-soft"
                : "text-slate-600 hover:bg-slate-100 hover:text-primary"
            }`}
          >
            Property Approvals ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "users"
                ? "bg-primary text-white shadow-soft"
                : "text-slate-600 hover:bg-slate-100 hover:text-primary"
            }`}
          >
            Tenants / Users ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab("owners")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "owners"
                ? "bg-primary text-white shadow-soft"
                : "text-slate-600 hover:bg-slate-100 hover:text-primary"
            }`}
          >
            Property Owners ({ownersList.length})
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "enquiries"
                ? "bg-primary text-white shadow-soft"
                : "text-slate-600 hover:bg-slate-100 hover:text-primary"
            }`}
          >
            All Inquiries ({enquiries.length})
          </button>
        </div>

        {/* Tab 1: Property Approvals Workflow */}
        {activeTab === "properties" && (
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-coolBorder shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-primary">Property Listing Verification</h2>
                <p className="text-xs text-slate-500">Review, approve or reject accommodation submissions</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-surface border border-coolBorder p-1 rounded-2xl text-xs font-bold">
                {["All", "pending", "approved", "rejected"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                      statusFilter === st ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-coolBorder text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-bold">Property</th>
                    <th className="pb-3 font-bold">Type</th>
                    <th className="pb-3 font-bold">City & Locality</th>
                    <th className="pb-3 font-bold">Price</th>
                    <th className="pb-3 font-bold">Owner / Host</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coolBorder font-medium">
                  {filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-surface/80 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.coverImage || prop.images[0]}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-coolBorder"
                          />
                          <div>
                            <span className="font-bold text-primary line-clamp-1 max-w-[200px]">
                              {prop.title}
                            </span>
                            <span className="text-[11px] text-slate-400">ID: {prop.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-slate-700">{prop.category}</td>
                      <td className="py-4 text-slate-600">
                        {prop.locality}, {prop.city}
                      </td>
                      <td className="py-4 font-extrabold text-primary">
                        {formatPrice(prop.price, prop.pricingType)}
                      </td>
                      <td className="py-4 text-slate-700">
                        {prop.contact?.name || "Host"}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            prop.approvalStatus === "approved"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : prop.approvalStatus === "pending"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          {prop.approvalStatus}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/property/${prop.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl border border-coolBorder text-slate-600 hover:bg-surface hover:text-primary transition-colors"
                            title="Preview property"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {prop.approvalStatus !== "approved" && (
                            <button
                              disabled={actionLoadingId === prop.id}
                              onClick={() => handleApprove(prop.id)}
                              className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-teal-700 shadow-soft flex items-center gap-1 transition-colors"
                              title="Approve Listing"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          )}

                          {prop.approvalStatus !== "rejected" && (
                            <button
                              disabled={actionLoadingId === prop.id}
                              onClick={() => handleReject(prop.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 flex items-center gap-1 transition-colors"
                              title="Reject Listing"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Users Management */}
        {activeTab === "users" && (
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-coolBorder shadow-soft space-y-4">
            <h2 className="text-xl font-bold text-primary">Tenant Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-coolBorder text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-bold">User</th>
                    <th className="pb-3 font-bold">Email</th>
                    <th className="pb-3 font-bold">Phone</th>
                    <th className="pb-3 font-bold">Role</th>
                    <th className="pb-3 font-bold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coolBorder font-medium">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-surface transition-colors">
                      <td className="py-3 font-bold text-primary">{u.name}</td>
                      <td className="py-3 text-slate-600">{u.email}</td>
                      <td className="py-3 text-slate-600">{u.phone}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface border border-coolBorder text-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Owners Management */}
        {activeTab === "owners" && (
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-coolBorder shadow-soft space-y-4">
            <h2 className="text-xl font-bold text-primary">Registered Property Hosts</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-coolBorder text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-bold">Owner Name</th>
                    <th className="pb-3 font-bold">Contact Email</th>
                    <th className="pb-3 font-bold">Phone / WhatsApp</th>
                    <th className="pb-3 font-bold">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coolBorder font-medium">
                  {ownersList.map((o) => (
                    <tr key={o.id} className="hover:bg-surface transition-colors">
                      <td className="py-3 font-bold text-primary">{o.name}</td>
                      <td className="py-3 text-slate-600">{o.email}</td>
                      <td className="py-3 text-slate-600">{o.phone}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-accent border border-teal-200">
                          Verified Host
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: All Enquiries */}
        {activeTab === "enquiries" && (
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-coolBorder shadow-soft space-y-4">
            <h2 className="text-xl font-bold text-primary">Platform Inquiries</h2>
            <div className="space-y-3">
              {enquiries.map((e) => (
                <div key={e.id} className="p-4 rounded-2xl bg-surface border border-coolBorder flex flex-col sm:flex-row justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-primary">{e.userName}</span>
                    <span className="text-slate-500"> ({e.userPhone}) for </span>
                    <span className="font-bold text-accent">{e.propertyTitle}</span>
                    <p className="text-slate-600 mt-1">&quot;{e.message}&quot;</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-white border border-coolBorder text-primary font-bold uppercase text-[10px]">
                      {e.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
