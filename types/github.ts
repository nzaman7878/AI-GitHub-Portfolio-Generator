export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics?: string[];
  fork: boolean;
  private: boolean;
  archived: boolean;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  default_branch: string;
}

export type GitHubLanguageBreakdown = Record<string, number>;

export interface GitHubCommitStat {
  totalCommits: number;
  lastCommitDate: string | null;
  primaryAuthorRatio?: number;
}

export interface EnrichedRepositoryData {
  repository: GitHubRepository;
  languages: GitHubLanguageBreakdown;
  readme: string | null;
  commitStats: GitHubCommitStat;
}
