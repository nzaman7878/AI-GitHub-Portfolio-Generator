import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicCaseStudy } from "@/lib/portfolio";
import { CaseStudyDetailView } from "@/components/portfolio";

interface CaseStudyPageProps {
  params: Promise<{
    username: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { username, id } = await params;
  const result = await getPublicCaseStudy(username, id);

  if (!result) {
    return {
      title: "Case Study Not Found | AI GitHub Portfolio",
      description: "The requested engineering case study could not be located.",
    };
  }

  const { caseStudy, user } = result;
  const title = `${caseStudy.title} — @${user.username} Architectural Monograph`;
  const description =
    caseStudy.summary ||
    `Deep engineering specification and trade-off analysis for ${caseStudy.repoName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/${user.portfolioSlug || user.username}/case-study/${caseStudy.repoName}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { username, id } = await params;
  const result = await getPublicCaseStudy(username, id);

  if (!result) {
    notFound();
  }

  const { caseStudy, user } = result;

  return (
    <main className="min-h-screen bg-paper-canvas dark:bg-obsidian-void">
      <CaseStudyDetailView caseStudy={caseStudy} user={user} mode="page" />
    </main>
  );
}
