export {
  getGeminiClient,
  getCaseStudyModel,
  DEFAULT_SYSTEM_INSTRUCTION,
  GeminiAuthError,
  GeminiRateLimitError,
  GeminiApiError,
  type CaseStudyModelOptions,
} from "./client";

export {
  caseStudyResponseSchema,
  caseStudyOutputSchema,
  keyDecisionSchema,
  impactMetricSchema,
  validateCaseStudyOutput,
  type CaseStudyOutput,
  type CaseStudyValidationResult,
  type CaseStudyValidationSuccess,
  type CaseStudyValidationFailure,
} from "./schema";

export {
  CASE_STUDY_PROMPT_VERSION,
  CASE_STUDY_INSTRUCTIONS,
  buildCaseStudyPrompt,
} from "./prompts";

export {
  generateCaseStudyForRepo,
  isCaseStudyFresh,
  serializeCaseStudy,
  type GenerateCaseStudyResponse,
} from "./generate";

export {
  GEMINI_RPM_LIMIT,
  GEMINI_RPD_LIMIT,
  MIN_REQUEST_INTERVAL_MS,
  getGeminiQuotaUsage,
  enqueueGeminiRequest,
  GeminiQuotaExhaustedError,
  type GeminiQuotaStatus,
  type EnqueueOptions,
} from "./rate-limit";

export { generateBatchCaseStudies } from "./batch";
