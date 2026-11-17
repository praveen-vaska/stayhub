"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { Building2, Lock, Mail, Phone, User, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<"user" | "owner">("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      role,
    });
    setIsLoading(false);

    if (res.success) {
      if (role === "owner") {
        router.push("/owner/dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(res.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-surface py-16 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-soft">
              <Building2 className="w-6 h-6 text-accent" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-primary">
              Stay<span className="text-accent">Hub</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-primary">Create an Account</h2>
          <p className="text-xs text-slate-500">Join StayHub to book verified stays or list your accommodations</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="p-1.5 bg-surface border border-coolBorder rounded-2xl grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`py-2.5 rounded-xl transition-all ${
              role === "user"
                ? "bg-primary text-white shadow-soft"
                : "text-slate-600 hover:text-primary"
            }`}
          >
            I&apos;m looking for Stays
          </button>
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`py-2.5 rounded-xl transition-all ${
              role === "owner"
                ? "bg-primary text-white shadow-soft"
                : "text-slate-600 hover:text-primary"
            }`}
          >
            I want to List Property
          </button>
        </div>

        <div className="bg-card rounded-3xl p-8 border border-coolBorder shadow-soft space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-1">Full Name</label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface border border-coolBorder focus-within:bg-white focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all">
                <User className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Email Address</label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface border border-coolBorder focus-within:bg-white focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all">
                <Mail className="w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Mobile Phone (with WhatsApp)</label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface border border-coolBorder focus-within:bg-white focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all">
                <Phone className="w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Password</label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface border border-coolBorder focus-within:bg-white focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all">
                <Lock className="w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Confirm Password</label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface border border-coolBorder focus-within:bg-white focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all">
                <Lock className="w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-soft hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-coolBorder text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-accent hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
