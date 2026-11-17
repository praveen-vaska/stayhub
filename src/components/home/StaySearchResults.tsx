"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, SearchX, Star, AlertTriangle } from "lucide-react";
import type { Property } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";

const CATEGORY_STYLES: Record<string, string> = {
  PG: "bg-[#159A91]/10 text-[#118079] dark:text-[#2CC5B9]",
  Hotel: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  Hostel: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Lodge: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  Apartment: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Room: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

/** Bold the parts of `text` that match words in `query`. */
function Highlight({ text, query }: { text: string; query: string }) {
  const words = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (words.length === 0) return <>{text}</>;
  const parts = text.split(new RegExp(`(${words.join("|")})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-[#159A91]/15 text-inherit rounded px-0.5">
            {p}
          </mark>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  );
}

interface Props {
  query: string;
  results: Property[];
  loading: boolean;
  error: boolean;
  highlight: number;
  onHover: (i: number) => void;
  onSelect: (p: Property) => void;
  onSeeAll: () => void;
  onSwitchToLocation: () => void;
}

export default function StaySearchResults({
  query,
  results,
  loading,
  error,
  highlight,
  onHover,
  onSelect,
  onSeeAll,
  onSwitchToLocation,
}: Props) {
  const q = query.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-full md:w-[min(600px,calc(100vw-3rem))] origin-top rounded-2xl bg-white dark:bg-[#0F1B2E] border border-[#E7EDF3] dark:border-[#1E3150] shadow-[0_24px_60px_-15px_rgba(10,20,36,0.45)] overflow-hidden text-left"
      role="listbox"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#667A91] dark:text-slate-400">
          {loading ? "Searching stays…" : error ? "Search unavailable" : results.length ? `${results.length} matching stays` : "No matches"}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#667A91] dark:text-slate-400">
          <MapPin className="w-3 h-3 text-[#159A91]" /> Listings + Google Maps
        </span>
      </div>

      {/* Body */}
      {loading ? (
        <div className="px-2 pb-2 space-y-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-14 h-14 rounded-xl skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-3/5 rounded-full skeleton" />
                <div className="h-3 w-2/5 rounded-full skeleton" />
              </div>
              <div className="h-4 w-16 rounded-full skeleton" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="px-6 pb-6 pt-2 text-center">
          <div className="mx-auto w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-[#142D4E] dark:text-white">Couldn&apos;t reach search right now</p>
          <p className="text-xs text-[#667A91] dark:text-slate-400 mt-1">Check your connection and try again.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="px-6 pb-6 pt-2 text-center">
          <div className="mx-auto w-11 h-11 rounded-full bg-[#E8F5F4] dark:bg-[#159A91]/15 flex items-center justify-center text-[#159A91] mb-2">
            <SearchX className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-[#142D4E] dark:text-white">No stays named &ldquo;{q}&rdquo;</p>
          <p className="text-xs text-[#667A91] dark:text-slate-400 mt-1">
            Check the spelling, try fewer words, or search by area.
          </p>
          <button
            type="button"
            onClick={onSwitchToLocation}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#159A91] text-white hover:bg-[#118079] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" /> Search by location
          </button>
        </div>
      ) : (
        <ul className="px-2 pb-2 max-h-[360px] overflow-y-auto">
          {results.map((p, i) => {
            const active = i === highlight;
            const google = p.ownerId === "google_verified_partner";
            return (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035, duration: 0.22 }}
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => onHover(i)}
                  onClick={() => onSelect(p)}
                  className={`group w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                    active ? "bg-[#F0FAF9] dark:bg-white/[0.06]" : ""
                  }`}
                >
                  <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.coverImage || p.images?.[0]}
                      alt=""
                      loading="lazy"
                      className={`w-full h-full object-cover transition-transform duration-500 ${active ? "scale-110" : ""}`}
                      onError={(e) => ((e.currentTarget.style.visibility = "hidden"))}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#142D4E] dark:text-white truncate">
                      <Highlight text={p.title} query={q} />
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#667A91] dark:text-slate-400 min-w-0">
                      <span className={`shrink-0 px-1.5 py-0.5 rounded-md font-bold ${CATEGORY_STYLES[p.category] || CATEGORY_STYLES.PG}`}>
                        {p.category}
                      </span>
                      <span className="truncate">
                        {p.locality}, {p.city}
                      </span>
                      {google && <BadgeCheck className="w-3.5 h-3.5 shrink-0 text-[#159A91]" aria-label="On Google Maps" />}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-extrabold text-[#142D4E] dark:text-white whitespace-nowrap">
                      {formatPrice(p.price, p.pricingType)}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#667A91] dark:text-slate-400">
                      <Star className="w-3 h-3 fill-[#E9A23B] text-[#E9A23B]" /> {p.rating}
                      <span className="font-normal">({p.reviewCount})</span>
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                      active ? "text-[#159A91] translate-x-0 opacity-100" : "text-slate-300 -translate-x-1 opacity-0"
                    }`}
                  />
                </button>
              </motion.li>
            );
          })}
        </ul>
      )}

      {/* Footer */}
      {!loading && !error && results.length > 0 && (
        <button
          type="button"
          onClick={onSeeAll}
          className="group w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-[#159A91] bg-[#F7F8FA] dark:bg-white/[0.03] hover:bg-[#F0FAF9] dark:hover:bg-white/[0.06] border-t border-[#E7EDF3] dark:border-[#1E3150] transition-colors"
        >
          <span>See all results for &ldquo;{q}&rdquo;</span>
          <span className="inline-flex items-center gap-2 text-[#667A91] dark:text-slate-400 font-medium">
            <kbd className="px-1.5 py-0.5 rounded border border-[#E7EDF3] dark:border-[#1E3150] text-[10px]">↑↓</kbd>
            navigate
            <ArrowRight className="w-3.5 h-3.5 text-[#159A91] transition-transform group-hover:translate-x-0.5" />
          </span>
        </button>
      )}
    </motion.div>
  );
}
