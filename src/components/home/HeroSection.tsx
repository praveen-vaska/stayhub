"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type Variants, type MotionValue } from "framer-motion";
import { Magnetic } from "@/components/motion/Interactive";
import {
  Search,
  MapPin,
  Building2,
  BadgeIndianRupee,
  ShieldCheck,
  CheckCircle,
  Star,
  MessageCircle,
  BadgeCheck,
  TrendingUp,
  ChevronDown,
  Hotel,
  ArrowUpRight,
  Navigation,
} from "lucide-react";
import type { Property } from "@/types";
import StaySearchResults from "./StaySearchResults";
import FloatingPortal from "@/components/common/FloatingPortal";
import FancySelect, { type FancyOption } from "@/components/common/FancySelect";
import { Sparkles, Bed, Compass, Building, Home, DoorOpen, Wallet, PiggyBank, Coins, Gem } from "lucide-react";

const CATEGORY_OPTIONS: FancyOption[] = [
  { value: "All", label: "All Stays", hint: "PGs, hotels, hostels & more", icon: Sparkles },
  { value: "PG", label: "PG Accommodation", hint: "Meals, Wi‑Fi, housekeeping", icon: Bed },
  { value: "Hotel", label: "Hotels & Suites", hint: "Nightly business & leisure", icon: Hotel },
  { value: "Hostel", label: "Backpacker Hostels", hint: "Social & budget-friendly", icon: Compass },
  { value: "Apartment", label: "Apartments & Flats", hint: "1–3 BHK gated homes", icon: Home },
  { value: "Lodge", label: "Budget Lodges", hint: "Near stations & hubs", icon: Building },
  { value: "Room", label: "1RK / Single Rooms", hint: "Private studio units", icon: DoorOpen },
];

const BUDGET_OPTIONS: FancyOption[] = [
  { value: "all", label: "Any Price", hint: "Show every budget", icon: Wallet },
  { value: "budget", label: "Under ₹10k / mo", hint: "Value stays", icon: PiggyBank },
  { value: "mid", label: "₹10k – ₹25k / mo", hint: "Most popular", icon: Coins },
  { value: "premium", label: "Above ₹25k / mo", hint: "Premium & luxury", icon: Gem },
];

interface Suggestion {
  type: "city" | "locality" | "sublocality" | "property";
  name: string;
  city: string;
  state: string;
  locality?: string;
  fullName?: string;
  slug?: string;
  category?: string;
  price?: number;
}

const HERO_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80",
    label: "Boutique hotels",
  },
  {
    src: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=2000&q=80",
    label: "Coliving PGs",
  },
  {
    src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=80",
    label: "Serviced apartments",
  },
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80",
    label: "Premium suites",
  },
];

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80",
];

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [category, setCategory] = useState("All");
  const [priceTier, setPriceTier] = useState("all");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [slide, setSlide] = useState(0);

  // Mouse parallax: background drifts against the cursor, floating cards with it
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.8 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.8 });
  const bgX = useTransform(smoothX, (v) => v * -26);
  const bgY = useTransform(smoothY, (v) => v * -18);
  const cardX = useTransform(smoothX, (v) => v * 34);
  const cardY = useTransform(smoothY, (v) => v * 24);
  const handleHeroPointer = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - r.left) / r.width - 0.5);
    pointerY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const searchRef = useRef<HTMLDivElement>(null);

  // "Search by stay name" mode
  const [mode, setMode] = useState<"location" | "name">("location");
  const [nameQuery, setNameQuery] = useState("");
  const [nameResults, setNameResults] = useState<Property[]>([]);
  const [nameLoading, setNameLoading] = useState(false);
  const [showNameResults, setShowNameResults] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);
  const nameFieldRef = useRef<HTMLDivElement>(null);
  const nameMenuRef = useRef<HTMLDivElement | null>(null);
  const locFieldRef = useRef<HTMLDivElement>(null);
  const locMenuRef = useRef<HTMLDivElement | null>(null);
  const [nameError, setNameError] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const requestId = useRef(0);

  // Debounced property-name autocomplete — searches our listings + live Google Maps places
  useEffect(() => {
    const q = nameQuery.trim();
    setHighlight(-1);
    if (q.length < 2) {
      requestId.current++;
      setNameResults([]);
      setNameLoading(false);
      setNameError(false);
      return;
    }
    setNameLoading(true);
    setShowNameResults(true);
    const myId = ++requestId.current;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({ q, limit: "6" });
      if (category !== "All") params.set("category", category);
      fetch(`/api/search?${params.toString()}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(String(res.status));
          return res.json();
        })
        .then((data) => {
          if (myId !== requestId.current) return;
          setNameResults(data.properties || []);
          setNameError(false);
        })
        .catch((err) => {
          if (myId !== requestId.current || err?.name === "AbortError") return;
          setNameResults([]);
          setNameError(true);
        })
        .finally(() => {
          if (myId === requestId.current) setNameLoading(false);
        });
    }, 380);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [nameQuery, category]);

  const onNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showNameResults || nameResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % nameResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? nameResults.length - 1 : h - 1));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      router.push(`/property/${nameResults[highlight].slug}`);
    } else if (e.key === "Escape") {
      setShowNameResults(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (nameRef.current?.contains(t) || nameMenuRef.current?.contains(t)) return;
      setShowNameResults(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNameSearch = () => {
    const params = new URLSearchParams();
    if (nameQuery.trim()) params.set("q", nameQuery.trim());
    if (category !== "All") params.set("category", category);
    router.push(`/search?${params.toString()}`);
  };

  // Background slideshow
  useEffect(() => {
    const id = window.setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      fetch(`/api/locations/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node) && !locMenuRef.current?.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isLocating, setIsLocating] = useState(false);

  const handleHeroNearMe = () => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const params = new URLSearchParams();
        params.set("lat", latitude.toString());
        params.set("lng", longitude.toString());
        params.set("sort", "distance_asc");
        if (category !== "All") params.set("category", category);
        router.push(`/search?${params.toString()}`);
      },
      (err) => {
        setIsLocating(false);
        console.warn("Geolocation fallback:", err.message);
        // Fallback to Gachibowli / Anjaiah Nagar coordinates
        const params = new URLSearchParams();
        params.set("lat", "17.4468");
        params.set("lng", "78.3653");
        params.set("sort", "distance_asc");
        if (category !== "All") params.set("category", category);
        router.push(`/search?${params.toString()}`);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSelectSuggestion = (item: Suggestion) => {
    if (item.type === "property" && item.slug) {
      router.push(`/property/${item.slug}`);
      setShowSuggestions(false);
      return;
    }

    if (item.type === "sublocality") {
      setQuery(item.name);
      setSelectedCity(item.city);
      setSelectedLocality(item.locality || item.name);
      const params = new URLSearchParams();
      if (item.city) params.set("city", item.city);
      if (item.locality) params.set("locality", item.locality);
      params.set("q", item.name);
      if (category !== "All") params.set("category", category);
      router.push(`/search?${params.toString()}`);
      setShowSuggestions(false);
      return;
    }

    if (item.type === "locality") {
      setQuery(`${item.name}, ${item.city}`);
      setSelectedCity(item.city);
      setSelectedLocality(item.name);
      const params = new URLSearchParams();
      if (item.city) params.set("city", item.city);
      params.set("locality", item.name);
      if (category !== "All") params.set("category", category);
      router.push(`/search?${params.toString()}`);
      setShowSuggestions(false);
      return;
    } else {
      setQuery(item.name);
      setSelectedCity(item.name);
      setSelectedLocality("");
      const params = new URLSearchParams();
      params.set("city", item.name);
      if (category !== "All") params.set("category", category);
      router.push(`/search?${params.toString()}`);
      setShowSuggestions(false);
      return;
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams();
    if (selectedCity && selectedCity !== "All") params.set("city", selectedCity);
    if (selectedLocality && selectedLocality !== "All") params.set("locality", selectedLocality);
    if (category && category !== "All") params.set("category", category);

    if (priceTier === "budget") {
      params.set("maxPrice", "10000");
    } else if (priceTier === "mid") {
      params.set("minPrice", "10000");
      params.set("maxPrice", "25000");
    } else if (priceTier === "premium") {
      params.set("minPrice", "25000");
    }

    if (query.trim()) {
      const cleanQ = query.replace(new RegExp(selectedCity, "gi"), "").replace(/,/g, "").trim();
      if (cleanQ) {
        params.set("q", cleanQ);
      } else if (query.trim() !== selectedCity && !selectedLocality) {
        params.set("q", query.trim());
      }
    }

    router.push(`/search?${params.toString()}`);
  };

  const fieldBox =
    "flex items-center gap-2.5 px-3.5 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-[#E7EDF3] dark:border-white/10 focus-within:bg-white dark:focus-within:bg-white/10 focus-within:border-[#159A91] focus-within:ring-4 focus-within:ring-[#159A91]/10 hover:border-[#C9D5E1] dark:hover:border-white/20 transition-all";
  const labelCls =
    "block text-[11px] font-bold uppercase tracking-wider text-[#667A91] dark:text-slate-400 mb-1.5 ml-1 whitespace-nowrap";
  const selectLabelCls = "text-sm font-semibold text-[#142D4E] dark:text-white";

  const categorySelect = (
    <div className="text-left">
      <label htmlFor="hero-category" className={labelCls}>
        Stay Category
      </label>
      <FancySelect
        id="hero-category"
        value={category}
        onChange={setCategory}
        options={CATEGORY_OPTIONS}
        leadingIcon={<Building2 className="w-4 h-4 text-[#159A91] shrink-0" />}
        buttonClassName={fieldBox}
        labelClassName={selectLabelCls}
        menuWidth="w-[290px]"
      />
    </div>
  );

  const submitButton = (
    <motion.button
      type="submit"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="btn-shine w-full h-12 flex items-center justify-center gap-2 px-5 rounded-xl bg-gradient-to-r from-[#159A91] to-[#1FB5AA] hover:from-[#118079] hover:to-[#159A91] text-white font-bold text-sm whitespace-nowrap shadow-lg shadow-[#159A91]/30 transition-colors"
    >
      <Search className="w-4 h-4" />
      <span>Search</span>
    </motion.button>
  );

  return (
    <section
      onPointerMove={handleHeroPointer}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="relative isolate min-h-[640px] lg:min-h-[720px] pt-16 pb-24 flex items-center justify-center overflow-hidden bg-[#0E2038]">
      {/* Background slideshow */}
      <div className="absolute inset-0 -z-10">
        <motion.div className="absolute -inset-8" style={{ x: bgX, y: bgY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={slide}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_SLIDES[slide].src}
              alt=""
              className="w-full h-full object-cover object-center animate-ken-burns brightness-110 saturate-[1.15]"
              fetchPriority={slide === 0 ? "high" : "auto"}
            />
          </motion.div>
        </AnimatePresence>
        </motion.div>
        {/* Readability overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E2038]/60 via-[#142D4E]/40 to-[#0E2038]/85 dark:from-[#050B16]/70 dark:via-[#0A1424]/55 dark:to-[#0A1424]" />
        {/* Soft shade only behind the headline, so the photo stays bright around it */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,rgba(14,32,56,0.45),transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(21,154,145,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      {/* Floating glass cards (wide screens) */}
      <FloatingCard
        className="left-12 top-40"
        floatClass="animate-float"
        img="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=70"
        icon={<BadgeCheck className="w-3.5 h-3.5 text-[#2CC5B9]" />}
        title="Physically verified"
        subtitle="Inspected on-site by our team"
        delay={0.9}
        px={cardX}
        py={cardY}
      />
      <FloatingCard
        className="right-12 top-64"
        floatClass="animate-float-delayed"
        img="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=70"
        icon={<Star className="w-3.5 h-3.5 fill-[#E9A23B] text-[#E9A23B]" />}
        title="4.8 average rating"
        subtitle="From 12,000+ verified reviews"
        delay={1.1}
        px={cardX}
        py={cardY}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Pill badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#E7EDF3] text-xs font-semibold mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#2CC5B9] animate-pulse-ring" />
          <span>India&apos;s trusted accommodation discovery platform</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={item}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]"
        >
          Find the Right Stay,
          <br />
          <span className="text-gradient">Anywhere.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mt-5 text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
        >
          Discover verified PGs, boutique hotels, lodges, hostels and rooms near your preferred tech parks, metro stations
          and localities — with zero brokerage.
        </motion.p>

        {/* Search card */}
        <motion.div variants={item} className="relative z-30 mt-9 max-w-4xl mx-auto">
          <div className="relative z-40 rounded-[22px] p-[1px] bg-gradient-to-br from-white/60 via-white/20 to-[#2CC5B9]/50 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]">
            <div className="bg-white/95 dark:bg-[#0F1B2E]/90 backdrop-blur-xl p-3 sm:p-4 rounded-[21px]">
              {/* Search mode tabs + Near Me quick action */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1 p-1 w-fit rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-bold">
                  {(
                    [
                      { id: "location", label: "By location", icon: MapPin },
                      { id: "name", label: "By stay name", icon: Hotel },
                    ] as const
                  ).map((t) => {
                    const Icon = t.icon;
                    const active = mode === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setMode(t.id)}
                        className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
                          active ? "text-white" : "text-[#667A91] hover:text-[#142D4E] dark:hover:text-white"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="hero-search-tab"
                            className="absolute inset-0 rounded-lg bg-primary dark:bg-[#159A91] shadow"
                            transition={{ type: "spring", stiffness: 450, damping: 34 }}
                          />
                        )}
                        <Icon className="relative w-3.5 h-3.5" />
                        <span className="relative">{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleHeroNearMe}
                  disabled={isLocating}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E8F5F4] dark:bg-[#159A91]/20 hover:bg-[#159A91] hover:text-white text-[#159A91] text-xs font-extrabold border border-[#159A91]/40 transition-all active:scale-95 shadow-xs whitespace-nowrap"
                  title="Search verified stays closest to your live location"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
                  <span>{isLocating ? "Locating..." : "Near Me 📍"}</span>
                </button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {mode === "location" ? (
                  <motion.form
                    key="location"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-end"
                  >
                    {/* Location Input with Autocomplete */}
                    <div ref={searchRef} className="relative sm:col-span-2 md:col-span-4 text-left">
                      <label htmlFor="hero-location" className={labelCls}>
                        Where do you want to stay?
                      </label>
                      <div ref={locFieldRef} className={fieldBox}>
                        <MapPin className="w-4 h-4 text-[#159A91] shrink-0" />
                        <input
                          id="hero-location"
                          type="text"
                          autoComplete="off"
                          value={query}
                          onChange={(e) => {
                            setQuery(e.target.value);
                            if (!e.target.value) {
                              setSelectedCity("Hyderabad");
                              setSelectedLocality("");
                            }
                          }}
                          onFocus={() => {
                            if (suggestions.length > 0) setShowSuggestions(true);
                          }}
                          placeholder="City, locality or tech park"
                          className="w-full min-w-0 bg-transparent text-sm font-semibold text-[#142D4E] dark:text-white placeholder:text-slate-400 placeholder:font-medium focus:outline-none"
                        />
                        {query && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuery("");
                              setSelectedLocality("");
                              setShowSuggestions(false);
                            }}
                            className="shrink-0 text-xs text-[#667A91] hover:text-[#142D4E] dark:hover:text-white font-bold"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Suggestions Dropdown */}
                      <FloatingPortal anchorRef={locFieldRef} open={showSuggestions} floatingRef={locMenuRef}>
                      <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.18 }}
                            className="bg-white dark:bg-[#111F35] rounded-2xl shadow-dropdown border border-[#E7EDF3] dark:border-[#1E3150] py-2 overflow-hidden"
                          >
                            <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#667A91] flex items-center justify-between">
                              <span>Suggestions (Locations & Stays)</span>
                              <span className="text-[9px] text-[#159A91] font-semibold">Auto-detected</span>
                            </div>
                            <div className="max-h-[320px] overflow-y-auto">
                              {suggestions.map((s, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSelectSuggestion(s)}
                                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#E8F5F4] dark:hover:bg-white/10 transition-colors border-b border-[#E7EDF3]/50 last:border-0"
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    s.type === "property"
                                      ? "bg-[#FEF7EE] text-[#E9A23B]"
                                      : s.type === "sublocality"
                                        ? "bg-[#E8F5F4] text-[#159A91]"
                                        : "bg-[#F0F4F8] text-[#142D4E]"
                                  }`}>
                                    {s.type === "property" ? (
                                      <Bed className="w-4 h-4" />
                                    ) : (
                                      <MapPin className="w-4 h-4" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-bold text-[#142D4E] dark:text-white truncate">
                                        {s.name}
                                      </p>
                                      {s.category && (
                                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#E8F5F4] text-[#159A91]">
                                          {s.category}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-[#667A91] dark:text-slate-400 truncate">
                                      {s.type === "property"
                                        ? `Verified stay in ${s.locality}, ${s.city} • ₹${s.price?.toLocaleString("en-IN") || "8,500"}/mo`
                                        : s.type === "sublocality"
                                          ? `Sub-locality in ${s.locality || s.city}, ${s.city}`
                                          : s.type === "locality"
                                            ? `Locality in ${s.city}, ${s.state}`
                                            : `City in ${s.state}`}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      </FloatingPortal>
                    </div>

                    <div className="md:col-span-3">{categorySelect}</div>

                    {/* Budget */}
                    <div className="md:col-span-3 text-left">
                      <label htmlFor="hero-budget" className={labelCls}>
                        Budget
                      </label>
                      <FancySelect
                        id="hero-budget"
                        value={priceTier}
                        onChange={setPriceTier}
                        options={BUDGET_OPTIONS}
                        leadingIcon={<BadgeIndianRupee className="w-4 h-4 text-[#E9A23B] shrink-0" />}
                        buttonClassName={fieldBox}
                        labelClassName={selectLabelCls}
                        menuWidth="w-[250px]"
                        align="right"
                      />
                    </div>

                    <div className="sm:col-span-2 md:col-span-2"><Magnetic strength={0.18}>{submitButton}</Magnetic></div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="name"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNameSearch();
                    }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
                  >
                    {/* Property name input with live results */}
                    <div ref={nameRef} className="relative md:col-span-7 text-left">
                      <label htmlFor="hero-name" className={labelCls}>
                        PG, hostel or hotel name
                      </label>
                      <div ref={nameFieldRef} className={fieldBox}>
                        <Search className="w-4 h-4 text-[#159A91] shrink-0" />
                        <input
                          id="hero-name"
                          type="text"
                          autoComplete="off"
                          autoFocus
                          value={nameQuery}
                          onChange={(e) => setNameQuery(e.target.value)}
                          onFocus={() => nameQuery.trim().length >= 2 && setShowNameResults(true)}
                          onKeyDown={onNameKeyDown}
                          role="combobox"
                          aria-expanded={showNameResults}
                          placeholder="e.g. Urban Nest, Radisson, Zolo…"
                          className="w-full min-w-0 bg-transparent text-sm font-semibold text-[#142D4E] dark:text-white placeholder:text-slate-400 placeholder:font-medium focus:outline-none"
                        />
                        {nameQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setNameQuery("");
                              setShowNameResults(false);
                            }}
                            className="shrink-0 text-xs text-[#667A91] hover:text-[#142D4E] dark:hover:text-white font-bold"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <FloatingPortal anchorRef={nameFieldRef} open={showNameResults} floatingRef={nameMenuRef}>
                      <AnimatePresence>
                        {showNameResults && nameQuery.trim().length >= 2 && (
                          <StaySearchResults
                            query={nameQuery}
                            results={nameResults}
                            loading={nameLoading}
                            error={nameError}
                            highlight={highlight}
                            onHover={setHighlight}
                            onSelect={(p) => router.push(`/property/${p.slug}`)}
                            onSeeAll={handleNameSearch}
                            onSwitchToLocation={() => {
                              setMode("location");
                              setShowNameResults(false);
                            }}
                          />
                        )}
                      </AnimatePresence>
                      </FloatingPortal>
                    </div>

                    <div className="md:col-span-3">{categorySelect}</div>
                    <div className="md:col-span-2"><Magnetic strength={0.18}>{submitButton}</Magnetic></div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Locality Tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-[#E7EDF3]">
            <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-[#2CC5B9]" /> Trending in Hyderabad:
            </span>
            {["Gachibowli", "Madhapur", "Hitech City", "Kondapur", "Kukatpally", "Banjara Hills"].map((loc, i) => (
              <motion.button
                key={loc}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => {
                  setSelectedCity("Hyderabad");
                  setSelectedLocality(loc);
                  setQuery(`${loc}, Hyderabad`);
                  router.push(`/search?city=Hyderabad&locality=${encodeURIComponent(loc)}`);
                }}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#E7EDF3] border border-white/15 backdrop-blur-sm transition-colors"
              >
                {loc}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {AVATARS.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-[#142D4E]" />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#E9A23B] text-[#E9A23B]" />
                ))}
                <span className="ml-1.5 text-sm font-bold text-white">4.8/5</span>
              </div>
              <p className="text-xs text-slate-300">Trusted by 25,000+ tenants & travellers</p>
            </div>
          </div>
          <span className="hidden sm:block w-px h-10 bg-white/15" />
          <div className="grid grid-cols-2 sm:flex items-center gap-x-5 gap-y-2 text-slate-200">
            <Trust icon={<CheckCircle className="w-4 h-4 text-[#2CC5B9]" />} text="Zero brokerage" />
            <Trust icon={<ShieldCheck className="w-4 h-4 text-[#2CC5B9]" />} text="Verified listings" />
            <Trust icon={<MessageCircle className="w-4 h-4 text-[#E9A23B]" />} text="Direct host chat" />
            <Trust icon={<MapPin className="w-4 h-4 text-[#E7EDF3]" />} text="Exact map pins" />
          </div>
        </motion.div>
      </motion.div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.src}
            onClick={() => setSlide(i)}
            aria-label={`Show ${s.label}`}
            className="group relative h-1.5 rounded-full bg-white/25 overflow-hidden transition-all duration-500"
            style={{ width: i === slide ? 36 : 14 }}
          >
            {i === slide && (
              <motion.span
                key={`bar-${slide}`}
                className="absolute inset-y-0 left-0 bg-[#2CC5B9]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6.5, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

function Trust({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap">
      {icon}
      {text}
    </span>
  );
}

function FloatingCard({
  className,
  floatClass,
  img,
  icon,
  title,
  subtitle,
  delay,
  px,
  py,
}: {
  className: string;
  floatClass: string;
  img: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      style={{ x: px, y: py }}
      className={`hidden 2xl:block absolute z-10 ${className}`}
    >
      <div className={`${floatClass} w-56 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-2.5 shadow-2xl text-left`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" className="w-full h-24 object-cover rounded-xl" />
        <div className="px-1 pt-2.5 pb-0.5">
          <p className="flex items-center gap-1.5 text-sm font-bold text-white">
            {icon}
            {title}
          </p>
          <p className="text-[11px] text-slate-300 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
