"use client";

import * as React from "react";
import type { ThemeMode } from "@/types/settings";

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: "light" | "dark";
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio_theme_mode";

function getSnapshot(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
  } catch {
    return "system";
  }
}

function getServerSnapshot(): ThemeMode {
  return "system";
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Apply theme to DOM documentElement
  React.useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateDOM = () => {
      const isDark = themeMode === "dark" || (themeMode === "system" && mediaQuery.matches);
      if (isDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    };

    updateDOM();
    mediaQuery.addEventListener("change", updateDOM);
    return () => mediaQuery.removeEventListener("change", updateDOM);
  }, [themeMode]);

  const setThemeMode = React.useCallback((mode: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // LocalStorage may be blocked
    }
    listeners.forEach((l) => l());
  }, []);

  const resolvedTheme: "light" | "dark" =
    typeof window !== "undefined"
      ? themeMode === "dark" ||
        (themeMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? "dark"
        : "light"
      : "dark";

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    return {
      themeMode: "system" as ThemeMode,
      resolvedTheme: "dark" as "light" | "dark",
      setThemeMode: () => {},
    };
  }
  return context;
}
