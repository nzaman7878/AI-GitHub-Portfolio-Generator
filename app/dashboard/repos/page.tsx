import { getCurrentUser } from "@/lib/session";
import { getUserRepositories } from "@/lib/github";
import { getGeminiQuotaStatusAction } from "@/actions/generate";
import { RepoListView } from "@/components/dashboard";
import type { RepoWithStatus } from "@/types/github";
import type { GeminiQuotaStatusSerialized } from "@/types/ai";

export const metadata = {
  title: "Repositories | AI GitHub Portfolio Generator",
  description: "Configure synced repositories and select projects for portfolio inclusion.",
};

export default async function ReposPage() {
  const user = await getCurrentUser();
  let repos: RepoWithStatus[] = [];
  let initialQuota: GeminiQuotaStatusSerialized | null = null;

  if (user?.id) {
    try {
      const [fetchedRepos, quotaResult] = await Promise.all([
        getUserRepositories(user.id),
        getGeminiQuotaStatusAction(),
      ]);
      repos = fetchedRepos;
      if (quotaResult.success) {
        initialQuota = quotaResult.quota;
      }
    } catch {
      repos = [];
    }
  } else {
    try {
      const quotaResult = await getGeminiQuotaStatusAction();
      if (quotaResult.success) {
        initialQuota = quotaResult.quota;
      }
    } catch {
      // Demo fallback
    }
  }

  return (
    <RepoListView
      initialRepos={repos}
      initialQuota={initialQuota}
      isAuthenticated={Boolean(user?.id)}
      username={user?.username || user?.name}
    />
  );
}
