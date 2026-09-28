import { db } from "@/lib/db";
import { getCaseStudyModel } from "./client";
import { buildCaseStudyPrompt, CASE_STUDY_PROMPT_VERSION } from "./prompts";
import { validateCaseStudyOutput } from "./schema";
import type {
  CaseStudyPromptContext,
  GenerateCaseStudyOptions,
  SerializedCaseStudy,
  KeyDecision,
  ImpactMetric,
} from "@/types/ai";

/**
 * Normalizes a Prisma CaseStudy model into a JSON-serializable structure.
 */
export function serializeCaseStudy(caseStudy: {
  id: string;
  repoId: string;
  title: string;
  subtitle: string | null;
  summary: string;
  problemStatement: string;
  approach: string | null;
  architecture: string;
  impact: string | null;
  keyDecisions: unknown;
  techStack: string[];
  highlights: string[];
  challengesSolved: string | null;
  impactMetrics: unknown;
  promptVersion: string;
  isPublished: boolean;
  generatedAt: Date | string;
  updatedAt: Date | string;
}): SerializedCaseStudy {
  return {
    ...caseStudy,
    keyDecisions: Array.isArray(caseStudy.keyDecisions)
      ? (caseStudy.keyDecisions as KeyDecision[])
      : [],
    impactMetrics: Array.isArray(caseStudy.impactMetrics)
      ? (caseStudy.impactMetrics as ImpactMetric[])
      : null,
    generatedAt: new Date(caseStudy.generatedAt).toISOString(),
    updatedAt: new Date(caseStudy.updatedAt).toISOString(),
  };
}

export type GenerateCaseStudyResponse =
  | {
      success: true;
      caseStudy: SerializedCaseStudy;
      tokensUsed: number;
      durationMs: number;
    }
  | {
      success: false;
      error: string;
      status: "FAILED" | "RATE_LIMITED";
      durationMs?: number;
    };

/**
 * Orchestrates the full AI generation pipeline:
 * 1. Fetches repository context from PostgreSQL.
 * 2. Compiles the multi-section architectural prompt.
 * 3. Calls Gemini Generative AI in structured JSON mode.
 * 4. Validates output strictly with Zod.
 * 5. Persists the result into the CaseStudy table.
 * 6. Logs complete telemetry (tokens, duration, status) into GenerationLog table.
 */
export async function generateCaseStudyForRepo(
  options: GenerateCaseStudyOptions,
): Promise<GenerateCaseStudyResponse> {
  const { repoId, userId, customInstructions } = options;
  const startTime = Date.now();

  // 1. Fetch repository from database
  const repo = await db.repo.findUnique({
    where: { id: repoId },
  });

  if (!repo) {
    return {
      success: false,
      error: `Repository with ID "${repoId}" not found.`,
      status: "FAILED",
    };
  }

  // 2. Authorization check if userId is provided
  if (userId && repo.userId !== userId) {
    return {
      success: false,
      error: "Unauthorized: You do not own this repository.",
      status: "FAILED",
    };
  }

  // 3. Assemble prompt context
  const promptContext: CaseStudyPromptContext = {
    repoName: repo.name,
    fullName: repo.fullName,
    description: repo.description,
    homepage: repo.homepage,
    primaryLanguage: repo.primaryLanguage || repo.language,
    languageBreakdown:
      repo.languageBreakdown && typeof repo.languageBreakdown === "object"
        ? (repo.languageBreakdown as Record<string, number>)
        : null,
    topics: repo.topics,
    readmeContent: repo.readmeContent,
    commitCount: repo.commitCount,
    lastPushedAt: repo.lastPushedAt,
    stars: repo.stars,
    forks: repo.forks,
  };

  let prompt = buildCaseStudyPrompt(promptContext);
  if (customInstructions && customInstructions.trim().length > 0) {
    prompt += `\n\n### Additional Developer Instructions:\n${customInstructions.trim()}\n`;
  }

  try {
    // 4. Invoke Gemini with structured JSON mode
    const model = getCaseStudyModel();
    const result = await model.generateContent(prompt);
    const durationMs = Date.now() - startTime;

    const rawResponse = result.response.text();
    const usage = result.response.usageMetadata;
    const promptTokens = usage?.promptTokenCount ?? 0;
    const completionTokens = usage?.candidatesTokenCount ?? 0;
    const totalTokens = usage?.totalTokenCount ?? promptTokens + completionTokens;

    // 5. Validate AI output using strict Zod schema
    const validation = validateCaseStudyOutput(rawResponse);

    if (!validation.success) {
      // Log validation failure into GenerationLog
      await db.generationLog.create({
        data: {
          userId: userId ?? repo.userId,
          repoId: repo.id,
          promptVersion: CASE_STUDY_PROMPT_VERSION,
          status: "FAILED",
          tokensUsed: totalTokens,
          promptTokens,
          completionTokens,
          totalTokens,
          durationMs,
          errorMessage: validation.error,
          rawResponse: rawResponse.slice(0, 5000),
        },
      });

      return {
        success: false,
        error: validation.error,
        status: "FAILED",
        durationMs,
      };
    }

    const { data } = validation;

    // 6. Save validated case study to PostgreSQL
    const savedCaseStudy = await db.caseStudy.upsert({
      where: { repoId: repo.id },
      create: {
        repoId: repo.id,
        title: data.title,
        subtitle: data.subtitle ?? null,
        summary: data.summary,
        problemStatement: data.problemStatement,
        approach: data.approach ?? null,
        architecture: data.architecture,
        impact: data.impact ?? null,
        keyDecisions: data.keyDecisions as unknown as object,
        techStack: data.techStack,
        highlights: data.highlights,
        challengesSolved: data.challengesSolved ?? null,
        impactMetrics: (data.impactMetrics ?? undefined) as unknown as object,
        promptVersion: CASE_STUDY_PROMPT_VERSION,
        isPublished: true,
      },
      update: {
        title: data.title,
        subtitle: data.subtitle ?? null,
        summary: data.summary,
        problemStatement: data.problemStatement,
        approach: data.approach ?? null,
        architecture: data.architecture,
        impact: data.impact ?? null,
        keyDecisions: data.keyDecisions as unknown as object,
        techStack: data.techStack,
        highlights: data.highlights,
        challengesSolved: data.challengesSolved ?? null,
        impactMetrics: (data.impactMetrics ?? undefined) as unknown as object,
        promptVersion: CASE_STUDY_PROMPT_VERSION,
        updatedAt: new Date(),
      },
    });

    // 7. Log successful generation to GenerationLog
    await db.generationLog.create({
      data: {
        userId: userId ?? repo.userId,
        repoId: repo.id,
        promptVersion: CASE_STUDY_PROMPT_VERSION,
        status: "SUCCESS",
        tokensUsed: totalTokens,
        promptTokens,
        completionTokens,
        totalTokens,
        durationMs,
        errorMessage: null,
      },
    });

    return {
      success: true,
      caseStudy: serializeCaseStudy(savedCaseStudy),
      tokensUsed: totalTokens,
      durationMs,
    };
  } catch (error: unknown) {
    const durationMs = Date.now() - startTime;
    const message = error instanceof Error ? error.message : "AI generation failed";

    const isRateLimited =
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("quota") ||
      message.includes("429");

    const status = isRateLimited ? "RATE_LIMITED" : "FAILED";

    // Attempt to log failure in GenerationLog to prevent quota loss unnoticed
    await db.generationLog
      .create({
        data: {
          userId: userId ?? repo?.userId ?? null,
          repoId: repo?.id ?? repoId,
          promptVersion: CASE_STUDY_PROMPT_VERSION,
          status,
          tokensUsed: 0,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          durationMs,
          errorMessage: message,
        },
      })
      .catch(() => {});

    return {
      success: false,
      error: message,
      status,
      durationMs,
    };
  }
}
