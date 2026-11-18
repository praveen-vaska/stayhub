"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { SEED_CITIES } from "@/lib/db/seedData";
import { Reveal } from "@/components/motion/Reveal";

// Ambient backdrop per city (interior photography keeps it on-brand).
const CITY_BACKDROPS = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=70",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=70",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=70",
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=70",
];

export default function PopularLocations() {
  const [activeCity, setActiveCity] = useState("Hyderabad");

  const cityIndex = Math.max(0, SEED_CITIES.findIndex((c) => c.name === activeCity));
  const currentCityData = SEED_CITIES[cityIndex];

  return (
    <section className="py-24 bg-canvas border-t border-[#E7EDF3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8F5F4] text-[#159A91] mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Popular Cities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight">
            Explore Prime Tech & Student Hubs
          </h2>
          <p className="mt-2 text-[#667A91] text-sm sm:text-base">
            Select a city to discover all registered PGs, hostels, hotels, and apartments in its key localities.
          </p>
        </Reveal>

        {/* City tabs with sliding indicator */}
        <Reveal delay={0.1}>
          <div className="flex justify-center">
            <div className="inline-flex max-w-full items-center gap-1 p-1.5 rounded-2xl bg-[#F7F8FA] border border-[#E7EDF3] overflow-x-auto scrollbar-none">
              {SEED_CITIES.map((city) => {
                const active = activeCity === city.name;
                return (
                  <button
                    key={city.name}
                    onClick={() => setActiveCity(city.name)}
                    className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                      active ? "text-white" : "text-[#667A91] hover:text-[#142D4E]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="city-tab"
                        className="absolute inset-0 rounded-xl bg-primary dark:bg-[#159A91] shadow-md"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{city.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* City spotlight */}
        <Reveal delay={0.15} className="mt-8">
          <div className="relative isolate rounded-3xl overflow-hidden p-6 sm:p-10 text-white shadow-card bg-[#0E2038]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={currentCityData.name}
                src={CITY_BACKDROPS[cityIndex % CITY_BACKDROPS.length]}
                alt=""
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 -z-10 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0E2038]/95 via-[#142D4E]/90 to-[#142D4E]/70" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentCityData.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2CC5B9]">
                      {currentCityData.country} • {currentCityData.state}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                      Stays in {currentCityData.name}
                    </h3>
                    <p className="mt-2 text-slate-300 text-sm max-w-xl">
                      Browse verified stays across {currentCityData.name}. Pick a locality to narrow your search, or view
                      every option in the city.
                    </p>
                  </div>

                  <Link
                    href={`/search?city=${encodeURIComponent(currentCityData.name)}`}
                    className="group btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#159A91] hover:bg-[#118079] text-white text-sm font-bold shadow-lg shadow-[#159A91]/30 transition-all self-start whitespace-nowrap"
                  >
                    <span>View all in {currentCityData.name}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                <div className="mt-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    {currentCityData.localities.length} localities in {currentCityData.name}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {currentCityData.localities.map((locality, i) => (
                      <motion.div
                        key={locality}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + i * 0.03, duration: 0.3 }}
                      >
                        <Link
                          href={`/search?city=${encodeURIComponent(currentCityData.name)}&locality=${encodeURIComponent(locality)}`}
                          className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-sm border border-white/10 hover:border-[#2CC5B9]/40 transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-6 h-6 shrink-0 rounded-md bg-[#159A91]/25 flex items-center justify-center text-[#2CC5B9] group-hover:bg-[#159A91] group-hover:text-white transition-colors">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">{locality}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-[#2CC5B9] group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
