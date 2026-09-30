export { createOctokitClient, getAuthenticatedOctokit, checkRateLimit } from "./octokit";

export {
  GitHubRateLimitError,
  GitHubAuthError,
  parseRateLimitHeaders,
  updateLastKnownRateLimit,
  getLastKnownRateLimit,
  isRateLimitError,
  withRateLimitHandling,
  type RateLimitWrapperOptions,
} from "./rate-limit";

export { parseRepository, fetchUserPublicRepositories, type FetchUserReposOptions } from "./repos";

export {
  fetchRepoReadme,
  extractPlainTextFromMarkdown,
  type MarkdownExtractOptions,
  type ExtractResult,
} from "./readme";

export { fetchRepoCommitStats, parseLastPageFromLinkHeader } from "./commits";

export {
  fetchRepoLanguages,
  calculateLanguagePercentages,
  formatBytes,
  GITHUB_LANGUAGE_COLORS,
} from "./languages";

export {
  serializeRepo,
  upsertRepository,
  persistRepositories,
  syncAndPersistUserRepositories,
  getUserRepositories,
  toggleRepoSelection,
  bulkToggleRepoSelection,
  type SyncOptions,
} from "./persist";
