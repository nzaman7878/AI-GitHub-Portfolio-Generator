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

/**
 * Server-side helper to retrieve the user's GitHub OAuth access token.
 */
export async function getGitHubAccessToken(): Promise<string | undefined> {
  const session = await getAuthSession();
  return session?.accessToken;
}

/**
 * Server-side assertion ensuring the current session has an active GitHub OAuth access token.
 */
export async function requireGitHubAccessToken(): Promise<string> {
  const token = await getGitHubAccessToken();
  if (!token) {
    throw new Error("Unauthorized: Active GitHub OAuth access token required.");
  }
  return token;
}
