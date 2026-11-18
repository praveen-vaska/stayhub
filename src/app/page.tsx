import React from "react";
import HeroSection from "@/components/home/HeroSection";
import TrustStats from "@/components/home/TrustStats";
import CategoryCarousel from "@/components/home/CategoryCarousel";
import PopularLocations from "@/components/home/PopularLocations";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyTrustUs from "@/components/home/WhyTrustUs";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import OwnerCTA from "@/components/home/OwnerCTA";
import { SEED_PROPERTIES } from "@/lib/db/seedData";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TrustStats />
      <CategoryCarousel />
      <PopularLocations />
      <FeaturedProperties properties={SEED_PROPERTIES} />
      <WhyTrustUs />
      <HowItWorks />
      <Testimonials />
      <OwnerCTA />
    </div>
  );
}
