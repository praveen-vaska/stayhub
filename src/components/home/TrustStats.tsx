"use client";

import React from "react";
import { Building2, MapPinned, Star, Users } from "lucide-react";
import { CountUp, Stagger, StaggerItem } from "@/components/motion/Reveal";

const STATS = [
  { icon: Building2, value: 1590, suffix: "+", label: "Verified listings" },
  { icon: Users, value: 25000, suffix: "+", label: "Happy tenants" },
  { icon: MapPinned, value: 7, suffix: "", label: "Cities covered" },
  { icon: Star, value: 4.8, suffix: "/5", label: "Average rating", decimals: 1 },
];

/** Overlaps the bottom of the hero with a floating stats card. */
export default function TrustStats() {
  return (
    <section className="relative z-20 -mt-12 px-4 sm:px-6 lg:px-8">
      <Stagger
        stagger={0.1}
        className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 rounded-3xl bg-white dark:bg-[#111F35] border border-[#E7EDF3] dark:border-[#1E3150] shadow-[0_24px_60px_-24px_rgba(20,45,78,0.35)] divide-x divide-y lg:divide-y-0 divide-[#E7EDF3] dark:divide-[#1E3150] overflow-hidden"
      >
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <StaggerItem key={s.label} className="group flex items-center gap-4 p-5 sm:p-7">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#E8F5F4] text-[#159A91] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#142D4E]">
                  <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#667A91]">{s.label}</p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
