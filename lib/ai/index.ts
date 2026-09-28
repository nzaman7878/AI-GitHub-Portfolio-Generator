export {
  getGeminiClient,
  getCaseStudyModel,
  DEFAULT_SYSTEM_INSTRUCTION,
  GeminiAuthError,
  GeminiRateLimitError,
  GeminiApiError,
  type CaseStudyModelOptions,
} from "./client";

export { caseStudyResponseSchema } from "./schema";

export {
  CASE_STUDY_PROMPT_VERSION,
  CASE_STUDY_INSTRUCTIONS,
  buildCaseStudyPrompt,
} from "./prompts";
