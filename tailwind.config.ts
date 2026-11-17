import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#142D4E",
          hover: "#0F233D",
          light: "#1C3C66",
        },
        accent: {
          DEFAULT: "#159A91",
          hover: "#118079",
          light: "#E8F5F4",
          soft: "#F0FAF9",
        },
        surface: "#F7F8FA",
        // Theme-aware section backgrounds (see globals.css)
        canvas: "var(--canvas)",
        "canvas-alt": "var(--canvas-alt)",
        card: "#FFFFFF",
        coolBorder: "#E7EDF3",
        warmAmber: {
          DEFAULT: "#E9A23B",
          hover: "#D68E28",
          light: "#FEF7EE",
        },
        slateText: {
          heading: "#142D4E",
          body: "#374A60",
          muted: "#667A91",
          light: "#92A2B5",
        },
      },
      boxShadow: {
        soft: "0 2px 10px rgba(20, 45, 78, 0.04), 0 1px 3px rgba(20, 45, 78, 0.02)",
        card: "0 4px 20px -2px rgba(20, 45, 78, 0.06), 0 2px 6px -1px rgba(20, 45, 78, 0.03)",
        "card-hover": "0 14px 30px -4px rgba(20, 45, 78, 0.12), 0 4px 10px -2px rgba(20, 45, 78, 0.04)",
        dropdown: "0 10px 30px -5px rgba(20, 45, 78, 0.15)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "scale-in": "scaleIn 0.2s ease-out forwards",
        "ken-burns": "kenBurns 14s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "pulse-ring": "pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        kenBurns: {
          "0%": { transform: "scale(1.12) translate3d(0,0,0)" },
          "100%": { transform: "scale(1) translate3d(0,0,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(21,154,145,0.55)" },
          "70%": { boxShadow: "0 0 0 8px rgba(21,154,145,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(21,154,145,0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
