import type { Octokit } from "octokit";
import type { LanguageMetric, RepoLanguageBreakdown } from "@/types/github";

/**
 * Standard GitHub language color map for high-fidelity portfolio UI visualizations.
 */
export const GITHUB_LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Solidity: "#AA6746",
  GraphQL: "#e10098",
  SQL: "#e38c00",
  Lua: "#000080",
  R: "#198CE7",
  Zig: "#ec915c",
  Elixir: "#6e4a7e",
  Clojure: "#db5855",
  Haskell: "#5e5086",
  Scala: "#c22d40",
};

/**
 * Formats a byte number into human-readable metric string (B, KB, MB).
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Converts a raw language byte map from GitHub into normalized percentage metrics and rankings.
 */
export function calculateLanguagePercentages(
  rawBreakdown: Record<string, number>,
): RepoLanguageBreakdown {
  const entries = Object.entries(rawBreakdown ?? {});
  const totalBytes = entries.reduce((sum, [, bytes]) => sum + bytes, 0);

  if (totalBytes === 0 || entries.length === 0) {
    return {
      languages: [],
      rawBreakdown: {},
      totalBytes: 0,
      primaryLanguage: null,
    };
  }

  // Sort by byte volume descending
  entries.sort((a, b) => b[1] - a[1]);

  const languages: LanguageMetric[] = entries.map(([name, bytes]) => {
    const ratio = (bytes / totalBytes) * 100;
    const percentage = Number(ratio.toFixed(1));
    return {
      name,
      bytes,
      percentage,
      formattedPercentage: `${percentage.toFixed(1)}%`,
      formattedSize: formatBytes(bytes),
      color: GITHUB_LANGUAGE_COLORS[name] || "#8b949e",
    };
  });

  const primaryLanguage = languages[0]?.name ?? null;

  return {
    languages,
    rawBreakdown,
    totalBytes,
    primaryLanguage,
  };
}

/**
 * Fetches the byte-level language breakdown for a repository from GitHub
 * and computes exact percentages and visual color tokens.
 */
export async function fetchRepoLanguages(
  octokit: Octokit,
  owner: string,
  repo: string,
): Promise<RepoLanguageBreakdown> {
  try {
    const { data } = await octokit.rest.repos.listLanguages({
      owner,
      repo,
    });

    return calculateLanguagePercentages(data as Record<string, number>);
  } catch (error: unknown) {
    const status = (error as { status?: number })?.status;
    if (status === 404) {
      return {
        languages: [],
        rawBreakdown: {},
        totalBytes: 0,
        primaryLanguage: null,
      };
    }

    throw error;
  }
}
