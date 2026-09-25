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
