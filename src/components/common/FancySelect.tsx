"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import FloatingPortal from "./FloatingPortal";

export interface FancyOption {
  value: string;
  label: string;
  /** Optional secondary line under the label. */
  hint?: string;
  icon?: LucideIcon;
}

interface FancySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FancyOption[];
  /** Icon shown inside the trigger, before the selected label. */
  leadingIcon?: React.ReactNode;
  /** Classes for the trigger button (size, background, border…). */
  buttonClassName?: string;
  /** Classes for the selected-label text. */
  labelClassName?: string;
  menuWidth?: string;
  align?: "left" | "right";
  id?: string;
  ariaLabel?: string;
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Accessible, animated replacement for <select>. Keyboard: ↑ ↓ Home End Enter Esc and type-ahead. */
export default function FancySelect({
  value,
  onChange,
  options,
  leadingIcon,
  buttonClassName = "",
  labelClassName = "",
  menuWidth = "min-w-full w-max",
  align = "left",
  id,
  ariaLabel,
}: FancySelectProps) {
  const autoId = useId();
  const listId = `${id || autoId}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const typeahead = useRef({ text: "", t: 0 });

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, selectedIndex]);

  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => (a + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => (a - 1 + options.length) % options.length);
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
      case "Tab":
        setOpen(false);
        break;
      default:
        if (e.key.length === 1) {
          const now = Date.now();
          const ta = typeahead.current;
          ta.text = now - ta.t > 600 ? e.key.toLowerCase() : ta.text + e.key.toLowerCase();
          ta.t = now;
          const idx = options.findIndex((o) => o.label.toLowerCase().startsWith(ta.text));
          if (idx >= 0) setActive(idx);
        }
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className={`group w-full flex items-center gap-2.5 text-left ${buttonClassName} ${
          open ? "!border-[#159A91] ring-4 ring-[#159A91]/10" : ""
        }`}
      >
        {leadingIcon}
        <span className={`flex-1 min-w-0 truncate ${labelClassName}`}>{selected?.label}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[#667A91] transition-transform duration-300 ${open ? "rotate-180 text-[#159A91]" : ""}`}
        />
      </button>

      <FloatingPortal anchorRef={buttonRef} open={open} align={align} floatingRef={menuRef}>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-activedescendant={`${listId}-${active}`}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE }}
            className={`${align === "right" ? "origin-top-right" : "origin-top-left"} ${menuWidth} max-h-80 overflow-y-auto p-1.5 rounded-2xl bg-white/95 dark:bg-[#0F1B2E]/95 backdrop-blur-xl border border-[#E7EDF3] dark:border-[#1E3150] shadow-[0_24px_50px_-12px_rgba(10,20,36,0.35)] text-left`}
          >
            {options.map((o, i) => {
              const Icon = o.icon;
              const isSelected = o.value === value;
              const isActive = i === active;
              return (
                <motion.li
                  key={o.value}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025, duration: 0.18 }}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(i)}
                  className="relative flex items-center gap-3 pl-2.5 pr-3 py-2 rounded-xl cursor-pointer select-none"
                >
                  {isActive && (
                    <motion.span
                      layoutId={`${listId}-hl`}
                      className="absolute inset-0 rounded-xl bg-[#F0FAF9] dark:bg-white/[0.06]"
                      transition={{ type: "spring", stiffness: 600, damping: 40 }}
                    />
                  )}
                  {Icon && (
                    <span
                      className={`relative w-8 h-8 shrink-0 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                        isSelected
                          ? "bg-[#159A91] text-white"
                          : isActive
                            ? "bg-[#159A91]/15 text-[#159A91]"
                            : "bg-slate-100 dark:bg-white/5 text-[#667A91]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                  )}
                  <span className="relative flex-1 min-w-0">
                    <span
                      className={`block text-sm whitespace-nowrap ${
                        isSelected ? "font-bold text-[#159A91]" : "font-semibold text-[#142D4E] dark:text-slate-100"
                      }`}
                    >
                      {o.label}
                    </span>
                    {o.hint && <span className="block text-[11px] text-[#667A91] dark:text-slate-400 whitespace-nowrap">{o.hint}</span>}
                  </span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                        className="relative w-5 h-5 shrink-0 rounded-full bg-[#159A91] text-white flex items-center justify-center"
                      >
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
      </FloatingPortal>
    </div>
  );
}
