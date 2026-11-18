"use client";

<<<<<<< HEAD
import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const TEXT_FIELDS =
  "input:not([type='checkbox']):not([type='radio']):not([type='range']):not([type='button']):not([type='submit']), textarea, [contenteditable='true'], select";

const MAP_CONTAINERS = ".leaflet-container, .leaflet-pane, .leaflet-control, .gm-style";

const CARD_ELEMENTS =
  "a[href*='/property/'], [data-card], article, .property-card, .group\\/card, [data-lightbox]";

const INTERACTIVE_BUTTONS =
  "button, a, [role='button'], [role='option'], [role='tab'], summary, label[for], input[type='checkbox'], input[type='radio'], .btn, .btn-shine, .stayhub-price-marker";

type CursorMode = "default" | "hover" | "card" | "text" | "hidden";

interface TrailSparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  driftX: number;
}

interface ClickBurstStar {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  rotation: number;
}

// Strictly StayHub theme palette (Teal, Mint, Aqua, White - zero gold/yellow)
const THEME_SPARKLE_COLORS = [
  "#159A91", // StayHub Signature Teal
  "#2CC5B9", // Electric Mint / Cyan Accent
  "#0D9488", // Deep Emerald Teal
  "#38BDF8", // Crisp Sky / Aqua
  "#E8F5F4", // Soft Ice Mint Tint
  "#FFFFFF", // Pure Starlight White
];

/**
 * Precision Custom Theme Arrow Pointer SVG
 * Matches StayHub teal & electric mint gradient with white border
 */
function ThemeArrowCursorSvg({
  isInteractive = false,
}: {
  isInteractive?: boolean;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
      style={{
        filter: isInteractive
          ? "drop-shadow(0 2px 10px rgba(44, 197, 185, 0.95)) drop-shadow(0 0 4px rgba(21, 154, 145, 0.7))"
          : "drop-shadow(0 2px 7px rgba(20, 45, 78, 0.45))",
      }}
    >
      <defs>
        <linearGradient id="themeArrowGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2CC5B9" />
          <stop offset="100%" stopColor="#159A91" />
        </linearGradient>
      </defs>
      {/* Precision Arrow: Tip is anchored exactly at (2.5, 2.5) */}
      <path
        d="M2.5 2.5L9.5 21.5L13.2 13.8L21 10.2L2.5 2.5Z"
        fill="url(#themeArrowGrad)"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 4-Point Celestial Star Sparkle SVG (for flowing glitters & click bursts)
 */
function StarSparkleSvg({
  size = 12,
  color = "#2CC5B9",
  glow = true,
}: {
  size?: number;
  color?: string;
  glow?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: glow ? `drop-shadow(0 0 ${Math.max(3, size * 0.4)}px ${color})` : "none",
      }}
    >
      <path
        d="M12 0 C12 6.6 6.6 12 0 12 C6.6 12 12 17.4 12 24 C12 17.4 17.4 12 24 12 C17.4 12 12 6.6 12 0 Z"
        fill={color}
      />
      <circle cx="12" cy="12" r="2.8" fill="#FFFFFF" opacity="0.95" />
    </svg>
  );
}

/**
 * Modern Theme-Colored Arrow Cursor with Extended Flowing Glitter Trail:
 * - Clean StayHub Teal & Electric Mint precision arrow cursor pointer.
 * - Long flowing tail of celestial stardust glitters that drift and sparkle when moving.
 * - Theme-colored mini starburst on click.
 * - Smooth fade out over inputs and maps for unhindered native usability.
 * - Safe for touch/mobile devices and reduced motion preferences.
 */
export default function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("hidden");
  const [pressed, setPressed] = useState(false);
  const [trail, setTrail] = useState<TrailSparkle[]>([]);
  const [bursts, setBursts] = useState<ClickBurstStar[]>([]);

  // Raw mouse coordinates
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Pinpoint ultra-snappy arrow spring
  const cursorX = useSpring(rawX, { stiffness: 1800, damping: 75, mass: 0.08 });
  const cursorY = useSpring(rawY, { stiffness: 1800, damping: 75, mass: 0.08 });

  // Trail spawning throttle ref
  const lastSparklePos = useRef({ x: 0, y: 0, time: 0 });
=======
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = "a, button, [role='button'], [role='option'], select, label, summary";
const TEXT_FIELDS =
  "input:not([type='checkbox']):not([type='radio']):not([type='range']):not([type='button']):not([type='submit']), textarea, [contenteditable='true']";

type Mode = "default" | "hover" | "text" | "hidden";

/**
 * Minimal cursor: a small dot that inverts against whatever is beneath it (always visible,
 * never hides text), turning into a thin outline ring over clickable things.
 * Text fields keep the native I-beam. Disabled on touch devices and with reduced motion.
 */
export default function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("hidden");
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Very tight spring: feels attached to the pointer, with just a hint of smoothing
  const sx = useSpring(x, { stiffness: 900, damping: 55, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 900, damping: 55, mass: 0.25 });
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

<<<<<<< HEAD
  // Spawn movement trail sparkles with extended flowing ribbon physics
  const spawnTrailSparkle = useCallback((x: number, y: number) => {
    const now = performance.now();
    const last = lastSparklePos.current;
    const dist = Math.hypot(x - last.x, y - last.y);

    // Smooth dense ribbon: spawns when moved > 9px or after 18ms
    if (dist < 9 && now - last.time < 18) return;
    lastSparklePos.current = { x, y, time: now };

    // Emit from the trailing notch of the arrow (~8px offset behind the tip)
    const newSparkle: TrailSparkle = {
      id: now + Math.random(),
      x: x + 8 + (Math.random() * 8 - 4),
      y: y + 8 + (Math.random() * 8 - 4),
      size: Math.floor(Math.random() * 8 + 6), // 6px to 14px
      color: THEME_SPARKLE_COLORS[Math.floor(Math.random() * THEME_SPARKLE_COLORS.length)],
      rotation: Math.floor(Math.random() * 90),
      driftX: (Math.random() - 0.5) * 16,
    };

    // Extended trail buffer: up to 34 flowing sparkles for a long, beautiful tail!
    setTrail((prev) => [...prev.slice(-34), newSparkle]);
  }, []);

  // Clean up expired trail sparkles (extended 850ms lifespan for longer flow)
  useEffect(() => {
    if (trail.length === 0) return;
    const timer = setTimeout(() => {
      setTrail((prev) => prev.filter((p) => performance.now() - p.id < 850));
    }, 90);
    return () => clearTimeout(timer);
  }, [trail]);

  // Clean up expired click bursts
  useEffect(() => {
    if (bursts.length === 0) return;
    const timer = setTimeout(() => {
      setBursts([]);
    }, 450);
    return () => clearTimeout(timer);
  }, [bursts]);

  // Pointer event listeners
=======
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
<<<<<<< HEAD
      const { clientX, clientY } = e;
      rawX.set(clientX);
      rawY.set(clientY);

      const target = e.target as Element | null;

      if (target?.closest?.(MAP_CONTAINERS)) {
        setMode("hidden");
      } else if (target?.closest?.(TEXT_FIELDS)) {
        setMode("text");
      } else if (target?.closest?.(CARD_ELEMENTS)) {
        setMode("card");
        spawnTrailSparkle(clientX, clientY);
      } else if (target?.closest?.(INTERACTIVE_BUTTONS)) {
        setMode("hover");
        spawnTrailSparkle(clientX, clientY);
      } else {
        setMode("default");
        spawnTrailSparkle(clientX, clientY);
      }
    };

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setPressed(true);

      // Mini Theme Starburst on Click (NO circles)
      const count = 7;
      const newBursts: ClickBurstStar[] = [];
      for (let i = 0; i < count; i++) {
        const angle =
          (i * (360 / count) + (Math.random() * 24 - 12)) * (Math.PI / 180);
        const dist = 24 + Math.random() * 16;
        newBursts.push({
          id: performance.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          targetX: e.clientX + Math.cos(angle) * dist,
          targetY: e.clientY + Math.sin(angle) * dist,
          size: Math.floor(Math.random() * 5 + 7),
          color: THEME_SPARKLE_COLORS[i % THEME_SPARKLE_COLORS.length],
          rotation: Math.random() * 180,
        });
      }
      setBursts(newBursts);
    };

    const up = () => setPressed(false);
    const hide = () => setMode("hidden");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    root.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [enabled, rawX, rawY, spawnTrailSparkle]);

  if (!enabled) return null;

  const isCard = mode === "card";
  const isHover = mode === "hover";
  const isInteractive = isCard || isHover;
  const isHidden = mode === "hidden" || mode === "text";

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* ─── Click Starburst (Mini Star Fireworks - NO CIRCLES) ─── */}
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            initial={{
              x: b.x,
              y: b.y,
              scale: 0.4,
              opacity: 1,
              rotate: b.rotation,
            }}
            animate={{
              x: b.targetX,
              y: b.targetY,
              scale: 0,
              opacity: 0,
              rotate: b.rotation + 90,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="absolute pointer-events-none"
            style={{
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <StarSparkleSvg size={b.size} color={b.color} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ─── Extended Flowing Glitter Tail (Long Ribbon of Stars) ─── */}
      <AnimatePresence>
        {trail.map((s) => (
          <motion.div
            key={s.id}
            initial={{
              x: s.x,
              y: s.y,
              scale: 1,
              opacity: 0.95,
              rotate: s.rotation,
            }}
            animate={{
              x: s.x + s.driftX,
              y: s.y + 14,
              scale: 0,
              opacity: 0,
              rotate: s.rotation + 120,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="absolute pointer-events-none"
            style={{
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <StarSparkleSvg size={s.size} color={s.color} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ─── Theme Arrow Cursor Pointer ─── */}
      <motion.div
        aria-hidden
        className="absolute top-0 left-0 pointer-events-none origin-top-left"
        style={{
          x: cursorX,
          y: cursorY,
          // Arrow tip is at (2.5, 2.5), offset so the tip aligns with exact pointer coordinates
          transform: "translate(-2.5px, -2.5px)",
        }}
      >
        <motion.div
          animate={{
            scale: isHidden ? 0 : pressed ? 0.88 : isInteractive ? 1.12 : 1,
            opacity: isHidden ? 0 : 1,
            rotate: isInteractive ? -6 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 800,
            damping: 34,
            opacity: { duration: 0.12 },
          }}
          className="relative flex items-center justify-center origin-top-left"
        >
          {/* StayHub Gradient Theme Arrow */}
          <ThemeArrowCursorSvg isInteractive={isInteractive} />
        </motion.div>
      </motion.div>
    </div>
=======
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      if (target?.closest?.(TEXT_FIELDS)) setMode("text");
      else if (target?.closest?.(INTERACTIVE)) setMode("hover");
      else setMode("default");
    };
    const hide = () => setMode("hidden");
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const hover = mode === "hover";
  const visible = mode === "default" || hover;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full mix-blend-difference"
      // White + difference blend = inverts what's underneath, so it reads on light and dark areas
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", borderColor: "#fff", borderStyle: "solid" }}
      animate={{
        width: hover ? 34 : 10,
        height: hover ? 34 : 10,
        opacity: visible ? 1 : 0,
        scale: pressed ? 0.75 : 1,
        backgroundColor: hover ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)",
        borderWidth: hover ? 1.5 : 0,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 32, opacity: { duration: 0.15 } }}
    />
>>>>>>> 2e32adefb2353464bd29d1352c97d9b868300394
  );
}
