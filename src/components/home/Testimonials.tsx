"use client";

import React from "react";
import { Quote, Star, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

// NOTE: placeholder testimonials for the demo — replace with real, consented resident reviews before launch.
const TESTIMONIALS = [
  {
    name: "Ananya R.",
    role: "Software Engineer · Gachibowli PG",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    text: "Moved from Pune with two days' notice. The photos matched the room exactly and I talked to the owner directly — no broker, no drama.",
  },
  {
    name: "Rahul M.",
    role: "MBA Student · Kondapur",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    text: "Comparing three PGs side by side saved me a weekend of visits. Food and Wi-Fi details were spot on.",
  },
  {
    name: "Sneha K.",
    role: "Consultant · Hitech City Hotel",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    text: "I book business stays here every month. Transparent prices and the map pins are actually accurate.",
  },
  {
    name: "Arjun P.",
    role: "Product Designer · Madhapur flat",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    text: "Found a 2BHK in a gated community within a week. The verified badge gave my parents real peace of mind.",
  },
  {
    name: "Divya S.",
    role: "Nursing Student · Ameerpet hostel",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    text: "Women-only filter plus genuine reviews from other residents — exactly what I needed to feel safe.",
  },
];

function Card({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure className="w-[320px] sm:w-[380px] shrink-0 p-6 rounded-2xl bg-white border border-[#E7EDF3] shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="w-4 h-4 fill-[#E9A23B] text-[#E9A23B]" />
          ))}
        </div>
        <Quote className="w-7 h-7 text-[#159A91]/25" />
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed text-[#374A60]">&ldquo;{t.text}&rdquo;</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.avatar} alt="" loading="lazy" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E8F5F4] dark:ring-[#1E3150]" />
        <div>
          <p className="flex items-center gap-1 text-sm font-bold text-[#142D4E]">
            {t.name} <BadgeCheck className="w-4 h-4 text-[#159A91]" />
          </p>
          <p className="text-xs text-[#667A91]">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="py-24 bg-canvas-alt border-t border-[#E7EDF3] overflow-hidden">
      <Reveal className="text-center max-w-2xl mx-auto px-4 mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FEF7EE] text-[#E9A23B] border border-[#E9A23B]/20">
          <Star className="w-3.5 h-3.5 fill-[#E9A23B]" /> Resident stories
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight">
          Loved by people who&apos;ve moved in
        </h2>
        <p className="mt-3 text-[#667A91]">Reviews are collected only from verified residents after their stay.</p>
      </Reveal>

      {/* Infinite marquee, pauses on hover */}
      <div className="group relative [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max gap-6 px-3 py-3 animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <Card key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
