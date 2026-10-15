import { z } from "zod";

/**
 * Extracts a concise, human-friendly error string from a ZodError.
 */
export function formatZodError(error: z.ZodError): string {
  if (!error.issues || error.issues.length === 0) {
    return "Invalid input data provided.";
  }
  const first = error.issues[0];
  if (!first) {
    return "Invalid input data provided.";
  }
  const fieldPath = first.path.length > 0 ? `[${first.path.join(".")}] ` : "";
  return `${fieldPath}${first.message}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. GENERATE CASE STUDY SCHEMAS
   ───────────────────────────────────────────────────────────────────────────── */

export const generateCaseStudyInputSchema = z.object({
  repoId: z.string().min(1, "Repository ID cannot be empty.").trim(),
  customInstructions: z
    .string()
    .max(2000, "Custom instructions cannot exceed 2000 characters.")
    .optional(),
  forceRegenerate: z.boolean().optional(),
});

export const getRepoCaseStudyInputSchema = z.object({
  repoId: z.string().min(1, "Repository ID cannot be empty.").trim(),
});

export const batchGenerateCaseStudiesInputSchema = z.object({
  repoIds: z
    .array(z.string().min(1, "Repo ID must not be blank"))
    .min(1, "At least one repository must be selected for batch generation.")
    .max(50, "Batch generation is limited to 50 repositories at once."),
  forceRegenerate: z.boolean().optional(),
  stopOnRateLimit: z.boolean().optional(),
});

export const updateCaseStudyInputSchema = z.object({
  caseStudyId: z.string().min(1, "Case study ID cannot be empty.").trim(),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(200, "Title cannot exceed 200 characters.")
    .optional(),
  subtitle: z.string().max(300, "Subtitle cannot exceed 300 characters.").nullable().optional(),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters.")
    .max(3000, "Summary cannot exceed 3000 characters.")
    .optional(),
  highlights: z
    .array(z.string().max(500, "Highlight item cannot exceed 500 characters."))
    .max(20, "Maximum of 20 highlights permitted.")
    .optional(),
  isPublished: z.boolean().optional(),
});

/* ─────────────────────────────────────────────────────────────────────────────
   2. REPOSITORY & SYNC SCHEMAS
   ───────────────────────────────────────────────────────────────────────────── */

export const fetchUserReposOptionsSchema = z
  .object({
    visibility: z.enum(["all", "public", "private"]).optional(),
    affiliation: z.string().max(100).optional(),
    sort: z.enum(["created", "updated", "pushed", "full_name"]).optional(),
    direction: z.enum(["asc", "desc"]).optional(),
    perPage: z.number().int().min(1).max(100).optional(),
    page: z.number().int().min(1).optional(),
  })
  .optional();

export const repoIdentifierSchema = z.object({
  owner: z.string().min(1, "Repository owner cannot be empty.").trim(),
  repo: z.string().min(1, "Repository name cannot be empty.").trim(),
});

export const markdownExtractOptionsSchema = z
  .object({
    maxCharacters: z.number().int().positive().max(50000).optional(),
    stripBadges: z.boolean().optional(),
    stripHtml: z.boolean().optional(),
    stripImages: z.boolean().optional(),
    preserveHeadings: z.boolean().optional(),
  })
  .optional();

export const syncOptionsSchema = z
  .object({
    includeForks: z.boolean().optional(),
    includeArchived: z.boolean().optional(),
    enrichTopN: z.number().int().min(0).max(50).optional(),
  })
  .optional();

export const toggleRepoSelectionInputSchema = z.object({
  repoId: z.string().min(1, "Repository ID cannot be empty.").trim(),
  isSelected: z.boolean(),
});

export const bulkToggleRepoSelectionInputSchema = z.object({
  repoIds: z
    .array(z.string().min(1, "Repo ID cannot be empty"))
    .min(1, "At least one repository ID is required for bulk toggle."),
  isSelected: z.boolean(),
});

export const upsertRepoInputSchema = z.object({
  githubId: z.union([z.number(), z.bigint()]),
  name: z.string().min(1, "Repository name cannot be empty.").trim(),
  fullName: z.string().min(1, "Full repository name cannot be empty.").trim(),
  description: z.string().nullable().optional(),
  htmlUrl: z.string().url("Repository HTML URL must be valid.").trim(),
  homepage: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  primaryLanguage: z.string().nullable().optional(),
  languageBreakdown: z.record(z.string(), z.number()).nullable().optional(),
  stars: z.number().int().nonnegative().optional(),
  forks: z.number().int().nonnegative().optional(),
  openIssues: z.number().int().nonnegative().optional(),
  topics: z.array(z.string()).optional(),
  readmeContent: z.string().nullable().optional(),
  commitCount: z.number().int().nonnegative().optional(),
  lastPushedAt: z.union([z.string(), z.date()]).nullable().optional(),
  isSelected: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

/* ─────────────────────────────────────────────────────────────────────────────
   3. SETTINGS & PROFILE SCHEMAS
   ───────────────────────────────────────────────────────────────────────────── */

export const checkSlugInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Portfolio slug cannot be empty.")
    .min(3, "Slug must be at least 3 characters.")
    .max(30, "Slug cannot exceed 30 characters.")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Only lowercase letters, numbers, and single hyphens allowed.",
    )
    .refine((val) => !val.includes("--"), "Consecutive hyphens are not allowed."),
});

export const displayPreferencesSchema = z.object({
  showBio: z.boolean().optional(),
  showStats: z.boolean().optional(),
  showTechStack: z.boolean().optional(),
  showCaseStudies: z.boolean().optional(),
  showAllRepos: z.boolean().optional(),
  showContact: z.boolean().optional(),
});

export const updateUserSettingsInputSchema = z.object({
  portfolioSlug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(30, "Slug cannot exceed 30 characters.")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Only lowercase alphanumeric characters and single hyphens allowed.",
    )
    .refine((val) => !val.includes("--"), "Consecutive hyphens are not allowed.")
    .optional(),
  headline: z.string().max(200, "Headline cannot exceed 200 characters.").nullable().optional(),
  bio: z.string().max(2000, "Bio cannot exceed 2000 characters.").nullable().optional(),
  websiteUrl: z
    .string()
    .trim()
    .url("Website URL must be a valid http or https URL.")
    .or(z.literal(""))
    .nullable()
    .optional(),
  location: z.string().max(100, "Location cannot exceed 100 characters.").nullable().optional(),
  themeMode: z.enum(["light", "dark", "system"]).optional(),
  designTheme: z.enum(["editorial", "mono", "brutalist"]).optional(),
  displayPreferences: displayPreferencesSchema.optional(),
});
