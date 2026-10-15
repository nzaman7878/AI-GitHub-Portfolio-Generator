"use client";

import * as React from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[GlobalError] Fatal application exception:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090A0C] text-[#F1F5F9] font-sans flex flex-col items-center justify-center p-6 selection:bg-sky-500/20">
        <div className="max-w-lg w-full border border-[#1E232B] bg-[#11141A] p-8 relative space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 font-mono text-xs text-rose-500 uppercase tracking-widest">
            <AlertOctagon className="w-4 h-4" />
            <span>§ CRITICAL SYSTEM FAULT // ROOT EXCEPTION</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-light text-white leading-tight">
              System Ingress Interrupted
            </h1>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              A critical runtime failure prevented the core layout from mounting. You can restart
              the application pipeline below.
            </p>
          </div>

          <div className="border border-[#1E232B] bg-[#090A0C] p-4 font-mono text-xs text-rose-400/90 break-words space-y-1">
            <div className="text-[#64748B] text-[11px]">
              {error.digest ? `DIGEST: ${error.digest.slice(0, 12)}` : "CODE: ERR_FATAL_GLOBAL"}
            </div>
            <div>{error.message || "An unhandled layout fault occurred."}</div>
          </div>

          <button
            type="button"
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-wider font-semibold border border-white bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reboot Application State</span>
          </button>
        </div>
      </body>
    </html>
  );
}
