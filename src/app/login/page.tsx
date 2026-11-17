"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleQuickDemo = async (role: "user" | "owner" | "admin") => {
    setIsLoading(true);
    await quickLogin(role);
    setIsLoading(false);
    if (role === "owner") router.push("/owner/dashboard");
    else if (role === "admin") router.push("/admin/dashboard");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-surface py-16 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-soft">
              <Building2 className="w-6 h-6 text-accent" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-primary">
              Stay<span className="text-accent">Hub</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-primary">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to manage your bookings, wishlist, or accommodation listings</p>
        </div>

        {/* Quick Demo Switcher Card */}
        <div className="p-4 rounded-3xl bg-teal-50/70 border border-teal-100 space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent block text-center">
            ⚡ Quick 1-Click Demo Login
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("user")}
              className="py-2 px-3 rounded-xl bg-card text-xs font-bold text-primary border border-coolBorder hover:border-accent hover:text-accent shadow-sm transition-all"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("owner")}
              className="py-2 px-3 rounded-xl bg-card text-xs font-bold text-primary border border-coolBorder hover:border-accent hover:text-accent shadow-sm transition-all"
            >
              Demo Host
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("admin")}
              className="py-2 px-3 rounded-xl bg-card text-xs font-bold text-primary border border-coolBorder hover:border-accent hover:text-accent shadow-sm transition-all"
            >
              Super Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-3xl p-8 border border-coolBorder shadow-soft space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-1">Email Address</label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface border border-coolBorder focus-within:bg-white focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all">
                <Mail className="w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="user@stayhub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-primary">Password</label>
                <span className="text-[11px] text-accent font-semibold hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface border border-coolBorder focus-within:bg-white focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all">
                <Lock className="w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-soft hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? "Signing in..." : "Sign In to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-coolBorder text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-bold text-accent hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
