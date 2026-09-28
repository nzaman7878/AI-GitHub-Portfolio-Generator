import type { Octokit } from "octokit";
import type { RepoReadmeData } from "@/types/github";

export interface MarkdownExtractOptions {
  /**
   * Maximum character count for plain text extraction.
   * Default: 25,000 characters (~5,000 tokens) to stay well within LLM context budgets.
   */
  maxCharacters?: number;
  /**
   * Whether to strip image tags and markdown badge shields.
   * Default: true
   */
  stripBadges?: boolean;
}

export interface ExtractResult {
  text: string;
  truncated: boolean;
}

/**
 * Strips formatting, badges, HTML, and noisy syntax from GitHub Markdown to generate
 * a clean, dense text payload ideal for LLM contextual reasoning.
 */
export function extractPlainTextFromMarkdown(
  markdown: string,
  options: MarkdownExtractOptions = {},
): ExtractResult {
  const { maxCharacters = 25000, stripBadges = true } = options;

  if (!markdown || typeof markdown !== "string") {
    return { text: "", truncated: false };
  }

  let text = markdown;

  // 1. Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  // 2. Remove Linked Badges: [![alt](image)](url)
  if (stripBadges) {
    text = text.replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "");
    text = text.replace(
      /!\[[^\]]*\]\([^)]*(?:shields\.io|badge|travis-ci|coveralls|workflows\/|actions\/workflows)[^)]*\)/gi,
      "",
    );
  }

  // 3. Remove standalone image tags: ![alt](url)
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, "");

  // 4. Normalize common HTML formatting tags to newlines or clean text
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");

  // 5. Convert markdown links [text](url) to just text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 6. Simplify Headers (# Header -> Header)
  text = text.replace(/^#{1,6}\s+(.+)$/gm, "$1\n");

  // 7. Remove Bold, Italic, Strikethrough syntax
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");
  text = text.replace(/~~(.*?)~~/g, "$1");

  // 8. Normalize Blockquotes
  text = text.replace(/^\s*>\s?/gm, "");

  // 9. Normalize Horizontal rules
  text = text.replace(/^(?:[-*_]\s*){3,}$/gm, "");

  // 10. Clean up bullet lists
  text = text.replace(/^\s*[-*+]\s+/gm, "• ");

  // 11. Normalize excessive whitespace and blank lines
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  // 12. Enforce character limit to protect AI token quotas
  let truncated = false;
  if (text.length > maxCharacters) {
    truncated = true;
    const cutPoint = text.lastIndexOf("\n", maxCharacters);
    const safeCut = cutPoint > maxCharacters * 0.8 ? cutPoint : maxCharacters;
    text =
      text.slice(0, safeCut) + "\n\n[... Remaining README content truncated for AI context ...]";
  }

  return { text, truncated };
}

/**
 * Fetches and decodes the default README for a repository from GitHub.
 * Returns null properties gracefully if the repository has no README (HTTP 404).
 */
export async function fetchRepoReadme(
  octokit: Octokit,
  owner: string,
  repo: string,
  options?: MarkdownExtractOptions,
): Promise<RepoReadmeData> {
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner,
      repo,
    });

    if (!data || !("content" in data) || typeof data.content !== "string") {
      return {
        raw: null,
        plainText: null,
        charCount: 0,
        hasReadme: false,
        truncated: false,
      };
    }

    const raw = Buffer.from(data.content, "base64").toString("utf-8");
    const { text: plainText, truncated } = extractPlainTextFromMarkdown(raw, options);

    return {
      raw,
      plainText,
      charCount: plainText.length,
      hasReadme: true,
      truncated,
    };
  } catch (error: unknown) {
    // A 404 error signifies that the repository does not have a README file
    const status = (error as { status?: number })?.status;
    if (status === 404) {
      return {
        raw: null,
        plainText: null,
        charCount: 0,
        hasReadme: false,
        truncated: false,
      };
    }

    throw error;
  }
}
