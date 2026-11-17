"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface FloatingPortalProps {
  /** Element the panel is positioned against. */
  anchorRef: React.RefObject<HTMLElement>;
  open: boolean;
  children: React.ReactNode;
  align?: "left" | "right";
  /** Make the panel at least as wide as the anchor. */
  matchWidth?: boolean;
  offset?: number;
  /** Ref to the floating wrapper, so callers can treat clicks inside it as "inside". */
  floatingRef?: React.MutableRefObject<HTMLDivElement | null>;
  zIndex?: number;
}

/**
 * Renders children in document.body, fixed under (or above, if there's no room) the anchor.
 * Escapes any `overflow: hidden` / stacking context the anchor lives in.
 * Sits below the sticky navbar (z-50) so it never covers navigation.
 */
export default function FloatingPortal({
  anchorRef,
  open,
  children,
  align = "left",
  matchWidth = true,
  offset = 8,
  floatingRef,
  zIndex = 45,
}: FloatingPortalProps) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ position: "fixed", top: -9999, left: -9999 });
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  // Portals need document.body, which doesn't exist during SSR. Rendering it only after mount
  // keeps the first client render identical to the server HTML (avoids hydration errors).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    const panelH = innerRef.current?.offsetHeight ?? 0;
    const spaceBelow = window.innerHeight - r.bottom;
    const flip = panelH > 0 && spaceBelow < panelH + offset + 12 && r.top > spaceBelow;
    setPlacement(flip ? "top" : "bottom");

    const s: React.CSSProperties = { position: "fixed", zIndex };
    if (flip) s.bottom = window.innerHeight - r.top + offset;
    else s.top = r.bottom + offset;
    if (align === "right") s.right = Math.max(8, window.innerWidth - r.right);
    else s.left = Math.max(8, r.left);
    if (matchWidth) s.minWidth = r.width;
    s.maxWidth = window.innerWidth - 16;
    setStyle(s);
  }, [anchorRef, align, matchWidth, offset, zIndex]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;
    update();
    // Re-measure once the panel has rendered (for the flip decision)
    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, mounted, update]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={(el) => {
        innerRef.current = el;
        if (floatingRef) floatingRef.current = el;
      }}
      style={style}
      data-placement={placement}
    >
      {children}
    </div>,
    document.body
  );
}
