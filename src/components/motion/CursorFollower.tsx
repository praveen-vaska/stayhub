"use client";

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

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
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
  );
}
