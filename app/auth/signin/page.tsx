"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SignInButton } from "@/components/auth/signin-button";
import { ArrowLeft, ShieldCheck, Terminal, Sparkles } from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const error = searchParams.get("error");

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Return home link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to homepage</span>
      </Link>

      {/* Main Card */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 sm:p-10 shadow-sm">
        {/* Editorial Brand Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-mono text-sm font-bold">
            PF
          </div>
          <span className="font-mono text-xs tracking-wider uppercase text-zinc-500">
            Auth Service
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          Connect your GitHub
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
          Sign in to inspect your repositories, extract architectural context, and generate
          recruiter-ready engineering case studies.
        </p>

        {/* Error notification banner */}
        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
            {error === "OAuthSignin" || error === "OAuthCallback"
              ? "Unable to connect with GitHub. Please check your network and try again."
              : `Authentication error: ${error}`}
          </div>
        )}

        {/* Primary Call to Action — Just GitHub Button, No Form */}
        <div className="space-y-4">
          <SignInButton
            size="lg"
            callbackUrl={callbackUrl}
            className="w-full justify-center shadow-md hover:shadow-lg transition-all"
          />
        </div>

        {/* Privacy & Scope Disclosure */}
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-2.5">
          <div className="flex items-start gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Read-only repo inspection</strong>: We read your repository code, commit
              history, and READMEs. We never modify your code.
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-zinc-500">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Structured AI output</strong>: Powered by Gemini structured schemas, never
              canned templates.
            </span>
          </div>
        </div>
      </div>

      {/* Footer reassurance */}
      <div className="text-center mt-6 text-xs text-zinc-400 dark:text-zinc-600 font-mono">
        <span className="inline-flex items-center gap-1">
          <Terminal className="w-3 h-3" />
          Zero passwords stored. Pure OAuth token authentication.
        </span>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-zinc-50 dark:bg-black">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-96 rounded-2xl bg-zinc-200 dark:bg-zinc-900 animate-pulse" />
        }
      >
        <SignInContent />
      </Suspense>
    </main>
  );
}
