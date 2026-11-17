import React from "react";
import Link from "next/link";
import { Shield, Globe } from "lucide-react";
import Logo from "@/components/common/Logo";

export default function Footer() {
  return (
    <footer className="bg-primary dark:bg-[#08111F] text-[#E7EDF3] pt-16 pb-12 border-t border-[#1C3C66] dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1C3C66]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              India&apos;s centralized accommodation discovery platform. Find verified PGs, boutique hotels, budget lodges, co-living hostels, and apartments with transparent pricing and live location mapping.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 text-xs text-[#E7EDF3] bg-[#0E2038] px-3 py-1.5 rounded-lg border border-white/10">
                <Shield className="w-3.5 h-3.5 text-[#159A91]" />
                100% Verified Stays
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#E7EDF3] bg-[#0E2038] px-3 py-1.5 rounded-lg border border-white/10">
                <Globe className="w-3.5 h-3.5 text-[#159A91]" />
                Multi-City Coverage
              </span>
            </div>
          </div>

          {/* Accommodation Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/search?category=PG" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  PG Accommodations
                </Link>
              </li>
              <li>
                <Link href="/search?category=Hotel" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Boutique Hotels
                </Link>
              </li>
              <li>
                <Link href="/search?category=Hostel" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Backpacker Hostels
                </Link>
              </li>
              <li>
                <Link href="/search?category=Apartment" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Serviced Apartments
                </Link>
              </li>
              <li>
                <Link href="/search?category=Lodge" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Budget Lodges
                </Link>
              </li>
              <li>
                <Link href="/search?category=Room" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  1RK & Studio Rooms
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Popular Cities</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/search?city=Hyderabad" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Hyderabad Stays
                </Link>
              </li>
              <li>
                <Link href="/search?city=Bengaluru" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Bengaluru Hubs
                </Link>
              </li>
              <li>
                <Link href="/search?city=Mumbai" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Mumbai Metro
                </Link>
              </li>
              <li>
                <Link href="/search?city=Pune" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Pune Tech Parks
                </Link>
              </li>
              <li>
                <Link href="/search?city=Chennai" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Chennai OMR
                </Link>
              </li>
              <li>
                <Link href="/search?city=Visakhapatnam" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Visakhapatnam
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Host Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Host & Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/owner/add-property" className="text-[#159A91] font-bold hover:underline">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/owner/dashboard" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Host Console
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="text-slate-300 hover:text-[#159A91] transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Terms & Conditions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 StayHub Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Hyderabad, Telangana</span>
            <span>•</span>
            <span className="text-slate-300">Google Maps Accurate Coordinates</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
