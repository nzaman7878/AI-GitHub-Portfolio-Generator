import { GoogleGenerativeAI, type GenerativeModel, type ModelParams } from "@google/generative-ai";
import { caseStudyResponseSchema } from "./schema";

/**
 * Custom error thrown when the Gemini API key is missing or invalid.
 */
export class GeminiAuthError extends Error {
  constructor(
    message = "Missing or invalid GEMINI_API_KEY. Please provide a valid Google AI Studio key.",
  ) {
    super(message);
    this.name = "GeminiAuthError";
  }
}

/**
 * Custom error thrown when encountering Gemini rate limits or quota depletion.
 */
export class GeminiRateLimitError extends Error {
  public readonly retryAfterSeconds: number;

  constructor(message = "Gemini API rate limit or quota exceeded.", retryAfterSeconds = 60) {
    super(message);
    this.name = "GeminiRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * Standard error wrapper for Gemini API call failures.
 */
export class GeminiApiError extends Error {
  public readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "GeminiApiError";
    this.status = status;
  }
}

export interface CaseStudyModelOptions {
  apiKey?: string;
  modelName?: string;
  temperature?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
}

/**
 * Singleton / cached instance of GoogleGenerativeAI client.
 */
let cachedGenAI: GoogleGenerativeAI | null = null;
let lastUsedApiKey = "";

/**
 * Returns a configured GoogleGenerativeAI client instance.
 * Throws GeminiAuthError if no API key is available.
 */
export function getGeminiClient(apiKey?: string): GoogleGenerativeAI {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key || key.trim() === "" || key.includes("placeholder")) {
    throw new GeminiAuthError();
  }

  if (!cachedGenAI || lastUsedApiKey !== key) {
    cachedGenAI = new GoogleGenerativeAI(key);
    lastUsedApiKey = key;
  }

  return cachedGenAI;
}

/**
 * Default architectural system instruction applied to case study generation.
 */
export const DEFAULT_SYSTEM_INSTRUCTION = `
You are a Principal Staff Software Architect and veteran engineering hiring lead reviewing GitHub code repositories.
Your mission is to generate comprehensive, recruiter-ready engineering case studies.
Analyze the repository's problem statement, architecture, system design, technical decisions, and impact.
Avoid generic marketing fluff, buzzwords, or superficial summaries.
Highlight real engineering friction, concrete architectural trade-offs, and measurable outcomes based strictly on the provided context.
`;

/**
 * Returns a GenerativeModel configured for strict structured JSON output mode,
 * adhering to the case study schema.
 */
export function getCaseStudyModel(options: CaseStudyModelOptions = {}): GenerativeModel {
  const {
    apiKey,
    modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash",
    temperature = 0.2,
    maxOutputTokens = 4096,
    systemInstruction = DEFAULT_SYSTEM_INSTRUCTION,
  } = options;

  const genAI = getGeminiClient(apiKey);

  const modelParams: ModelParams = {
    model: modelName,
    systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: caseStudyResponseSchema,
      temperature,
      maxOutputTokens,
    },
  };

  return genAI.getGenerativeModel(modelParams);
}
