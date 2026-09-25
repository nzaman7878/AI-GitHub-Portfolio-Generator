import { z } from "zod";

/**
 * Server-side environment variables schema.
 * Never expose these variables to the browser/client.
 */
const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required (e.g., postgresql://...)"),
  NEXTAUTH_URL: z
    .string()
    .url("NEXTAUTH_URL must be a valid URL")
    .default("http://localhost:3000"),
  NEXTAUTH_SECRET: z
    .string()
    .min(16, "NEXTAUTH_SECRET must be at least 16 characters long"),
  GITHUB_CLIENT_ID: z
    .string()
    .min(1, "GITHUB_CLIENT_ID is required for GitHub OAuth"),
  GITHUB_CLIENT_SECRET: z
    .string()
    .min(1, "GITHUB_CLIENT_SECRET is required for GitHub OAuth"),
  GEMINI_API_KEY: z
    .string()
    .min(1, "GEMINI_API_KEY is required for AI case-study generation"),
});

/**
 * Client-side environment variables schema.
 * Only variables prefixed with NEXT_PUBLIC_ are accessible in client components.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
});

/**
 * Helper to validate environment variables with formatted error reporting.
 */
function validateEnv() {
  const isServer = typeof window === "undefined";
  const skipValidation =
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.NODE_ENV === "test";

  if (skipValidation) {
    return {
      NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "development_secret_key_placeholder_123",
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? "",
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? "",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    };
  }

  const rawClient = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };

  const parsedClient = clientSchema.safeParse(rawClient);
  if (!parsedClient.success) {
    console.error("❌ Invalid client environment variables:", parsedClient.error.flatten().fieldErrors);
    throw new Error("Invalid client environment variables. Check .env.local");
  }

  if (!isServer) {
    return {
      ...parsedClient.data,
    } as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;
  }

  const rawServer = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  };

  const parsedServer = serverSchema.safeParse(rawServer);
  if (!parsedServer.success) {
    console.error(
      "❌ Invalid or missing server environment variables:\n",
      JSON.stringify(parsedServer.error.flatten().fieldErrors, null, 2),
    );
    throw new Error(
      "Invalid server environment variables. Please check your .env.local file against .env.example",
    );
  }

  return {
    ...parsedServer.data,
    ...parsedClient.data,
  };
}

export const env = validateEnv();
export default env;
