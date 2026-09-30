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
          "var(--font-geist-sans)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "JetBrains Mono",
          "Fira Code",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        "display-xl": ["4rem", { lineHeight: "4.25rem", letterSpacing: "-0.025em" }],
        "headline-xl": ["3.5rem", { lineHeight: "4rem", letterSpacing: "-0.02em" }],
        "headline-lg": ["2.25rem", { lineHeight: "2.75rem", letterSpacing: "-0.015em" }],
        "headline-md": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        "headline-sm": ["1.125rem", { lineHeight: "1.5rem", letterSpacing: "-0.005em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.875rem", letterSpacing: "-0.005em" }],
        "body-md": ["0.9375rem", { lineHeight: "1.625rem", letterSpacing: "0em" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.375rem", letterSpacing: "0.005em" }],
        "label-lg": ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.04em" }],
        "label-md": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.06em" }],
        "label-sm": ["0.6875rem", { lineHeight: "0.875rem", letterSpacing: "0.08em" }],
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
    },
  },
  plugins: [],
};

export default config;
