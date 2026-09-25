import type { GeneratedCaseStudySchema } from "./ai";

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
}

export interface PortfolioCaseStudy extends GeneratedCaseStudySchema {
  id: string;
  repoId: string;
  repoName: string;
  repoUrl: string;
  stars: number;
  primaryLanguage: string | null;
  generatedAt: string;
  isPublished: boolean;
}

export interface FullPortfolioData {
  user: UserPortfolioProfile;
  caseStudies: PortfolioCaseStudy[];
}
