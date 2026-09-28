import { SchemaType, type ResponseSchema } from "@google/generative-ai";

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
