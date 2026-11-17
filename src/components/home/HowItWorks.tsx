"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Compass, SlidersHorizontal, PhoneCall } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const STEPS = [
  {
    number: "01",
    title: "Search Your Location",
    desc: "Enter your target city, locality (like Gachibowli or Madhapur), tech park, or PIN code to find nearby stays.",
    icon: Search,
  },
  {
    number: "02",
    title: "Explore & Filter",
    desc: "Narrow down by category (PG, Hotel, Hostel, 1RK, Flat), gender preference, food inclusion, and budget.",
    icon: SlidersHorizontal,
  },
  {
    number: "03",
    title: "Compare Facilities",
    desc: "Inspect room sharing options, verified photos, house rules, real user ratings, and exact Google Maps positions.",
    icon: Compass,
  },
  {
    number: "04",
    title: "Connect with Host",
    desc: "Chat directly on WhatsApp, schedule a free on-site room inspection, or send an enquiry with zero broker fees.",
    icon: PhoneCall,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-canvas border-t border-[#E7EDF3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#159A91] bg-[#E8F5F4] px-3.5 py-1 rounded-full">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight mt-3">How StayHub Works</h2>
          <p className="mt-2 text-[#667A91] text-sm sm:text-base">
            Finding your ideal accommodation is now as frictionless as searching on Google Maps.
          </p>
        </Reveal>

        <div className="relative">
          {/* Animated connector line (desktop) */}
          <div className="hidden lg:block absolute top-[46px] left-[12%] right-[12%] h-0.5 bg-[#E7EDF3] dark:bg-[#1E3150] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#159A91] via-[#2CC5B9] to-[#E9A23B]"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
          </div>

          <Stagger className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.15}>
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <StaggerItem key={step.title} className="h-full">
                  <div className="relative h-full p-6 rounded-2xl bg-[#F7F8FA] border border-[#E7EDF3] hover:bg-white hover:shadow-card-hover hover:-translate-y-1 hover:border-[#159A91]/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-5">
                      <div className="relative w-12 h-12 rounded-2xl bg-primary dark:bg-[#1C3C66] group-hover:bg-[#159A91] flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-3xl font-black text-[#D2DCE6] dark:text-[#22385A] group-hover:text-[#159A91]/40 transition-colors">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#142D4E] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#667A91] leading-relaxed">{step.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
