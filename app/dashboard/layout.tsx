import { DashboardShell } from "@/components/dashboard";

export const metadata = {
  title: "Dashboard | AI GitHub Portfolio Generator",
  description: "Manage your GitHub repositories and AI-generated engineering case studies.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
