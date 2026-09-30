import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Monograph Archival Palette (Light Mode Base)
        paper: {
          canvas: "#FAF9F5",
          sheet: "#F4F3ED",
          elevated: "#EDECE4",
          muted: "#E3E2DF",
        },
        ink: {
          primary: "#121316",
          secondary: "#46464B",
          muted: "#76777B",
          ghost: "#9E9E98",
        },
        terracotta: {
          DEFAULT: "#8A2D1B",
          light: "#A23E2A",
          dark: "#721C0B",
          surface: "#FDF0ED",
        },
        hairline: {
          DEFAULT: "#D4D2C9",
          subtle: "#E3E2DC",
          strong: "#B8B6AD",
          dark: "rgba(255, 255, 255, 0.08)",
          "dark-strong": "#262932",
        },

        // Obsidian Telemetry Palette (Dark Mode Base)
        obsidian: {
          void: "#090A0D",
          panel: "#111318",
          card: "#171A22",
          overlay: "#1E222D",
          border: "#262932",
        },
        bone: {
          DEFAULT: "#EDEDEE",
          secondary: "#8B8F9A",
          muted: "#4B5160",
        },
        telemetry: {
          cyan: "#06B6D4",
          "cyan-glow": "rgba(6, 182, 212, 0.2)",
          emerald: "#10B981",
          "emerald-glow": "rgba(16, 185, 129, 0.2)",
          amber: "#F59E0B",
          rose: "#EF4444",
        },
      },
      fontFamily: {
        serif: [
          "var(--font-editorial-serif)",
          "Newsreader",
          "Playfair Display",
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-body-sans)",
          "Plus Jakarta Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "var(--font-telemetry-mono)",
          "JetBrains Mono",
          "Fira Code",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        // Display scale
        "display-2xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],

        // Heading scale
        "heading-xl": ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "heading-lg": ["1.75rem", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
        "heading-md": ["1.375rem", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.4", letterSpacing: "-0.005em" }],

        // Body scale
        "body-xl": ["1.25rem", { lineHeight: "1.75", letterSpacing: "-0.01em" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.7", letterSpacing: "-0.005em" }],
        "body-md": ["0.9375rem", { lineHeight: "1.6", letterSpacing: "0em" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.55", letterSpacing: "0.005em" }],

        // Caption scale
        "caption-md": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        "caption-sm": ["0.6875rem", { lineHeight: "1.35", letterSpacing: "0.04em" }],

        // Monospace / Telemetry scale
        "mono-lg": ["0.875rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        "mono-md": ["0.75rem", { lineHeight: "1.35", letterSpacing: "0.04em" }],
        "mono-sm": ["0.6875rem", { lineHeight: "1.25", letterSpacing: "0.06em" }],
      },
      borderRadius: {
        none: "0px",
        subtle: "2px",
        soft: "4px",
      },
      boxShadow: {
        "planar-sm": "1px 1px 0px 0px rgba(18, 19, 22, 0.9)",
        planar: "2px 2px 0px 0px rgba(18, 19, 22, 0.9)",
        "planar-lg": "3px 3px 0px 0px rgba(18, 19, 22, 0.9)",
        "planar-dark": "2px 2px 0px 0px rgba(0, 0, 0, 0.9)",
        "telemetry-cyan": "0 0 12px rgba(6, 182, 212, 0.25)",
        "telemetry-emerald": "0 0 12px rgba(16, 185, 129, 0.25)",
      },
      spacing: {
        "gutter-desktop": "2.5rem",
        "margin-desktop": "4rem",
      },
      keyframes: {
        pageEnter: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pageAperture: {
          "0%": { opacity: "0", transform: "scale(0.99) translateY(8px)", filter: "blur(2px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)", filter: "blur(0px)" },
        },
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        revealDown: {
          "0%": { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        revealLeft: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        revealRight: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseTelemetry: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.4)",
          },
          "50%": {
            opacity: "0.85",
            transform: "scale(1.05)",
            boxShadow: "0 0 0 6px rgba(16, 185, 129, 0)",
          },
        },
        pulseTelemetryCyan: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(6, 182, 212, 0.4)",
          },
          "50%": {
            opacity: "0.85",
            transform: "scale(1.05)",
            boxShadow: "0 0 0 6px rgba(6, 182, 212, 0)",
          },
        },
      },
      animation: {
        "page-enter": "pageEnter 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "page-aperture": "pageAperture 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "reveal-up": "revealUp 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "reveal-down": "revealDown 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "reveal-left": "revealLeft 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "reveal-right": "revealRight 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "pulse-telemetry": "pulseTelemetry 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-telemetry-cyan": "pulseTelemetryCyan 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
