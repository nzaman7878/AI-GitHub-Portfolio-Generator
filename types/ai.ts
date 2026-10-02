export interface KeyDecision {
  decision: string;
  rationale: string;
  tradeOff: string;
}

export interface ImpactMetric {
  metric: string;
  value: string;
}

export interface GeneratedCaseStudySchema {
  title: string;
  subtitle?: string;
  summary: string;
  problemStatement: string;
  approach?: string;
  architecture: string;
  impact?: string;
  keyDecisions: KeyDecision[];
  techStack: string[];
  highlights: string[];
  challengesSolved?: string;
  impactMetrics?: ImpactMetric[];
}

export type GenerationStatus = "SUCCESS" | "FAILED" | "SKIPPED_CACHE" | "RATE_LIMITED";

export interface GenerationTokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  durationMs: number;
}

export interface CaseStudyGenerationResult {
  status: GenerationStatus;
  caseStudy?: GeneratedCaseStudySchema;
  tokenUsage?: GenerationTokenUsage;
  errorMessage?: string;
  promptVersion: string;
}

export interface GenerationPromptContext {
  repoName: string;
  description?: string | null;
  primaryLanguage?: string | null;
  languages: Record<string, number>;
  topics: string[];
  readmeContent?: string | null;
  commitCount: number;
  stars: number;
}

export interface CaseStudyPromptContext {
  repoName: string;
  fullName?: string;
  description?: string | null;
  homepage?: string | null;
  primaryLanguage?: string | null;
  languageBreakdown?: Record<string, number> | null;
  languagePercentages?: Array<{ name: string; percentage: number }>;
  topics?: string[];
  readmeContent?: string | null;
  commitCount?: number;
  lastPushedAt?: string | Date | null;
  stars?: number;
  forks?: number;
  contributorCount?: number;
}

export interface GenerateCaseStudyOptions {
  repoId: string;
  userId?: string;
  customInstructions?: string;
  forceRegenerate?: boolean;
}

export interface SerializedCaseStudy {
  id: string;
  repoId: string;
  title: string;
  subtitle: string | null;
  summary: string;
  problemStatement: string;
  approach: string | null;
  architecture: string;
  impact: string | null;
  keyDecisions: KeyDecision[];
  techStack: string[];
  highlights: string[];
  challengesSolved: string | null;
  impactMetrics: ImpactMetric[] | null;
  promptVersion: string;
  isPublished: boolean;
  generatedAt: string;
  updatedAt: string;
}

export type BatchItemStatus =
  "PENDING" | "GENERATING" | "SUCCESS" | "SKIPPED_CACHE" | "FAILED" | "RATE_LIMITED";

export interface BatchItemResult {
  repoId: string;
  repoName: string;
  status: "SUCCESS" | "SKIPPED_CACHE" | "FAILED" | "RATE_LIMITED";
  caseStudy?: SerializedCaseStudy;
  error?: string;
  cached?: boolean;
  durationMs: number;
  tokensUsed: number;
}

export interface BatchGenerationProgress {
  total: number;
  current: number;
  completed: number;
  skipped: number;
  failed: number;
  rateLimited: number;
  currentRepoName?: string;
  percentage: number;
  status: "idle" | "running" | "completed" | "aborted";
}

export interface BatchGenerationSummary {
  total: number;
  succeeded: number;
  skipped: number;
  failed: number;
  rateLimited: number;
  totalDurationMs: number;
  totalTokensUsed: number;
  results: BatchItemResult[];
}

export interface BatchGenerateOptions {
  repoIds: string[];
  userId?: string;
  forceRegenerate?: boolean;
  stopOnRateLimit?: boolean;
  onProgress?: (
    progress: BatchGenerationProgress,
    itemResult?: BatchItemResult,
  ) => void | Promise<void>;
}

export interface GeminiQuotaStatusSerialized {
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
}
