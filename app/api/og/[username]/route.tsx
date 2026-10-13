import { type NextRequest } from "next/server";
import { generatePortfolioOgImage } from "@/lib/og";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> | { username: string } },
) {
  const resolvedParams = await Promise.resolve(params);
  const response = await generatePortfolioOgImage(resolvedParams.username);

  // Set edge CDN caching headers for social crawlers (Twitter, LinkedIn, Slack, Discord)
  response.headers.set(
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  );

  return response;
}
