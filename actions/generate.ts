"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import {
  generateCaseStudyForRepo,
  serializeCaseStudy,
  type GenerateCaseStudyResponse,
} from "@/lib/ai/generate";
import { getGeminiQuotaUsage } from "@/lib/ai/rate-limit";
import type { SerializedCaseStudy, GeminiQuotaStatusSerialized } from "@/types/ai";

import {
  generateCaseStudyInputSchema,
  getRepoCaseStudyInputSchema,
  batchGenerateCaseStudiesInputSchema,
  updateCaseStudyInputSchema,
  formatZodError,
} from "@/lib/validations/actions";

export interface GenerateCaseStudyActionParams {
  repoId: string;
  customInstructions?: string;
  forceRegenerate?: boolean;
}

/**
 * Server Action: Generates a recruiter-ready engineering case study using Gemini AI,
 * validates the structured output via Zod, saves to PostgreSQL, and records audit telemetry.
 */
export async function generateCaseStudyAction(
  params: GenerateCaseStudyActionParams,
): Promise<GenerateCaseStudyResponse> {
  try {
    const validated = generateCaseStudyInputSchema.safeParse(params);
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
        status: "FAILED",
      };
    }

    const user = await requireAuth();

    return await generateCaseStudyForRepo({
      repoId: validated.data.repoId,
      userId: user.id,
      customInstructions: validated.data.customInstructions,
      forceRegenerate: validated.data.forceRegenerate,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate case study.";

    return {
      success: false,
      error: message,
      status: "FAILED",
    };
  }
}

export type GetCaseStudyResult =
  | {
      success: true;
      caseStudy: SerializedCaseStudy | null;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Server Action: Retrieves the existing case study for a given repository.
 */
export async function getRepoCaseStudyAction(repoId: string): Promise<GetCaseStudyResult> {
  try {
    const validated = getRepoCaseStudyInputSchema.safeParse({ repoId });
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
      };
    }

    const caseStudy = await db.caseStudy.findUnique({
      where: { repoId: validated.data.repoId },
    });

    return {
      success: true,
      caseStudy: caseStudy ? serializeCaseStudy(caseStudy) : null,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve case study.";

    return {
      success: false,
      error: message,
    };
  }
}

export type GetQuotaStatusResult =
  | {
      success: true;
      quota: GeminiQuotaStatusSerialized;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Server Action: Queries the current Gemini rate limits and quota usage for the user.
 */
export async function getGeminiQuotaStatusAction(): Promise<GetQuotaStatusResult> {
  try {
    const user = await getCurrentUser();
    const quota = await getGeminiQuotaUsage(user?.id);

    return {
      success: true,
      quota: {
        ...quota,
        resetMinuteDate: quota.resetMinuteDate.toISOString(),
        resetDayDate: quota.resetDayDate.toISOString(),
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve quota status.";

    return {
      success: false,
      error: message,
    };
  }
}

export interface BatchGenerateCaseStudiesActionParams {
  repoIds: string[];
  forceRegenerate?: boolean;
  stopOnRateLimit?: boolean;
}

export type BatchGenerateCaseStudiesActionResult =
  | {
      success: true;
      summary: import("@/types/ai").BatchGenerationSummary;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Server Action: Generates case studies for multiple repositories sequentially.
 * Honors Gemini rate limits, checks cache freshness, and returns a detailed batch summary.
 */
export async function generateBatchCaseStudiesAction(
  params: BatchGenerateCaseStudiesActionParams,
): Promise<BatchGenerateCaseStudiesActionResult> {
  try {
    const validated = batchGenerateCaseStudiesInputSchema.safeParse(params);
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
      };
    }

    const user = await requireAuth();
    const { generateBatchCaseStudies } = await import("@/lib/ai/batch");

    const summary = await generateBatchCaseStudies({
      repoIds: validated.data.repoIds,
      userId: user.id,
      forceRegenerate: validated.data.forceRegenerate,
      stopOnRateLimit: validated.data.stopOnRateLimit,
    });

    return {
      success: true,
      summary,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to execute batch case study generation.";

    return {
      success: false,
      error: message,
    };
  }
}

export interface UpdateCaseStudyInput {
  caseStudyId: string;
  title?: string;
  subtitle?: string | null;
  summary?: string;
  highlights?: string[];
  isPublished?: boolean;
}

export type UpdateCaseStudyResult =
  | {
      success: true;
      caseStudy: SerializedCaseStudy;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Server Action: Updates editable fields of a case study (title, subtitle, summary, highlights, isPublished)
 * verifying repository ownership and revalidating cache paths.
 */
export async function updateCaseStudyAction(
  input: UpdateCaseStudyInput,
): Promise<UpdateCaseStudyResult> {
  try {
    const validated = updateCaseStudyInputSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
      };
    }

    const user = await requireAuth();

    // Verify ownership via repo
    const existing = await db.caseStudy.findFirst({
      where: {
        id: validated.data.caseStudyId,
        repo: {
          userId: user.id,
        },
      },
    });

    if (!existing) {
      return {
        success: false,
        error: "Case study not found or unauthorized.",
      };
    }

    const updated = await db.caseStudy.update({
      where: { id: validated.data.caseStudyId },
      data: {
        ...(validated.data.title !== undefined && { title: validated.data.title }),
        ...(validated.data.subtitle !== undefined && { subtitle: validated.data.subtitle }),
        ...(validated.data.summary !== undefined && { summary: validated.data.summary }),
        ...(validated.data.highlights !== undefined && { highlights: validated.data.highlights }),
        ...(validated.data.isPublished !== undefined && {
          isPublished: validated.data.isPublished,
        }),
      },
    });

    revalidatePath("/dashboard/case-studies");
    revalidatePath("/dashboard/repos");
    revalidatePath("/dashboard");

    return {
      success: true,
      caseStudy: serializeCaseStudy(updated),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update case study.";

    return {
      success: false,
      error: message,
    };
  }
}

export interface UserCaseStudyItem {
  repo: {
    id: string;
    name: string;
    fullName: string;
    language: string | null;
    primaryLanguage: string | null;
    stars: number;
    description: string | null;
    htmlUrl: string;
    topics: string[];
    commitCount: number;
    lastPushedAt: string | null;
  };
  caseStudy: SerializedCaseStudy | null;
}

export type GetAllUserCaseStudiesResult =
  | {
      success: true;
      items: UserCaseStudyItem[];
    }
  | {
      success: false;
      error: string;
    };

/**
 * Server Action: Retrieves all repositories and their associated case study records for the current user.
 */
export async function getAllUserCaseStudiesAction(): Promise<GetAllUserCaseStudiesResult> {
  try {
    const user = await requireAuth();

    const repos = await db.repo.findMany({
      where: { userId: user.id },
      include: {
        caseStudy: true,
      },
      orderBy: [{ isSelected: "desc" }, { stars: "desc" }],
    });

    return {
      success: true,
      items: repos.map((r) => ({
        repo: {
          id: r.id,
          name: r.name,
          fullName: r.fullName,
          language: r.language,
          primaryLanguage: r.primaryLanguage,
          stars: r.stars,
          description: r.description,
          htmlUrl: r.htmlUrl,
          topics: r.topics,
          commitCount: r.commitCount,
          lastPushedAt: r.lastPushedAt ? r.lastPushedAt.toISOString() : null,
        },
        caseStudy: r.caseStudy ? serializeCaseStudy(r.caseStudy) : null,
      })),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load case studies.";

    return {
      success: false,
      error: message,
    };
  }
}
