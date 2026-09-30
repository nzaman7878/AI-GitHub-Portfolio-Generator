"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuth } from "@/lib/use-auth";
import { cn } from "@/lib/utils";
import { TelemetryDot } from "@/components/ui/motion/interactive";
import {
  LayoutDashboard,
  FolderGit2,
  Sparkles,
  Settings,
  LogOut,
  ExternalLink,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Navigation Items
   ═══════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Repositories",
    href: "/dashboard/repos",
    icon: FolderGit2,
    exact: false,
  },
  {
    label: "Case Studies",
    href: "/dashboard/case-studies",
    icon: Sparkles,
    exact: false,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    exact: false,
  },
] as const;

/* ═══════════════════════════════════════════════════════════
   Sidebar Component
   ═══════════════════════════════════════════════════════════ */

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const portfolioUrl = user?.username ? `/${user.username}` : "#";

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-full border-r border-hairline dark:border-obsidian-border bg-paper-sheet/50 dark:bg-obsidian-panel/50 transition-all duration-200 ease-out",
        collapsed ? "w-[60px]" : "w-[240px]",
      )}
    >
      {/* Sidebar Header — Brand */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-hairline dark:border-obsidian-border flex-shrink-0">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-mono-sm font-bold tracking-widest text-terracotta dark:text-telemetry-cyan uppercase truncate">
              MONO // 01
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 text-ink-muted dark:text-bone-muted hover:text-ink-primary dark:hover:text-bone hover:bg-paper-elevated dark:hover:bg-obsidian-card transition-colors cursor-pointer"
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2 font-mono text-mono-sm tracking-wide transition-colors group relative",
                isActive
                  ? "text-terracotta dark:text-telemetry-cyan bg-terracotta-surface/60 dark:bg-telemetry-cyan/10"
                  : "text-ink-secondary dark:text-bone-secondary hover:text-ink-primary dark:hover:text-bone hover:bg-paper-elevated dark:hover:bg-obsidian-card",
              )}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator — left hairline accent */}
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-terracotta dark:bg-telemetry-cyan" />
              )}
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="uppercase truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer — User Card & Actions */}
      <div className="border-t border-hairline dark:border-obsidian-border p-2 flex-shrink-0 space-y-1">
        {/* View Portfolio Link */}
        {!collapsed && user?.username && (
          <Link
            href={portfolioUrl}
            target="_blank"
            className="flex items-center justify-between px-2.5 py-1.5 font-mono text-mono-sm text-ink-muted dark:text-bone-muted hover:text-ink-primary dark:hover:text-bone hover:bg-paper-elevated dark:hover:bg-obsidian-card transition-colors tracking-wider uppercase"
          >
            <span>Portfolio</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}

        {/* Sign Out */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "flex items-center gap-3 w-full px-2.5 py-2 font-mono text-mono-sm text-ink-muted dark:text-bone-muted hover:text-terracotta dark:hover:text-telemetry-rose hover:bg-terracotta-surface/40 dark:hover:bg-telemetry-rose/10 transition-colors cursor-pointer tracking-wider uppercase",
            collapsed && "justify-center",
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════
   Mobile Navigation Drawer
   ═══════════════════════════════════════════════════════════ */

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Close drawer on route change
  React.useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/40 dark:bg-black/60 z-40 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-72 z-50 bg-paper-canvas dark:bg-obsidian-panel border-r border-hairline dark:border-obsidian-border flex flex-col animate-page-enter lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-hairline dark:border-obsidian-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <span className="font-mono text-mono-sm font-bold tracking-widest text-terracotta dark:text-telemetry-cyan uppercase">
              MONOGRAPH // 01
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 text-ink-muted dark:text-bone-muted hover:text-ink-primary dark:hover:text-bone transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 py-4 border-b border-hairline dark:border-obsidian-border">
            <div className="flex items-center gap-3">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "User"}
                  width={36}
                  height={36}
                  className="rounded-full border border-hairline dark:border-obsidian-border"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-terracotta dark:bg-telemetry-cyan text-paper-canvas dark:text-obsidian-void flex items-center justify-center font-mono font-bold text-sm">
                  {(user.name ?? user.username ?? "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-sans text-body-sm font-semibold text-ink-primary dark:text-bone truncate">
                  {user.name ?? user.username}
                </p>
                {user.username && (
                  <p className="font-mono text-mono-sm text-ink-muted dark:text-bone-muted truncate">
                    @{user.username}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 font-mono text-mono-sm tracking-wide transition-colors relative",
                  isActive
                    ? "text-terracotta dark:text-telemetry-cyan bg-terracotta-surface/60 dark:bg-telemetry-cyan/10"
                    : "text-ink-secondary dark:text-bone-secondary hover:text-ink-primary dark:hover:text-bone hover:bg-paper-elevated dark:hover:bg-obsidian-card",
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-terracotta dark:bg-telemetry-cyan" />
                )}
                <Icon className="w-4 h-4" />
                <span className="uppercase">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-hairline dark:border-obsidian-border p-3 flex-shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-3 py-2.5 font-mono text-mono-sm text-ink-muted dark:text-bone-muted hover:text-terracotta dark:hover:text-telemetry-rose transition-colors cursor-pointer uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Top Header Bar
   ═══════════════════════════════════════════════════════════ */

interface TopHeaderProps {
  onMobileMenuToggle: () => void;
}

function TopHeader({ onMobileMenuToggle }: TopHeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Derive current page title from pathname
  const currentPage = NAV_ITEMS.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href),
  );
  const pageTitle = currentPage?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-hairline dark:border-obsidian-border bg-paper-canvas/90 dark:bg-obsidian-void/90 backdrop-blur-md flex-shrink-0">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left: Mobile hamburger + breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            aria-label="Open navigation menu"
            className="lg:hidden p-1.5 text-ink-muted dark:text-bone-muted hover:text-ink-primary dark:hover:text-bone transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-mono-sm text-ink-muted dark:text-bone-muted tracking-wider">
            <Link
              href="/dashboard"
              className="hover:text-ink-primary dark:hover:text-bone transition-colors hidden sm:inline"
            >
              DASHBOARD
            </Link>
            {currentPage && currentPage.href !== "/dashboard" && (
              <>
                <span className="text-ink-ghost dark:text-bone-muted">/</span>
                <span className="text-ink-primary dark:text-bone font-semibold uppercase">
                  {pageTitle}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Telemetry + User Avatar */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 font-mono text-mono-sm text-ink-muted dark:text-bone-muted tracking-wider">
            <TelemetryDot status="emerald" size="sm" pulse />
            <span>SYSTEM: READY</span>
          </div>

          {user && (
            <div className="flex items-center gap-2.5">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "User"}
                  width={32}
                  height={32}
                  className="rounded-full border border-hairline dark:border-obsidian-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-terracotta dark:bg-telemetry-cyan text-paper-canvas dark:text-obsidian-void flex items-center justify-center font-mono font-bold text-xs">
                  {(user.name ?? user.username ?? "U").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline font-mono text-mono-sm font-medium text-ink-primary dark:text-bone tracking-wider">
                {user.username ?? user.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   Dashboard Shell (Exported Layout Component)
   ═══════════════════════════════════════════════════════════ */

export interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-paper-canvas dark:bg-obsidian-void">
      {/* Desktop Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((p) => !p)} />

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader onMobileMenuToggle={() => setMobileDrawerOpen((p) => !p)} />

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
