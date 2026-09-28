"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { GitHubIcon } from "@/components/auth/github-icon";
import { Loader2 } from "lucide-react";

interface SignInButtonProps {
  callbackUrl?: string;
  className?: string;
  size?: "default" | "lg";
}

export function SignInButton({
  callbackUrl = "/dashboard",
  className = "",
  size = "default",
}: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("github", { callbackUrl });
    } catch (error) {
      console.error("Sign-in failed:", error);
      setIsLoading(false);
    }
  };

  const sizeClasses = size === "lg" ? "px-6 py-3.5 text-base gap-3" : "px-4 py-2.5 text-sm gap-2.5";

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      aria-label="Continue with GitHub"
      className={`inline-flex items-center justify-center font-medium rounded-lg bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm border border-zinc-800 dark:border-zinc-200 cursor-pointer ${sizeClasses} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <GitHubIcon className="w-5 h-5 fill-current" />
      )}
      <span>{isLoading ? "Connecting to GitHub..." : "Continue with GitHub"}</span>
    </button>
  );
}

export default SignInButton;
