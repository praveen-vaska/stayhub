"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, BadgeIndianRupee, Camera, Headphones, ArrowRight, BadgeCheck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import SmartImage from "@/components/common/SmartImage";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "On-site verification",
    desc: "Every listing is visited and checked against its photos, amenities and safety basics before it goes live.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Transparent pricing",
    desc: "Rent, deposit and maintenance shown upfront. No brokerage, no hidden charges at move-in.",
  },
  {
    icon: Camera,
    title: "Real photos & reviews",
    desc: "Photos taken at the property and reviews only from residents who actually stayed there.",
  },
  {
    icon: Headphones,
    title: "Support that answers",
    desc: "A real team on chat and phone to help with visits, disputes or anything that doesn't match.",
  },
];

export default function WhyTrustUs() {
  return (
    <section className="py-24 bg-canvas border-t border-[#E7EDF3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Image collage */}
        <Reveal direction="right" className="relative order-2 lg:order-1">
          <div className="grid grid-cols-5 grid-rows-6 gap-4 h-[460px] sm:h-[520px]">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} className="col-span-3 row-span-4 rounded-3xl overflow-hidden shadow-card">
              <SmartImage
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80"
                alt="Bright, furnished apartment living room"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} className="col-span-2 row-span-3 rounded-3xl overflow-hidden shadow-card">
              <SmartImage
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
                alt="Clean private room with bed"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} className="col-span-2 row-span-3 rounded-3xl overflow-hidden shadow-card">
              <SmartImage
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
                alt="Hotel room interior"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} className="col-span-3 row-span-2 rounded-3xl overflow-hidden shadow-card">
              <SmartImage
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80"
                alt="Lodge room"
              />
            </motion.div>
          </div>

          {/* Floating verification badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-6 left-6 sm:left-10 animate-float"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-[#111F35] border border-[#E7EDF3] px-4 py-3 shadow-[0_20px_50px_-15px_rgba(20,45,78,0.35)]">
              <div className="w-10 h-10 rounded-full bg-[#159A91] flex items-center justify-center text-white">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#142D4E]">StayHub Verified</p>
                <p className="text-xs text-[#667A91]">27-point quality checklist</p>
              </div>
            </div>
          </motion.div>
        </Reveal>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8F5F4] text-[#159A91] mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Why people trust StayHub
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142D4E] tracking-tight leading-tight">
              No surprises when you <span className="text-[#159A91]">move in.</span>
            </h2>
            <p className="mt-4 text-[#667A91] text-base sm:text-lg leading-relaxed max-w-xl">
              We built StayHub so that what you see online is exactly what you get at the door — verified rooms, honest
              prices and hosts you can talk to directly.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid sm:grid-cols-2 gap-5" stagger={0.1}>
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <StaggerItem key={p.title}>
                  <div className="group h-full p-5 rounded-2xl border border-[#E7EDF3] bg-[#F7F8FA] hover:bg-white hover:border-[#159A91]/30 hover:shadow-card transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#159A91]/15 border border-[#E7EDF3] flex items-center justify-center text-[#159A91] mb-3 transition-all duration-300 group-hover:bg-[#159A91] group-hover:text-white group-hover:border-[#159A91]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-[#142D4E]">{p.title}</h3>
                    <p className="mt-1 text-sm text-[#667A91] leading-relaxed">{p.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          <Reveal delay={0.2}>
            <Link
              href="/search"
              className="group btn-shine mt-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary dark:bg-[#159A91] text-white text-sm font-bold shadow-lg shadow-[#142D4E]/20 hover:-translate-y-0.5 transition-all"
            >
              Browse verified stays
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
