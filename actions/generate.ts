"use server";

import { requireAuth } from "@/lib/session";
import { db } from "@/lib/db";
import {
  generateCaseStudyForRepo,
  serializeCaseStudy,
  type GenerateCaseStudyResponse,
} from "@/lib/ai/generate";
import { getGeminiQuotaUsage } from "@/lib/ai/rate-limit";
import type { SerializedCaseStudy } from "@/types/ai";

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
    const user = await requireAuth();

    return await generateCaseStudyForRepo({
      repoId: params.repoId,
      userId: user.id,
      customInstructions: params.customInstructions,
      forceRegenerate: params.forceRegenerate,
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
    const caseStudy = await db.caseStudy.findUnique({
      where: { repoId },
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
      quota: {
        rpmLimit: number;
        rpmUsed: number;
        rpmRemaining: number;
        rpdLimit: number;
        rpdUsed: number;
        rpdRemaining: number;
        resetMinuteDate: string;
        resetDayDate: string;
        isDailyExhausted: boolean;
        isMinuteExhausted: boolean;
        estimatedWaitMs: number;
      };
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
    const user = await requireAuth();
    const quota = await getGeminiQuotaUsage(user.id);

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
