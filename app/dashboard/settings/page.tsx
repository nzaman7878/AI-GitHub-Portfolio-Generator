import { getCurrentUser } from "@/lib/session";
import { getUserSettingsAction } from "@/actions/settings";
import { SettingsView } from "@/components/dashboard";

export const metadata = {
  title: "Settings | AI GitHub Portfolio Generator",
  description: "Configure portfolio slug, theme appearance, and published section toggles.",
};

export default async function SettingsPage() {
  const [user, settingsResult] = await Promise.all([getCurrentUser(), getUserSettingsAction()]);

  if (!settingsResult.success) {
    return (
      <div className="p-8 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card font-mono text-mono-sm text-rose-600 dark:text-telemetry-rose">
        § FAILED TO LOAD SETTINGS: {settingsResult.error}
      </div>
    );
  }

  return (
    <SettingsView initialSettings={settingsResult.settings} isAuthenticated={Boolean(user?.id)} />
  );
}
