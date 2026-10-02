"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, requireAuth } from "@/lib/session";
import { db } from "@/lib/db";
import type {
  UserSettings,
  UpdateSettingsInput,
  GetSettingsResult,
  UpdateSettingsResult,
  CheckSlugResult,
  DisplayPreferences,
  ThemeMode,
  DesignTheme,
} from "@/types/settings";

const RESERVED_SLUGS = new Set([
  "api",
  "auth",
  "dashboard",
  "signin",
  "settings",
  "repos",
  "case-studies",
  "vitrine",
  "portfolio",
  "admin",
  "login",
  "logout",
  "index",
  "favicon",
  "static",
  "_next",
]);

const DEFAULT_DISPLAY_PREFERENCES: DisplayPreferences = {
  showBio: true,
  showStats: true,
  showTechStack: true,
  showCaseStudies: true,
  showAllRepos: true,
  showContact: true,
};

const DEMO_SETTINGS: UserSettings = {
  portfolioSlug: "alexchen",
  username: "alexchen",
  name: "Alex Chen",
  email: "alex.chen@example.com",
  headline: "Staff Distributed Systems Engineer & Open Source Core Contributor",
  bio: "Architecting high-throughput asynchronous consensus engines, compiler optimization passes, and sub-millisecond telemetry pipelines.",
  websiteUrl: "https://chen.engineering",
  location: "San Francisco, CA",
  themeMode: "system",
  designTheme: "editorial",
  displayPreferences: DEFAULT_DISPLAY_PREFERENCES,
};

interface StoredThemePayload {
  themeMode?: ThemeMode;
  designTheme?: DesignTheme;
  displayPreferences?: Partial<DisplayPreferences>;
}

function parseUserPreferences(storedTheme: string | null | undefined): {
  themeMode: ThemeMode;
  designTheme: DesignTheme;
  displayPreferences: DisplayPreferences;
} {
  let themeMode: ThemeMode = "system";
  let designTheme: DesignTheme = "editorial";
  let displayPreferences: DisplayPreferences = { ...DEFAULT_DISPLAY_PREFERENCES };

  if (!storedTheme) {
    return { themeMode, designTheme, displayPreferences };
  }

  // If simple string theme value like "editorial", "mono", "brutalist"
  if (storedTheme === "editorial" || storedTheme === "mono" || storedTheme === "brutalist") {
    designTheme = storedTheme;
    return { themeMode, designTheme, displayPreferences };
  }

  // Attempt JSON parse
  if (storedTheme.startsWith("{")) {
    try {
      const parsed = JSON.parse(storedTheme) as StoredThemePayload;
      if (
        parsed.themeMode === "light" ||
        parsed.themeMode === "dark" ||
        parsed.themeMode === "system"
      ) {
        themeMode = parsed.themeMode;
      }
      if (
        parsed.designTheme === "editorial" ||
        parsed.designTheme === "mono" ||
        parsed.designTheme === "brutalist"
      ) {
        designTheme = parsed.designTheme;
      }
      if (parsed.displayPreferences) {
        displayPreferences = {
          ...displayPreferences,
          ...parsed.displayPreferences,
        };
      }
    } catch {
      // Fallback to defaults
    }
  }

  return { themeMode, designTheme, displayPreferences };
}

/**
 * Server Action: Retrieves the current user's profile and settings.
 * If unauthenticated or DB unavailable, returns demonstration defaults.
 */
export async function getUserSettingsAction(): Promise<GetSettingsResult> {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser?.id) {
      return {
        success: true,
        settings: DEMO_SETTINGS,
      };
    }

    const dbUser = await db.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!dbUser) {
      return {
        success: true,
        settings: {
          ...DEMO_SETTINGS,
          username: sessionUser.username ?? sessionUser.name ?? "developer",
          name: sessionUser.name ?? null,
          email: sessionUser.email ?? null,
          portfolioSlug: (sessionUser.username ?? "developer").toLowerCase(),
        },
      };
    }

    const { themeMode, designTheme, displayPreferences } = parseUserPreferences(dbUser.theme);

    return {
      success: true,
      settings: {
        portfolioSlug:
          dbUser.portfolioSlug || dbUser.username || sessionUser.username || "developer",
        username: dbUser.username || sessionUser.username || "developer",
        name: dbUser.name ?? sessionUser.name ?? null,
        email: dbUser.email ?? sessionUser.email ?? null,
        headline: dbUser.headline ?? null,
        bio: dbUser.bio ?? null,
        websiteUrl: dbUser.websiteUrl ?? null,
        location: dbUser.location ?? null,
        themeMode,
        designTheme,
        displayPreferences,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load user settings.";
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Server Action: Validates and checks availability for a customized portfolio slug.
 */
export async function checkSlugAvailabilityAction(slug: string): Promise<CheckSlugResult> {
  const normalized = slug.trim().toLowerCase();

  // Validate format
  if (!normalized) {
    return { available: false, slug: normalized, message: "Portfolio slug cannot be empty." };
  }

  if (normalized.length < 3) {
    return { available: false, slug: normalized, message: "Slug must be at least 3 characters." };
  }

  if (normalized.length > 30) {
    return { available: false, slug: normalized, message: "Slug cannot exceed 30 characters." };
  }

  const slugRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
  if (!slugRegex.test(normalized) || normalized.includes("--")) {
    return {
      available: false,
      slug: normalized,
      message: "Only lowercase letters, numbers, and single hyphens allowed.",
    };
  }

  if (RESERVED_SLUGS.has(normalized)) {
    return {
      available: false,
      slug: normalized,
      message: `"${normalized}" is a reserved system path.`,
    };
  }

  try {
    const sessionUser = await getCurrentUser();

    const existing = await db.user.findFirst({
      where: {
        portfolioSlug: normalized,
        ...(sessionUser?.id ? { NOT: { id: sessionUser.id } } : {}),
      },
      select: { id: true },
    });

    if (existing) {
      return { available: false, slug: normalized, message: "This URL slug is already claimed." };
    }

    return { available: true, slug: normalized, message: "Slug is available for registration." };
  } catch {
    // If DB check fails, assume available for preview
    return { available: true, slug: normalized, message: "Slug syntax is valid." };
  }
}

/**
 * Server Action: Updates user settings (portfolio slug, theme, headline, bio, display preferences).
 */
export async function updateUserSettingsAction(
  input: UpdateSettingsInput,
): Promise<UpdateSettingsResult> {
  try {
    const sessionUser = await requireAuth();

    // 1. Slug validation if changing
    let validSlug: string | undefined = undefined;
    if (input.portfolioSlug !== undefined) {
      const slugCheck = await checkSlugAvailabilityAction(input.portfolioSlug);
      if (!slugCheck.available) {
        return {
          success: false,
          error: slugCheck.message || "Invalid portfolio slug.",
        };
      }
      validSlug = slugCheck.slug;
    }

    // 2. Fetch current DB record to preserve partial updates
    const current = await db.user.findUnique({
      where: { id: sessionUser.id },
    });

    const currentPreferences = parseUserPreferences(current?.theme);

    const mergedThemeMode = input.themeMode ?? currentPreferences.themeMode;
    const mergedDesignTheme = input.designTheme ?? currentPreferences.designTheme;
    const mergedDisplayPreferences: DisplayPreferences = {
      ...currentPreferences.displayPreferences,
      ...(input.displayPreferences ?? {}),
    };

    const storedThemeJson = JSON.stringify({
      themeMode: mergedThemeMode,
      designTheme: mergedDesignTheme,
      displayPreferences: mergedDisplayPreferences,
    });

    // 3. Update database record
    const updated = await db.user.update({
      where: { id: sessionUser.id },
      data: {
        ...(validSlug ? { portfolioSlug: validSlug } : {}),
        ...(input.headline !== undefined ? { headline: input.headline } : {}),
        ...(input.bio !== undefined ? { bio: input.bio } : {}),
        ...(input.websiteUrl !== undefined ? { websiteUrl: input.websiteUrl } : {}),
        ...(input.location !== undefined ? { location: input.location } : {}),
        theme: storedThemeJson,
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    if (validSlug) {
      revalidatePath(`/${validSlug}`);
    }

    const { themeMode, designTheme, displayPreferences } = parseUserPreferences(updated.theme);

    return {
      success: true,
      message: "Portfolio settings updated successfully.",
      settings: {
        portfolioSlug: updated.portfolioSlug || updated.username || "developer",
        username: updated.username || "developer",
        name: updated.name,
        email: updated.email,
        headline: updated.headline,
        bio: updated.bio,
        websiteUrl: updated.websiteUrl,
        location: updated.location,
        themeMode,
        designTheme,
        displayPreferences,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update portfolio settings.";
    return {
      success: false,
      error: message,
    };
  }
}
