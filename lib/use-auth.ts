"use client";

import { useSession, signIn, signOut } from "next-auth/react";

/**
 * Custom React hook wrapping NextAuth useSession with convenient
 * typed state flags, user profile data, and auth triggers.
 */
export function useAuth() {
  const { data: session, status, update } = useSession();

  return {
    session,
    user: session?.user,
    userId: session?.user?.id,
    username: session?.user?.username,
    accessToken: session?.accessToken,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    signIn: (callbackUrl = "/dashboard") => signIn("github", { callbackUrl }),
    signOut: (callbackUrl = "/") => signOut({ callbackUrl }),
    update,
  };
}

export default useAuth;
