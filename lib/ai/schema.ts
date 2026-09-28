import { SchemaType, type ResponseSchema } from "@google/generative-ai";
import { z } from "zod";

/**
 * Structured JSON Schema for Gemini generative AI to output strict,
 * recruiter-grade engineering case studies without hallucinated or canned text.
 */
export const caseStudyResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  description:
    "Recruiter-ready engineering case study extracting architectural context, problem statements, trade-offs, and metrics from a GitHub repository.",
  properties: {
    title: {
      type: SchemaType.STRING,
      description: "High-signal editorial project title emphasizing engineering architecture.",
    },
    subtitle: {
      type: SchemaType.STRING,
      description:
        "Concise technical subtitle / elevator pitch summarizing the project's core innovation.",
    },
    summary: {
      type: SchemaType.STRING,
      description:
        "Executive summary highlighting the system purpose, architectural strengths, and core capabilities.",
    },
    problemStatement: {
      type: SchemaType.STRING,
      description:
        "Clear technical problem statement explaining why this system was engineered and what real-world friction it eliminates.",
    },
    approach: {
      type: SchemaType.STRING,
      description:
        "Engineering approach, methodology, design principles, and technical strategy used to solve the problem.",
    },
    architecture: {
      type: SchemaType.STRING,
      description:
        "System architecture deep-dive covering pipeline, data flow, component boundaries, and integrations.",
    },
    impact: {
      type: SchemaType.STRING,
      description:
        "Business or developer impact, performance gains, scale characteristics, or usability outcomes.",
    },
    keyDecisions: {
      type: SchemaType.ARRAY,
      description: "Key architectural decisions made during development with trade-offs analyzed.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          decision: {
            type: SchemaType.STRING,
            description:
              "What technical decision was made (e.g., choice of database, streaming pattern, state management).",
          },
          rationale: {
            type: SchemaType.STRING,
            description: "Why this choice was selected over alternatives.",
          },
          tradeOff: {
            type: SchemaType.STRING,
            description:
              "What trade-offs or constraints were accepted as a consequence of this decision.",
          },
        },
        required: ["decision", "rationale", "tradeOff"],
      },
    },
    techStack: {
      type: SchemaType.ARRAY,
      description:
        "Core technologies, languages, frameworks, databases, and key libraries actually utilized.",
      items: {
        type: SchemaType.STRING,
      },
    },
    highlights: {
      type: SchemaType.ARRAY,
      description:
        "Top 3 to 5 notable engineering accomplishments or standout technical capabilities.",
      items: {
        type: SchemaType.STRING,
      },
    },
    challengesSolved: {
      type: SchemaType.STRING,
      description:
        "Toughest technical bottlenecks or edge cases solved (concurrency, caching, schemas, latency).",
    },
    impactMetrics: {
      type: SchemaType.ARRAY,
      description: "Quantifiable engineering metrics or estimated benchmarks.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          metric: {
            type: SchemaType.STRING,
            description: "Metric name (e.g., Latency, Test Coverage, Throughput, Token Reduction).",
          },
          value: {
            type: SchemaType.STRING,
            description:
              "Metric value with unit (e.g., '< 50ms', '98.5%', '10k req/s', '4x faster').",
          },
        },
        required: ["metric", "value"],
      },
    },
  },
  required: [
    "title",
    "summary",
    "problemStatement",
    "architecture",
    "keyDecisions",
    "techStack",
    "highlights",
  ],
};

// ==============================================================================
// Strict Zod Runtime Validation Schema for AI-Generated Case Studies
// ==============================================================================

export const keyDecisionSchema = z.object({
  decision: z.string().min(2, "Decision must be at least 2 characters"),
  rationale: z.string().min(2, "Rationale must be at least 2 characters"),
  tradeOff: z.string().min(2, "Trade-off must be at least 2 characters"),
});

export const impactMetricSchema = z.object({
  metric: z.string().min(1, "Metric label is required"),
  value: z.string().min(1, "Metric value is required"),
});

export const caseStudyOutputSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),
  subtitle: z.string().max(300).optional().nullable(),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  problemStatement: z.string().min(10, "Problem statement must be at least 10 characters"),
  approach: z.string().optional().nullable(),
  architecture: z.string().min(10, "Architecture must be at least 10 characters"),
  impact: z.string().optional().nullable(),
  keyDecisions: z
    .array(keyDecisionSchema)
    .min(1, "At least one architectural decision is required"),
  techStack: z
    .array(z.string().min(1))
    .min(1, "At least one technology must be listed in techStack"),
  highlights: z.array(z.string().min(2)).min(1, "At least one highlight is required"),
  challengesSolved: z.string().optional().nullable(),
  impactMetrics: z.array(impactMetricSchema).optional().nullable(),
});

export type CaseStudyOutput = z.infer<typeof caseStudyOutputSchema>;

export interface CaseStudyValidationSuccess {
  success: true;
  data: CaseStudyOutput;
}

export interface CaseStudyValidationFailure {
  success: false;
  error: string;
  issues: z.ZodIssue[];
  raw?: unknown;
}

export type CaseStudyValidationResult = CaseStudyValidationSuccess | CaseStudyValidationFailure;

/**
 * Validates AI-generated case study output against the strict Zod schema before database persistence.
 * Safely parses raw strings (stripping markdown fences if present) or pre-parsed JSON objects.
 */
export function validateCaseStudyOutput(input: unknown): CaseStudyValidationResult {
  let parsedJson: unknown = input;

  if (typeof input === "string") {
    try {
      let cleaned = input.trim();
      // Remove markdown code fences if output by LLM (```json ... ```)
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      }
      parsedJson = JSON.parse(cleaned);
    } catch (parseErr: unknown) {
      const msg = parseErr instanceof Error ? parseErr.message : "Invalid JSON string";
      return {
        success: false,
        error: `Failed to parse AI output as JSON: ${msg}`,
        issues: [],
        raw: input,
      };
    }
  }

  const result = caseStudyOutputSchema.safeParse(parsedJson);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    return {
      success: false,
      error: `Validation error in generated case study: ${errorDetails}`,
      issues: result.error.issues,
      raw: parsedJson,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
