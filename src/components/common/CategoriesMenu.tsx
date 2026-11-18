"use client";

import React, { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bed, Building, ChevronDown, Compass, Home, Hotel, Sparkles, type LucideIcon } from "lucide-react";

export interface CategoryItem {
  name: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  count: string;
  image: string;
}

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=75`;

export const CATEGORY_ITEMS: CategoryItem[] = [
  { name: "All Stays", desc: "Every verified listing in one place", href: "/search", icon: Sparkles, count: "1,590+ stays", image: img("photo-1542314831-068cd1dbfeeb") },
  { name: "PG Accommodation", desc: "Coliving with meals, Wi‑Fi & housekeeping", href: "/search?category=PG", icon: Bed, count: "450+ listings", image: img("photo-1555854877-bab0e564b8d5") },
  { name: "Hotels & Suites", desc: "Boutique & business stays, 24/7 service", href: "/search?category=Hotel", icon: Hotel, count: "280+ properties", image: img("photo-1566073771259-6a8506099945") },
  { name: "Backpacker Hostels", desc: "Social, budget-friendly bunk pods", href: "/search?category=Hostel", icon: Compass, count: "120+ stays", image: img("photo-1590490360182-c33d57733427") },
  { name: "Budget Lodges", desc: "Affordable rooms near stations & hubs", href: "/search?category=Lodge", icon: Building, count: "190+ lodges", image: img("photo-1582719478250-c89cae4dc85b") },
  { name: "Apartments & Flats", desc: "1–3 BHK homes in gated communities", href: "/search?category=Apartment", icon: Home, count: "310+ homes", image: img("photo-1502672260266-1c1ef2d93688") },
  { name: "Rental Rooms (1RK)", desc: "Private studios with attached bath", href: "/search?category=Room", icon: Bed, count: "240+ units", image: img("photo-1522771739844-6a9f6d5f14af") },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Desktop "Categories" mega-menu: list on the left, live photo preview on the right. Opens on hover or click. */
export default function CategoriesMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>();

  const openNow = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Warm the preview images once so hovering swaps instantly
  useEffect(() => {
    if (!open) return;
    CATEGORY_ITEMS.forEach((c) => {
      const i = new Image();
      i.src = c.image;
    });
  }, [open]);

  const current = CATEGORY_ITEMS[active];

  return (
    <div ref={wrapRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
          open ? "text-white bg-white/10" : "text-[#E7EDF3] hover:text-white hover:bg-white/5"
        }`}
      >
        Categories
        <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            // pt-3 is an invisible hover bridge between the button and the panel
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 origin-top"
          >
            <div className="w-[680px] rounded-3xl bg-white dark:bg-[#0F1B2E] border border-[#E7EDF3] dark:border-[#1E3150] shadow-[0_30px_70px_-20px_rgba(10,20,36,0.45)] overflow-hidden">
              <div className="grid grid-cols-[1fr_250px]">
                {/* List */}
                <ul className="p-2.5" onMouseLeave={() => setActive((a) => a)}>
                  {CATEGORY_ITEMS.map((c, i) => {
                    const Icon = c.icon;
                    const isActive = active === i;
                    return (
                      <motion.li
                        key={c.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * i, duration: 0.25, ease: EASE }}
                      >
                        <NextLink
                          href={c.href}
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                          onClick={() => setOpen(false)}
                          className="relative flex items-center gap-3 px-3 py-2.5 rounded-2xl outline-none"
                        >
                          {isActive && (
                            <motion.span
                              layoutId="cat-menu-hover"
                              className="absolute inset-0 rounded-2xl bg-[#F0FAF9] dark:bg-white/[0.06] ring-1 ring-[#159A91]/15"
                              transition={{ type: "spring", stiffness: 500, damping: 38 }}
                            />
                          )}
                          <span
                            className={`relative w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              isActive
                                ? "bg-[#159A91] text-white shadow-md shadow-[#159A91]/30 scale-105"
                                : "bg-[#E8F5F4] dark:bg-[#159A91]/15 text-[#159A91]"
                            }`}
                          >
                            <Icon className="w-[18px] h-[18px]" />
                          </span>
                          <span className="relative min-w-0 flex-1">
                            <span className="block text-sm font-bold text-[#142D4E] dark:text-white">{c.name}</span>
                            <span className="block text-xs text-[#667A91] dark:text-slate-400 truncate">{c.desc}</span>
                          </span>
                          <ArrowRight
                            className={`relative w-4 h-4 shrink-0 text-[#159A91] transition-all duration-300 ${
                              isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                            }`}
                          />
                        </NextLink>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Preview */}
                <div className="relative m-2.5 ml-0 rounded-2xl overflow-hidden bg-[#0E2038] min-h-[360px]">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={current.image}
                      src={current.image}
                      alt=""
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1424] via-[#0A1424]/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={current.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25, ease: EASE }}
                      >
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/15 backdrop-blur-md text-white border border-white/20">
                          {current.count}
                        </span>
                        <p className="mt-2 text-lg font-extrabold text-white leading-tight">{current.name}</p>
                        <p className="mt-1 text-xs text-slate-300 leading-relaxed">{current.desc}</p>
                      </motion.div>
                    </AnimatePresence>
                    <NextLink
                      href={current.href}
                      onClick={() => setOpen(false)}
                      className="group btn-shine mt-4 w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-[#159A91] hover:bg-[#118079] text-white text-sm font-bold transition-colors"
                    >
                      Browse stays
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </NextLink>
                  </div>
                </div>
              </div>

              {/* Footer strip */}
              <div className="flex items-center justify-between px-5 py-3 bg-[#F7F8FA] dark:bg-white/[0.03] border-t border-[#E7EDF3] dark:border-[#1E3150] text-xs">
                <span className="text-[#667A91] dark:text-slate-400">Every listing is verified on-site · zero brokerage</span>
                <NextLink
                  href="/search"
                  onClick={() => setOpen(false)}
                  className="group inline-flex items-center gap-1 font-bold text-[#159A91] hover:text-[#118079]"
                >
                  Explore all
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </NextLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
