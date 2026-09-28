import type { CaseStudyPromptContext } from "@/types/ai";

/**
 * Global version tag tracking the active case study generation prompt architecture.
 * Stored in CaseStudy.promptVersion and GenerationLog.promptVersion.
 */
export const CASE_STUDY_PROMPT_VERSION = "v1.0.0";

/**
 * Editorial prompt instructions ensuring Gemini outputs high-signal,
 * recruiter-grade architectural case studies instead of generic marketing copy.
 */
export const CASE_STUDY_INSTRUCTIONS = `
You are tasked with generating an in-depth, recruiter-grade technical case study for an open-source GitHub repository.

### Writing Philosophy & Constraints:
1. **Audience**: Principal Architects, Staff Engineers, VPs of Engineering, and senior technical hiring leads.
2. **Tone**: Rigorous, technical, objective, and analytical. Avoid corporate marketing fluff, hyperbolic adjectives ("revolutionary", "cutting-edge", "game-changing"), and vague generalizations.
3. **Evidence-based**: Ground conclusions in the repository's code structure, languages, topics, commit frequency, and documentation.
4. **Architectural Realism**: If specific production scale metrics are not explicitly documented, frame impact in terms of engineering efficiency, design elegance, latency characteristics, or developer velocity rather than fabricating artificial traffic numbers.

### Required Content Structure:
- **Title**: A punchy, editorial headline emphasizing the architectural nature of the project (e.g. "Distributed Stream Processing Engine with Backpressure Guarantees" rather than "My Cool Kafka App").
- **Subtitle**: A concise one-line technical elevator pitch.
- **Summary**: 2-3 sentences outlining the system's core capabilities, architectural strengths, and primary value.
- **Problem Statement**: What exact technical bottleneck, workflow friction, or systems challenge prompted this implementation?
- **Approach**: What methodology, architectural patterns, and design principles were employed to solve the problem?
- **Architecture**: A comprehensive breakdown of system topology, data flow, component boundaries, and integrations.
- **Key Decisions**: Exactly 2 to 4 pivotal technical trade-offs (e.g., choice of PostgreSQL over document stores, client vs server rendering, streaming vs batching). Each decision MUST have a clear rationale and an acknowledged trade-off.
- **Tech Stack**: Array of key languages, frameworks, databases, and runtime tools identified from the repository.
- **Highlights**: 3 to 5 notable engineering accomplishments or standout technical capabilities.
- **Challenges Solved**: Specific edge cases, concurrency challenges, schema migrations, or latency bottlenecks addressed.
- **Impact Metrics**: 2 to 4 quantifiable metrics or concrete performance/reliability indicators (e.g., test coverage, sub-millisecond response time, token reduction, build time improvements).
`;

/**
 * Assembles a comprehensive, structured prompt payload from enriched repository metadata.
 */
export function buildCaseStudyPrompt(context: CaseStudyPromptContext): string {
  // Format language breakdown
  let languagesText = "None detected";
  if (context.languagePercentages && context.languagePercentages.length > 0) {
    languagesText = context.languagePercentages
      .map((l) => `${l.name} (${l.percentage}%)`)
      .join(", ");
  } else if (context.languageBreakdown && Object.keys(context.languageBreakdown).length > 0) {
    const totalBytes = Object.values(context.languageBreakdown).reduce((a, b) => a + b, 0);
    languagesText = Object.entries(context.languageBreakdown)
      .map(([name, bytes]) => `${name} (${((bytes / totalBytes) * 100).toFixed(1)}%)`)
      .join(", ");
  } else if (context.primaryLanguage) {
    languagesText = context.primaryLanguage;
  }

  // Format topics
  const topicsText =
    context.topics && context.topics.length > 0 ? context.topics.join(", ") : "None tagged";

  // Format commit stats
  const commitText =
    typeof context.commitCount === "number"
      ? `${context.commitCount} commits recorded`
      : "Commit history not indexed";

  const recencyText = context.lastPushedAt
    ? `Last active: ${new Date(context.lastPushedAt).toLocaleDateString()}`
    : "Unknown activity timestamp";

  const contributorText =
    typeof context.contributorCount === "number" && context.contributorCount > 0
      ? `${context.contributorCount} contributor(s)`
      : null;

  // Format README context
  const readmeSnippet =
    context.readmeContent && context.readmeContent.trim().length > 0
      ? context.readmeContent.trim()
      : "No README documentation provided in repository.";

  return `
${CASE_STUDY_INSTRUCTIONS}

---
### Repository Context Payload:
- **Repository Name**: ${context.repoName}
- **Full Name**: ${context.fullName || context.repoName}
- **Description**: ${context.description || "No description provided"}
- **Primary Language**: ${context.primaryLanguage || "Unspecified"}
- **Language Composition**: ${languagesText}
- **Topics / Tags**: ${topicsText}
- **Activity & Commits**: ${commitText} (${recencyText})${
    contributorText ? ` [${contributorText}]` : ""
  }
- **Stars / Forks**: ${context.stars ?? 0} stars, ${context.forks ?? 0} forks
${context.homepage ? `- **Live Deployment / Homepage**: ${context.homepage}` : ""}

---
### Repository README Context:
"""
${readmeSnippet}
"""

---
Analyze the provided repository context and generate the structured JSON engineering case study according to the response schema.
`;
}
