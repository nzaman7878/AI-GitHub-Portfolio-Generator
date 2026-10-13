import { ImageResponse } from "next/og";
import { getPublicPortfolioData, DEMO_PORTFOLIO_DATA } from "@/lib/portfolio";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_CONTENT_TYPE = "image/png";

/**
 * Safely fetches a remote image URL and converts it to a base64 Data URL.
 * Falls back to null if fetch fails, times out, or runs offline.
 */
async function getAvatarDataUrl(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(2500),
      headers: { "User-Agent": "AI-GitHub-Portfolio-Generator-OG-Bot" },
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Generates an architectural Swiss/Obsidian styled OpenGraph image for a developer portfolio.
 */
export async function generatePortfolioOgImage(username: string): Promise<ImageResponse> {
  let portfolio = await getPublicPortfolioData(username);

  // Fallback to demo profile if user is alexchen or not found in local demo mode
  if (!portfolio && (username.toLowerCase() === "alexchen" || username.toLowerCase() === "demo")) {
    portfolio = DEMO_PORTFOLIO_DATA;
  }

  const user = portfolio?.user || {
    id: "unknown",
    username: username,
    name: username,
    headline: "Software Engineer & System Architect",
    bio: "Engineering portfolio and code telemetry generated with AI.",
    avatarUrl: null,
    location: "Global",
    websiteUrl: null,
    portfolioSlug: username,
    theme: "editorial" as const,
    themeMode: "system" as const,
  };

  const stats = portfolio?.stats || {
    totalRepos: portfolio?.repos.length || 0,
    totalStars: 0,
    totalForks: 0,
    totalCommits: 0,
    languages: [],
  };

  const caseStudiesCount = portfolio?.caseStudies.length || 0;
  const reposCount = stats.totalRepos || portfolio?.repos.length || 0;
  const starsCount = stats.totalStars || 0;

  // Attempt to fetch avatar data URL with quick timeout
  const avatarDataUrl = await getAvatarDataUrl(user.avatarUrl);
  const initial = (user.name || user.username || "D").charAt(0).toUpperCase();

  // Top languages for badge pills
  const topLanguages = stats.languages.slice(0, 4);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: 1200,
        height: 630,
        backgroundColor: "#090A0C",
        color: "#F1F5F9",
        padding: "48px 56px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Subtle Background Accent Lines */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: "#38BDF8",
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
            1. TOP DOSSIER HEADER
            ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              backgroundColor: "#1E293B",
              border: "1px solid #334155",
              color: "#38BDF8",
              fontSize: 12,
              fontWeight: 700,
              padding: "5px 12px",
              letterSpacing: 2,
            }}
          >
            PORTFOLIO DOSSIER
          </span>
          <span
            style={{
              color: "#64748B",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: 0.5,
            }}
          >
            {"// ARCHITECTURAL SPECIFICATION & CASE STUDIES"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#10B981",
            }}
          />
          <span
            style={{
              color: "#10B981",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              fontFamily: "monospace",
            }}
          >
            VERIFIED TELEMETRY
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
            2. MAIN PROFILE DOSSIER CARD
            ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#11141A",
          border: "1px solid #1E232B",
          padding: "36px 40px",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Left: Identity Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            flex: 1,
            paddingRight: 24,
          }}
        >
          {/* Avatar block */}
          {avatarDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarDataUrl}
              alt={user.name || user.username}
              width={104}
              height={104}
              style={{
                width: 104,
                height: 104,
                border: "2px solid #334155",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 104,
                height: 104,
                backgroundColor: "#181D24",
                border: "2px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                fontWeight: 800,
                color: "#38BDF8",
              }}
            >
              {initial}
            </div>
          )}

          {/* User Meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: -0.5,
                lineHeight: 1.1,
              }}
            >
              {user.name || `@${user.username}`}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  fontSize: 16,
                  color: "#38BDF8",
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
              >
                @{user.username}
              </span>
              {user.location && (
                <span
                  style={{
                    fontSize: 14,
                    color: "#64748B",
                    fontFamily: "monospace",
                  }}
                >
                  • {user.location}
                </span>
              )}
            </div>

            <div
              style={{
                fontSize: 15,
                color: "#94A3B8",
                lineHeight: 1.4,
                marginTop: 4,
                maxHeight: 44,
                overflow: "hidden",
              }}
            >
              {user.headline || user.bio || "Full-Stack Engineer & Open Source Contributor"}
            </div>
          </div>
        </div>

        {/* Right: Key Telemetry Metrics Quad */}
        <div
          style={{
            display: "flex",
            gap: 28,
            borderLeft: "1px solid #1E232B",
            paddingLeft: 36,
          }}
        >
          {/* Stat: Repositories */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 90 }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#FFFFFF",
                fontFamily: "monospace",
                lineHeight: 1,
              }}
            >
              {reposCount}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#64748B",
                fontWeight: 700,
                letterSpacing: 1.5,
              }}
            >
              REPOSITORIES
            </div>
          </div>

          {/* Stat: Case Studies */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 90 }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#38BDF8",
                fontFamily: "monospace",
                lineHeight: 1,
              }}
            >
              {caseStudiesCount}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#64748B",
                fontWeight: 700,
                letterSpacing: 1.5,
              }}
            >
              CASE STUDIES
            </div>
          </div>

          {/* Stat: Stars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 90 }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#F59E0B",
                fontFamily: "monospace",
                lineHeight: 1,
              }}
            >
              {starsCount > 999 ? `${(starsCount / 1000).toFixed(1)}k` : starsCount}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#64748B",
                fontWeight: 700,
                letterSpacing: 1.5,
              }}
            >
              STARS
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
            3. BOTTOM TELEMETRY STRIP & TECH STACK
            ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Language distribution badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {topLanguages.length > 0 ? (
            topLanguages.map((lang) => (
              <div
                key={lang.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: "#14171D",
                  border: "1px solid #1E232B",
                  padding: "4px 10px",
                  fontSize: 12,
                  color: "#CBD5E1",
                  fontFamily: "monospace",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: lang.color || "#38BDF8",
                  }}
                />
                <span>{lang.name}</span>
                <span style={{ color: "#64748B" }}>{lang.percentage}%</span>
              </div>
            ))
          ) : (
            <div
              style={{
                backgroundColor: "#14171D",
                border: "1px solid #1E232B",
                padding: "4px 10px",
                fontSize: 12,
                color: "#64748B",
                fontFamily: "monospace",
              }}
            >
              ARCHITECTURAL SPECIFICATION READY
            </div>
          )}
        </div>

        {/* Watermark / Brand */}
        <div
          style={{
            fontSize: 12,
            color: "#64748B",
            fontWeight: 600,
            letterSpacing: 2,
            fontFamily: "monospace",
          }}
        >
          AI GITHUB PORTFOLIO GENERATOR
        </div>
      </div>
    </div>,
    {
      ...OG_IMAGE_SIZE,
    },
  );
}
