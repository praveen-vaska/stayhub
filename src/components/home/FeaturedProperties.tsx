"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Property } from "@/types";
import PropertyCard from "@/components/search/PropertyCard";
import EnquiryModal from "@/components/property/EnquiryModal";
import { ArrowRight, Flame } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/Interactive";

interface FeaturedPropertiesProps {
  properties: Property[];
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featured = properties.filter((p) => p.isFeatured).slice(0, 6);

  const handleContact = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  return (
    <section className="py-24 bg-canvas-alt border-t border-[#E7EDF3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FEF7EE] text-[#E9A23B] border border-[#E9A23B]/20 mb-3">
              <Flame className="w-3.5 h-3.5 fill-[#E9A23B] text-[#E9A23B]" />
              Top Rated Stays
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight">
              Featured Verified Accommodations
            </h2>
            <p className="mt-2 text-[#667A91] text-base max-w-xl">
              Handpicked coliving spaces, boutique hotels, and premium apartments with top ratings and transparent terms.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#159A91] hover:text-[#118079] transition-colors group shrink-0"
          >
            <span>Browse all properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
          {featured.map((prop) => (
            <StaggerItem key={prop.id} className="h-full">
              <TiltCard className="rounded-2xl" maxTilt={3} spotlightColor="rgba(21,154,145,0.10)">
                <PropertyCard property={prop} onContactClick={handleContact} />
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <EnquiryModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProperty(null);
        }}
      />
    </section>
  );
}
