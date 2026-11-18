"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export default function OwnerCTA() {
  return (
    <section className="py-24 bg-canvas-alt border-t border-[#E7EDF3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16 shadow-[0_30px_80px_-30px_rgba(20,45,78,0.6)] bg-[#0E2038]">
            {/* Background image + overlays */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=70"
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-10 w-full h-full object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0E2038] via-[#142D4E]/95 to-[#142D4E]/60" />
            <div className="absolute -top-24 -right-24 -z-10 w-96 h-96 rounded-full bg-[#159A91]/30 blur-3xl" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#159A91]/20 text-[#2CC5B9] border border-[#159A91]/30 mb-4">
                  Host Community
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Own a PG, Hotel or Rental Property?
                </h2>
                <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                  List your property on StayHub and connect directly with thousands of IT professionals, students, and
                  travelers searching for accommodation in your locality.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-200">
                  {["Zero Listing Commission", "Direct WhatsApp Inquiries", "Real-Time Host Dashboard"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2CC5B9] shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 shrink-0">
                <Link
                  href="/owner/add-property"
                  className="btn-shine inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#159A91] hover:bg-[#118079] text-white text-base font-bold shadow-lg shadow-[#159A91]/40 hover:-translate-y-0.5 transition-all whitespace-nowrap"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>List Your Property</span>
                </Link>
                <Link
                  href="/owner/dashboard"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 border border-white/15 backdrop-blur-sm transition-colors whitespace-nowrap"
                >
                  <span>Explore Host Portal</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
