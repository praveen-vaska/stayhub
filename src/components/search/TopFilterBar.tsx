"use client";

<<<<<<< HEAD
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
=======
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
import {
  Sparkles,
  Bed,
  Hotel,
  Compass,
  Home,
  Building,
  Map,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  Columns2,
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
<<<<<<< HEAD
  MapPin,
=======
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
} from "lucide-react";
import FancySelect, { type FancyOption } from "@/components/common/FancySelect";

interface TopFilterBarProps {
  category: string;
  onCategoryChange: (category: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  viewMode: "list" | "map" | "split";
  onViewModeChange: (mode: "list" | "map" | "split") => void;
  onOpenMobileFilters: () => void;
  /** Free-text search (property name, locality, address). */
  query: string;
  onQueryChange: (q: string) => void;
}

const SORT_OPTIONS: FancyOption[] = [
  { value: "recommended", label: "Recommended", hint: "Best match & featured", icon: Sparkles },
  { value: "price_asc", label: "Price: Low to High", hint: "Cheapest first", icon: TrendingUp },
  { value: "price_desc", label: "Price: High to Low", hint: "Premium first", icon: TrendingDown },
  { value: "rating_desc", label: "Highest Rated", hint: "Top reviewed stays", icon: Star },
  { value: "newest", label: "Recently Added", hint: "Newest listings", icon: Clock },
];

const CATEGORY_TABS = [
  { id: "All", label: "All Stays", icon: Sparkles },
  { id: "PG", label: "PGs & Coliving", icon: Bed },
  { id: "Hotel", label: "Hotels & Suites", icon: Hotel },
  { id: "Hostel", label: "Hostels", icon: Compass },
  { id: "Apartment", label: "Apartments", icon: Home },
  { id: "Lodge", label: "Lodges", icon: Building },
  { id: "Room", label: "1RK Rooms", icon: Bed },
];

export default function TopFilterBar({
  category,
  onCategoryChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
  query,
  onQueryChange,
}: TopFilterBarProps) {
<<<<<<< HEAD
  const router = useRouter();
  // Local input state, debounced into the parent so typing feels instant
  const [text, setText] = useState(query);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
=======
  // Local input state, debounced into the parent so typing feels instant
  const [text, setText] = useState(query);
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394

  useEffect(() => setText(query), [query]);

  useEffect(() => {
    if (text === query) return;
    const id = window.setTimeout(() => onQueryChange(text.trim()), 350);
    return () => window.clearTimeout(id);
  }, [text, query, onQueryChange]);

<<<<<<< HEAD
  // Autocomplete fetch for search bar
  useEffect(() => {
    if (text.trim().length > 1) {
      const timer = window.setTimeout(() => {
        fetch(`/api/locations/search?q=${encodeURIComponent(text.trim())}`)
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data.suggestions || []);
            setShowSuggestions(true);
          })
          .catch(() => setSuggestions([]));
      }, 250);
      return () => window.clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [text]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (s: any) => {
    if (s.type === "property" && s.slug) {
      router.push(`/property/${s.slug}`);
      setShowSuggestions(false);
      return;
    }
    setText(s.name);
    onQueryChange(s.name);
    setShowSuggestions(false);
  };

=======
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
  const viewBtn = (mode: "list" | "split" | "map") =>
    `relative flex items-center justify-center h-8 px-2 rounded-lg transition-colors ${
      viewMode === mode ? "text-[#142D4E] dark:text-white" : "text-[#667A91] hover:text-[#142D4E]"
    }`;

  return (
    <div className="bg-white rounded-2xl p-3 border border-[#E7EDF3] shadow-soft space-y-3">
      {/* Row 1: name search + controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-2.5">
<<<<<<< HEAD
        <div className="relative flex-1 min-w-0" ref={searchRef}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowSuggestions(false);
              onQueryChange(text.trim());
            }}
            className="flex items-center gap-2.5 h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] focus-within:border-[#159A91] focus-within:ring-4 focus-within:ring-[#159A91]/10 transition-all"
            role="search"
          >
            <Search className="w-4 h-4 text-[#159A91] shrink-0" />
            <input
              type="search"
              value={text}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onChange={(e) => setText(e.target.value)}
              placeholder="Search PGs, hostels, sub-localities (e.g. Anjaiah Nagar, DLF)…"
              aria-label="Search stays by name"
              className="w-full min-w-0 bg-transparent text-sm font-medium text-[#142D4E] placeholder:text-slate-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {text && (
              <button
                type="button"
                onClick={() => {
                  setText("");
                  onQueryChange("");
                  setShowSuggestions(false);
                }}
                className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[#667A91] hover:text-[#142D4E] hover:bg-[#E7EDF3] transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#111F35] rounded-2xl shadow-dropdown border border-[#E7EDF3] dark:border-[#1E3150] py-2 z-50 overflow-hidden max-h-[300px] overflow-y-auto"
              >
                <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#667A91] flex items-center justify-between border-b border-[#E7EDF3]/50">
                  <span>Suggested Stays & Sub-localities</span>
                  <span className="text-[9px] text-[#159A91] font-semibold">Instant match</span>
                </div>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#E8F5F4] dark:hover:bg-white/10 transition-colors border-b border-[#E7EDF3]/40 last:border-0"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        s.type === "property"
                          ? "bg-[#FEF7EE] text-[#E9A23B]"
                          : s.type === "sublocality"
                            ? "bg-[#E8F5F4] text-[#159A91]"
                            : "bg-[#F0F4F8] text-[#142D4E]"
                      }`}
                    >
                      {s.type === "property" ? (
                        <Bed className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#142D4E] dark:text-white truncate">
                          {s.name}
                        </p>
                        {s.category && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E8F5F4] text-[#159A91]">
                            {s.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#667A91] dark:text-slate-400 truncate">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
=======
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onQueryChange(text.trim());
          }}
          className="flex-1 min-w-0 flex items-center gap-2.5 h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] focus-within:border-[#159A91] focus-within:ring-4 focus-within:ring-[#159A91]/10 transition-all"
          role="search"
        >
          <Search className="w-4 h-4 text-[#159A91] shrink-0" />
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search PGs, hostels, hotels by name or area…"
            aria-label="Search stays by name"
            className="w-full min-w-0 bg-transparent text-sm font-medium text-[#142D4E] placeholder:text-slate-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {text && (
            <button
              type="button"
              onClick={() => {
                setText("");
                onQueryChange("");
              }}
              className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[#667A91] hover:text-[#142D4E] hover:bg-[#E7EDF3] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394

        <div className="flex items-center justify-between md:justify-end gap-2">
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-1.5 h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-xs font-bold text-[#142D4E] whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#159A91]" />
            <span>Filters</span>
          </button>

          <div className="w-[190px]">
            <FancySelect
              value={sort}
              onChange={onSortChange}
              options={SORT_OPTIONS}
              ariaLabel="Sort by"
              leadingIcon={<ArrowUpDown className="w-3.5 h-3.5 text-[#159A91] shrink-0" />}
              buttonClassName="h-11 px-3 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] hover:border-[#C9D5E1] transition-all"
              labelClassName="text-xs font-bold text-[#142D4E]"
              menuWidth="w-[240px]"
              align="right"
            />
          </div>

          <div className="flex items-center h-11 bg-[#F7F8FA] border border-[#E7EDF3] p-1 rounded-xl">
            {(
              [
                { mode: "list", icon: List, title: "List view", cls: "" },
                { mode: "split", icon: Columns2, title: "List & map", cls: "hidden lg:flex" },
                { mode: "map", icon: Map, title: "Map view", cls: "" },
              ] as const
            ).map(({ mode, icon: Icon, title, cls }) => (
              <button key={mode} onClick={() => onViewModeChange(mode)} className={`${viewBtn(mode)} ${cls}`} title={title} aria-label={title}>
                {viewMode === mode && (
                  <motion.span
                    layoutId="view-mode-pill"
                    className="absolute inset-0 rounded-lg bg-white dark:bg-[#1A2B45] shadow-sm border border-[#E7EDF3]"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <Icon className="relative w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: category pills (scrollable on small screens) */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-0.5">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = category.toLowerCase() === tab.id.toLowerCase();
          return (
            <button
              key={tab.id}
              onClick={() => onCategoryChange(tab.id)}
              className={`relative shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors duration-150 border ${
                isActive
                  ? "text-white border-transparent"
                  : "bg-[#F7F8FA] text-[#667A91] hover:bg-[#E7EDF3] hover:text-[#142D4E] border-[#E7EDF3]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-xl bg-primary dark:bg-[#159A91] shadow-sm"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon className={`relative w-3.5 h-3.5 ${isActive ? "text-[#2CC5B9] dark:text-white" : "text-slate-400"}`} />
              <span className="relative">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
