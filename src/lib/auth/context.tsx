"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone: string; password?: string; role?: "user" | "owner" }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  quickLogin: (role: "user" | "owner" | "admin") => Promise<void>;
  wishlistIds: string[];
  toggleWishlist: (propertyId: string) => Promise<boolean>;
  isWishlisted: (propertyId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>(["prop_1", "prop_4"]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            fetchWishlist();
          } else {
            // Auto login as demo user for great immediate out-of-the-box exploration
            await quickLogin("user");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  async function fetchWishlist() {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        if (data.wishlist) {
          setWishlistIds(data.wishlist.map((p: any) => p.id));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  const login = async (email: string, password = "Password123") => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      setUser(data.user);
      fetchWishlist();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const register = async (userData: { name: string; email: string; phone: string; password?: string; role?: "user" | "owner" }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          password: userData.password || "Password123",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setWishlistIds([]);
  };

  const quickLogin = async (role: "user" | "owner" | "admin") => {
    const email =
      role === "owner"
        ? "owner@stayhub.com"
        : role === "admin"
        ? "admin@stayhub.com"
        : "user@stayhub.com";
    const password = role === "admin" ? "AdminPass123" : "Password123";
    await login(email, password);
  };

  const toggleWishlist = async (propertyId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.saved) {
          setWishlistIds((prev) => [...prev, propertyId]);
          return true;
        } else {
          setWishlistIds((prev) => prev.filter((id) => id !== propertyId));
          return false;
        }
      }
    } catch (e) {
      console.error("Failed to toggle wishlist", e);
    }
    return false;
  };

  const isWishlisted = (propertyId: string) => {
    return wishlistIds.includes(propertyId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        quickLogin,
        wishlistIds,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
