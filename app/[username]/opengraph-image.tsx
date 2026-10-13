import { generatePortfolioOgImage, OG_IMAGE_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Developer Engineering Monograph & Telemetry Dossier";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ username: string }> | { username: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  return generatePortfolioOgImage(resolvedParams.username);
}
