"use client";

import React, { useId } from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";

/** StayHub mark: a house outline whose doorway is a map pin — "verified stays, exactly located". */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id={`bg-${id}`} x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2CC5B9" />
          <stop offset="1" stopColor="#0E7C74" />
        </linearGradient>
        <linearGradient id={`shine-${id}`} x1="20" y1="0" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#bg-${id})`} />
      <rect width="40" height="20" rx="12" fill={`url(#shine-${id})`} />
      {/* Roof */}
      <path d="M8.5 19.5 20 10l11.5 9.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Walls */}
      <path d="M12 17.5V29a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 28 29V17.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Pin doorway */}
      <path
        d="M20 30.5s-4.2-4.1-4.2-7.3a4.2 4.2 0 1 1 8.4 0c0 3.2-4.2 7.3-4.2 7.3Z"
        fill="#E9A23B"
      />
      <circle cx="20" cy="23.1" r="1.6" fill="#fff" />
    </svg>
  );
}

interface LogoProps {
  /** Show the "ACCOMMODATION" tagline under the wordmark. */
  tagline?: boolean;
  className?: string;
}

export default function Logo({ tagline = true, className = "" }: LogoProps) {
  return (
    <NextLink href="/" aria-label="StayHub home" className={`group inline-flex items-center gap-3 shrink-0 ${className}`}>
      <motion.span
        whileHover={{ rotate: -6, scale: 1.06 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="flex rounded-xl shadow-lg shadow-[#159A91]/30"
      >
        <LogoMark />
      </motion.span>
      <span className="flex flex-col justify-center leading-none">
        <span className="text-[22px] font-extrabold tracking-[-0.03em] text-white">
          Stay<span className="text-[#2CC5B9]">Hub</span>
        </span>
        {tagline && (
          <span className="hidden sm:flex items-center gap-1.5 mt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.24em] text-slate-300/90">
            <span className="h-px w-3 bg-[#E9A23B]" />
            Accommodation
          </span>
        )}
      </span>
    </NextLink>
  );
}
