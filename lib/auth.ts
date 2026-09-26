import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import type { Adapter } from "next-auth/adapters";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          avatarUrl: profile.avatar_url,
          username: profile.login,
          githubId: profile.id.toString(),
          bio: profile.bio ?? null,
          websiteUrl: profile.blog ?? null,
          location: profile.location ?? null,
          portfolioSlug: profile.login.toLowerCase(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Persist GitHub access token to JWT on initial OAuth sign-in
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      if (user) {
        token.id = user.id;
        token.username = (profile as { login?: string })?.login ?? user.username ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.username = token.username as string | null | undefined;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async signIn({ user, profile }) {
      // Sync GitHub profile data directly to user record on login
      if (profile && user.id) {
        try {
          const ghProfile = profile as {
            login?: string;
            id?: number;
            bio?: string;
            avatar_url?: string;
            blog?: string;
            location?: string;
          };

          await db.user.update({
            where: { id: user.id },
            data: {
              username: ghProfile.login,
              githubId: ghProfile.id?.toString(),
              bio: ghProfile.bio ?? undefined,
              avatarUrl: ghProfile.avatar_url ?? undefined,
              websiteUrl: ghProfile.blog ?? undefined,
              location: ghProfile.location ?? undefined,
              portfolioSlug: ghProfile.login?.toLowerCase() ?? undefined,
            },
          });
        } catch {
          // If update fails (e.g. initial creation handled by adapter), continue gracefully
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
