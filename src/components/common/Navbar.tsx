"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/auth/context";
import { useCompare } from "@/lib/compare/context";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Logo from "@/components/common/Logo";
import CategoriesMenu, { CATEGORY_ITEMS } from "@/components/common/CategoriesMenu";
import {
  Compass,
  Heart,
  Menu,
  X,
  PlusCircle,
  ArrowRightLeft,
} from "lucide-react";

const CATEGORIES = CATEGORY_ITEMS;

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/search" },
  { name: "PGs", href: "/search?category=PG" },
  { name: "Hotels", href: "/search?category=Hotel" },
  { name: "Flats", href: "/search?category=Apartment" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { wishlistIds } = useAuth();
  const { compareProperties, setIsCompareModalOpen } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const activeHref = pathname === "/" ? "/" : pathname.startsWith("/search") ? "/search" : null;

  const iconBtn =
    "relative w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-[#E7EDF3] hover:text-white hover:bg-white/10 active:scale-95 transition-all";

  return (
    <header
      className={`sticky top-0 z-50 w-full text-white transition-all duration-300 backdrop-blur-xl backdrop-saturate-150 ${scrolled
        ? "bg-[#142D4E]/90 dark:bg-[#0A1424]/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.45)] border-b border-white/10"
        : "bg-[#142D4E] dark:bg-[#0A1424] border-b border-white/[0.06]"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-[72px]">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
            {NAV_LINKS.slice(0, 2).map((link) => (
              <NavPill key={link.href} href={link.href} active={activeHref === link.href}>
                {link.name}
              </NavPill>
            ))}

            <CategoriesMenu />

            {NAV_LINKS.slice(2).map((link) => (
              <NavPill key={link.href} href={link.href} active={false}>
                {link.name}
              </NavPill>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle />

            <button onClick={() => setIsCompareModalOpen(true)} className={`${iconBtn} hidden sm:flex`} title="Compare stays" aria-label="Compare stays">
              <ArrowRightLeft className="w-5 h-5" />
              <CountBadge count={compareProperties.length} className="bg-[#159A91]" />
            </button>

            <NextLink href="/dashboard?tab=wishlist" className={iconBtn} title="Saved stays" aria-label="Saved stays">
              <Heart className="w-5 h-5" />
              <CountBadge count={wishlistIds.length} className="bg-[#E9A23B]" />
            </NextLink>

            {/* List Property Button — single line, never wraps */}
            <NextLink
              href="/owner/add-property"
              className="btn-shine hidden lg:inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-bold whitespace-nowrap bg-[#159A91] text-white hover:bg-[#118079] shadow-lg shadow-[#159A91]/25 hover:shadow-[#159A91]/40 hover:-translate-y-px active:translate-y-0 transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="hidden xl:inline">List Your Stay</span>
              <span className="xl:hidden">List</span>
            </NextLink>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={`${iconBtn} lg:hidden`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileMenuOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-[#0E2038] dark:bg-[#08111F] border-t border-white/10"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
              className="px-4 pt-4 pb-6 space-y-4 max-h-[calc(100vh-72px)] overflow-y-auto"
            >
              <MobileItem>
                <div className="grid grid-cols-2 gap-2">
                  <NextLink
                    href="/search"
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/10 text-white text-sm font-bold"
                  >
                    <Compass className="w-4 h-4 text-[#2CC5B9]" />
                    Explore Stays
                  </NextLink>
                  <NextLink
                    href="/owner/add-property"
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#159A91] text-white text-sm font-bold"
                  >
                    <PlusCircle className="w-4 h-4" />
                    List Your Stay
                  </NextLink>
                </div>
              </MobileItem>

              <MobileItem>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Categories</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORIES.slice(1).map((c) => {
                    const Icon = c.icon;
                    return (
                      <NextLink
                        key={c.name}
                        href={c.href}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#E7EDF3] hover:bg-white/5 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-[#2CC5B9] shrink-0" />
                        <span className="truncate">{c.name}</span>
                      </NextLink>
                    );
                  })}
                </div>
              </MobileItem>

              <MobileItem>
                <div className="pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-2">
                    <NextLink
                      href="/dashboard?tab=wishlist"
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5"
                    >
                      <Heart className="w-4 h-4 text-[#E9A23B]" /> Saved ({wishlistIds.length})
                    </NextLink>
                    <button
                      onClick={() => setIsCompareModalOpen(true)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5"
                    >
                      <ArrowRightLeft className="w-4 h-4 text-[#2CC5B9]" /> Compare ({compareProperties.length})
                    </button>
                  </div>
                </div>
              </MobileItem>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <NextLink
      href={href}
      className={`relative px-3.5 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${active ? "text-white font-semibold" : "text-[#E7EDF3] font-medium hover:text-white hover:bg-white/5"
        }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative">{children}</span>
    </NextLink>
  );
}

function CountBadge({ count, className }: { count: number; className: string }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-[#142D4E] dark:ring-[#0A1424] ${className}`}
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function MobileItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>{children}</motion.div>
  );
}
