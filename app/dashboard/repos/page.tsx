import { getCurrentUser } from "@/lib/session";
import { getUserRepositories } from "@/lib/github";
import { RepoListView } from "@/components/dashboard";
import type { RepoWithStatus } from "@/types/github";

export const metadata = {
  title: "Repositories | AI GitHub Portfolio Generator",
  description: "Configure synced repositories and select projects for portfolio inclusion.",
};

export default async function ReposPage() {
  const user = await getCurrentUser();
  let repos: RepoWithStatus[] = [];

  if (user?.id) {
    try {
      repos = await getUserRepositories(user.id);
    } catch {
      repos = [];
    }
  }

  return (
    <RepoListView
      initialRepos={repos}
      isAuthenticated={Boolean(user?.id)}
      username={user?.username || user?.name}
    />
  );
}
