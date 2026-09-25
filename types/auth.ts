export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
  githubId?: string | null;
}

export interface ExtendedSession {
  user: SessionUser;
  expires: string;
  accessToken?: string;
}

export interface GitHubOAuthProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  bio: string | null;
  blog: string | null;
  location: string | null;
}
