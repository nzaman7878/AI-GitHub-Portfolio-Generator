"use client";

import * as React from "react";
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  dismissToast: (id: string) => void;
  success: (title: string, description?: string, duration?: number) => string;
  error: (title: string, description?: string, duration?: number) => string;
  warning: (title: string, description?: string, duration?: number) => string;
  info: (title: string, description?: string, duration?: number) => string;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

// Global imperative emitter for non-React contexts or fast helper access
type ToastListener = (toast: Omit<ToastItem, "id">) => void;
const globalListeners = new Set<ToastListener>();

export const toast = {
  success: (title: string, description?: string, duration?: number) => {
    globalListeners.forEach((l) => l({ type: "success", title, description, duration }));
  },
  error: (title: string, description?: string, duration?: number) => {
    globalListeners.forEach((l) => l({ type: "error", title, description, duration }));
  },
  warning: (title: string, description?: string, duration?: number) => {
    globalListeners.forEach((l) => l({ type: "warning", title, description, duration }));
  },
  info: (title: string, description?: string, duration?: number) => {
    globalListeners.forEach((l) => l({ type: "info", title, description, duration }));
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { ...item, id };
    setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5 visible
    return id;
  }, []);

  const success = React.useCallback(
    (title: string, description?: string, duration?: number) =>
      addToast({ type: "success", title, description, duration }),
    [addToast],
  );

  const error = React.useCallback(
    (title: string, description?: string, duration?: number) =>
      addToast({ type: "error", title, description, duration }),
    [addToast],
  );

  const warning = React.useCallback(
    (title: string, description?: string, duration?: number) =>
      addToast({ type: "warning", title, description, duration }),
    [addToast],
  );

  const info = React.useCallback(
    (title: string, description?: string, duration?: number) =>
      addToast({ type: "info", title, description, duration }),
    [addToast],
  );

  // Subscribe to global toast triggers
  React.useEffect(() => {
    const listener: ToastListener = (t) => addToast(t);
    globalListeners.add(listener);
    return () => {
      globalListeners.delete(listener);
    };
  }, [addToast]);

  const value = React.useMemo(
    () => ({
      toasts,
      addToast,
      dismissToast,
      success,
      error,
      warning,
      info,
    }),
    [toasts, addToast, dismissToast, success, error, warning, info],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    // If used outside provider, return global helper
    return {
      toasts: [],
      addToast: () => "",
      dismissToast: () => {},
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
    };
  }
  return context;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} toast={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({
  toast: item,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const duration = item.duration ?? 4500;

  React.useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(item.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [item.id, duration, onDismiss]);

  const typeConfig = {
    success: {
      tag: "§ OK // COMPLETE",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
      border: "border-emerald-500/40 dark:border-emerald-500/30",
      accent: "bg-emerald-500",
      textColor: "text-emerald-500",
    },
    error: {
      tag: "§ FAULT // EXCEPTION",
      icon: <AlertOctagon className="w-4 h-4 text-signal-danger shrink-0 mt-0.5" />,
      border: "border-signal-danger/40 dark:border-signal-danger/30",
      accent: "bg-signal-danger",
      textColor: "text-signal-danger",
    },
    warning: {
      tag: "§ WARN // ADVISORY",
      icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
      border: "border-amber-500/40 dark:border-amber-500/30",
      accent: "bg-amber-500",
      textColor: "text-amber-500",
    },
    info: {
      tag: "§ TELEMETRY // EVENT",
      icon: <Info className="w-4 h-4 text-signal-accent shrink-0 mt-0.5" />,
      border: "border-signal-accent/40 dark:border-signal-accent/30",
      accent: "bg-signal-accent",
      textColor: "text-signal-accent",
    },
  }[item.type];

  return (
    <div
      role={item.type === "error" ? "alert" : "status"}
      className={`pointer-events-auto relative border ${typeConfig.border} bg-paper-sheet/95 dark:bg-obsidian-panel/95 backdrop-blur-md p-4 shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
    >
      {/* Top accent hairline indicator */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${typeConfig.accent}`} />

      {/* Header Tag & Close Button */}
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span
          className={`font-mono text-[10px] font-bold tracking-widest uppercase ${typeConfig.textColor}`}
        >
          {typeConfig.tag}
        </span>
        <button
          type="button"
          onClick={() => onDismiss(item.id)}
          className="text-ink-muted dark:text-bone-muted hover:text-ink-primary dark:hover:text-bone p-0.5 transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex items-start gap-2.5">
        {typeConfig.icon}
        <div className="space-y-0.5 flex-1 min-w-0">
          <p className="font-sans text-xs font-semibold text-ink-primary dark:text-bone leading-tight">
            {item.title}
          </p>
          {item.description && (
            <p className="font-sans text-[11px] text-ink-secondary dark:text-bone-secondary leading-relaxed break-words">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
