import type { GeneratedCaseStudySchema } from "./ai";
import type { DisplayPreferences } from "./settings";

export type PortfolioTheme = "editorial" | "mono" | "brutalist";

export interface UserPortfolioProfile {
  id: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  headline: string | null;
  location: string | null;
  websiteUrl: string | null;
  portfolioSlug: string;
  theme: PortfolioTheme;
  themeMode: "light" | "dark" | "system";
}

export interface PortfolioCaseStudy extends GeneratedCaseStudySchema {
  id: string;
  repoId: string;
  repoName: string;
  repoUrl: string;
  stars: number;
  forks: number;
  primaryLanguage: string | null;
  generatedAt: string;
  isPublished: boolean;
  promptVersion?: string;
}

export interface PortfolioRepoItem {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  primaryLanguage: string | null;
  topics: string[];
  lastPushedAt: string | null;
  hasCaseStudy: boolean;
  caseStudyId?: string | null;
}

export interface LanguageStat {
  name: string;
  percentage: number;
  bytes: number;
  color?: string;
}

export interface PortfolioStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  languages: LanguageStat[];
}

export interface FullPortfolioData {
  user: UserPortfolioProfile;
  caseStudies: PortfolioCaseStudy[];
  repos: PortfolioRepoItem[];
  stats: PortfolioStats;
  displayPreferences: DisplayPreferences;
}
