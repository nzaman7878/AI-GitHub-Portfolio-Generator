import { getCurrentUser } from "@/lib/session";
import { getAllUserCaseStudiesAction } from "@/actions/generate";
import { CaseStudyEditor } from "@/components/dashboard";
import type { UserCaseStudyItem } from "@/actions/generate";

export const metadata = {
  title: "Case Studies | AI GitHub Portfolio Generator",
  description: "Preview, edit, and configure AI-generated engineering case study dossiers.",
};

interface CaseStudiesPageProps {
  searchParams: Promise<{ repo?: string }>;
}

export default async function CaseStudiesPage({ searchParams }: CaseStudiesPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  let items: UserCaseStudyItem[] = [];

  if (user?.id) {
    try {
      const res = await getAllUserCaseStudiesAction();
      if (res.success) {
        items = res.items;
      }
    } catch {
      items = [];
    }
  }

  return (
    <CaseStudyEditor
      initialItems={items}
      preselectedRepoId={params.repo}
      isAuthenticated={Boolean(user?.id)}
    />
  );
}
