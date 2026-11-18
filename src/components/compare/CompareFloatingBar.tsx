"use client";

import React from "react";
import { useCompare } from "@/lib/compare/context";
<<<<<<< HEAD
import { getAccommodationFallback } from "@/lib/utils/fallbackImages";
=======
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
import { X, ArrowRightLeft, Sparkles, Trash2 } from "lucide-react";

interface CompareFloatingBarProps {
  onOpenCompare: () => void;
}

export default function CompareFloatingBar({ onOpenCompare }: CompareFloatingBarProps) {
  const { compareProperties, removeFromCompare, clearCompare } = useCompare();

  if (compareProperties.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl animate-fade-in">
      <div className="bg-[#142D4E] text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-[#1C3C66] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left info & thumbnails */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto scrollbar-none py-0.5">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#159A91] flex items-center justify-center text-white">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block leading-none">
                Compare Stays ({compareProperties.length}/4)
              </span>
              <span className="text-[10px] text-slate-300">
                {compareProperties.length === 1 ? "Add 1 more stay to compare" : "Ready to compare"}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/20 shrink-0 hidden sm:block" />

          {/* Mini property chips */}
          <div className="flex items-center gap-2">
            {compareProperties.map((prop) => (
              <div
                key={prop.id}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-2 py-1 rounded-xl text-xs shrink-0 border border-white/10"
              >
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
                  className="w-5 h-5 rounded-md object-cover"
                />
                <span className="text-[11px] font-medium max-w-[80px] sm:max-w-[100px] truncate text-white">
                  {prop.title}
                </span>
                <button
                  onClick={() => removeFromCompare(prop.id)}
                  className="text-slate-400 hover:text-white p-0.5"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="p-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCompare}
            disabled={compareProperties.length < 1}
            className="px-4 py-2 rounded-xl bg-[#159A91] text-white text-xs font-bold hover:bg-[#118079] shadow-sm flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Compare Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
