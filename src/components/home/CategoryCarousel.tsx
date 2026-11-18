"use client";

import React from "react";
import Link from "next/link";
import { Bed, Hotel, Building, Compass, Home, Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import SmartImage from "@/components/common/SmartImage";
import { TiltCard } from "@/components/motion/Interactive";

const CATEGORIES = [
  {
    name: "PG Accommodation",
    slug: "PG",
    tagline: "Coliving spaces with home-cooked meals & high-speed Wi-Fi",
    icon: Bed,
    count: "450+ Listings",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Hotels & Suites",
    slug: "Hotel",
    tagline: "Boutique stays, 24/7 room service & prime business locations",
    icon: Hotel,
    count: "280+ Properties",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Backpacker Hostels",
    slug: "Hostel",
    tagline: "Bunk pods, community lounges, gaming zones & shared vibes",
    icon: Compass,
    count: "120+ Stays",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Apartments & Flats",
    slug: "Apartment",
    tagline: "1, 2 & 3 BHK gated communities with amenities & parking",
    icon: Home,
    count: "310+ Homes",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Budget Lodges",
    slug: "Lodge",
    tagline: "Affordable rooms near railway stations & coaching hubs",
    icon: Building,
    count: "190+ Lodges",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Rental Rooms (1RK)",
    slug: "Room",
    tagline: "Independent studio units with private bath & kitchenettes",
    icon: Sparkles,
    count: "240+ Units",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
  },
];

export default function CategoryCarousel() {
  return (
    <section className="pt-28 pb-24 bg-canvas-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8F5F4] text-[#159A91] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Tailored For Every Requirement
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight">
              Popular Accommodation Types
            </h2>
            <p className="mt-2 text-[#667A91] text-base max-w-xl">
              From executive coliving PGs to boutique hotel suites, select your category to discover verified listings.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#159A91] hover:text-[#118079] transition-colors group shrink-0"
          >
            Explore all categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.07}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <StaggerItem key={cat.name}>
                <TiltCard className="rounded-3xl" maxTilt={5}>
                <Link
                  href={`/search?category=${cat.slug}`}
                  className="group relative block h-80 rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover ring-1 ring-black/5 dark:ring-white/5 transition-all duration-500 hover:-translate-y-1.5"
                >
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    wrapperClassName="absolute inset-0"
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2038] via-[#142D4E]/40 to-transparent transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-[#159A91]/0 group-hover:bg-[#159A91]/10 transition-colors duration-500" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 transition-all duration-300 group-hover:bg-[#159A91] group-hover:border-[#159A91]">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/30 backdrop-blur-md text-white border border-white/15">
                        {cat.count}
                      </span>
                    </div>

                    <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <h3 className="text-xl font-bold tracking-tight mb-1 text-white">{cat.name}</h3>
                      <p className="text-sm text-slate-200/90 line-clamp-2 leading-relaxed">{cat.tagline}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#2CC5B9] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        View stays <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
