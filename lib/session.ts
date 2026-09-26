import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Server-side helper to retrieve the full typed NextAuth session.
 * Safe to call from Server Components, Route Handlers, and Server Actions.
 */
export async function getAuthSession() {
  return await getServerSession(authOptions);
}

/**
 * Server-side helper to retrieve the authenticated user from the session.
 */
export async function getCurrentUser() {
  const session = await getAuthSession();
  return session?.user;
}

/**
 * Server-side assertion ensuring a request is authenticated.
 * Throws an error or returns the authenticated user context.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error("Unauthorized: You must be signed in to perform this action.");
  }
  return user;
}
