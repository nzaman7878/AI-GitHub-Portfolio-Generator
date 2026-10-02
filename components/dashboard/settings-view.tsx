"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Sun,
  Moon,
  Laptop,
  Check,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Layers,
  FileCode2,
  Terminal,
  RotateCcw,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/ui/motion";
import { useTheme } from "@/components/providers/theme-provider";
import { updateUserSettingsAction, checkSlugAvailabilityAction } from "@/actions/settings";
import type { UserSettings, ThemeMode, DesignTheme, DisplayPreferences } from "@/types/settings";

export interface SettingsViewProps {
  initialSettings: UserSettings;
  isAuthenticated?: boolean;
}

export function SettingsView({ initialSettings, isAuthenticated = false }: SettingsViewProps) {
  const { themeMode: activeClientTheme, setThemeMode } = useTheme();

  // Settings State
  const [slug, setSlug] = React.useState(initialSettings.portfolioSlug);
  const [headline, setHeadline] = React.useState(initialSettings.headline || "");
  const [bio, setBio] = React.useState(initialSettings.bio || "");
  const [websiteUrl, setWebsiteUrl] = React.useState(initialSettings.websiteUrl || "");
  const [location, setLocation] = React.useState(initialSettings.location || "");
  const [selectedThemeMode, setSelectedThemeMode] = React.useState<ThemeMode>(
    initialSettings.themeMode || "system",
  );
  const [selectedDesignTheme, setSelectedDesignTheme] = React.useState<DesignTheme>(
    initialSettings.designTheme || "editorial",
  );
  const [displayPreferences, setDisplayPreferences] = React.useState<DisplayPreferences>({
    ...initialSettings.displayPreferences,
  });

  // Slug verification state
  const [slugStatus, setSlugStatus] = React.useState<{
    checking: boolean;
    available?: boolean;
    message?: string;
  }>({
    checking: false,
    available: true,
    message: undefined,
  });

  // Save telemetry state
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveFeedback, setSaveFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
    timestamp?: string;
  } | null>(null);

  // Synchronize client theme mode if initialSettings provides one
  React.useEffect(() => {
    if (initialSettings.themeMode && initialSettings.themeMode !== activeClientTheme) {
      setThemeMode(initialSettings.themeMode);
    }
  }, [initialSettings.themeMode, activeClientTheme, setThemeMode]);

  // Debounced slug check
  React.useEffect(() => {
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed || trimmed === initialSettings.portfolioSlug) {
      return;
    }

    const timer = setTimeout(async () => {
      setSlugStatus({ checking: true });
      try {
        const res = await checkSlugAvailabilityAction(trimmed);
        setSlugStatus({
          checking: false,
          available: res.available,
          message: res.message,
        });
      } catch {
        setSlugStatus({
          checking: false,
          available: true,
        });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [slug, initialSettings.portfolioSlug]);

  const effectiveSlugStatus = React.useMemo(() => {
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed || trimmed === initialSettings.portfolioSlug) {
      return { checking: false, available: true, message: undefined };
    }
    return slugStatus;
  }, [slug, initialSettings.portfolioSlug, slugStatus]);

  // Track if form is dirty
  const isDirty = React.useMemo(() => {
    return (
      slug !== initialSettings.portfolioSlug ||
      headline !== (initialSettings.headline || "") ||
      bio !== (initialSettings.bio || "") ||
      websiteUrl !== (initialSettings.websiteUrl || "") ||
      location !== (initialSettings.location || "") ||
      selectedThemeMode !== initialSettings.themeMode ||
      selectedDesignTheme !== initialSettings.designTheme ||
      JSON.stringify(displayPreferences) !== JSON.stringify(initialSettings.displayPreferences)
    );
  }, [
    slug,
    headline,
    bio,
    websiteUrl,
    location,
    selectedThemeMode,
    selectedDesignTheme,
    displayPreferences,
    initialSettings,
  ]);

  // Revert all form fields back to pristine state
  const handleReset = () => {
    setSlug(initialSettings.portfolioSlug);
    setHeadline(initialSettings.headline || "");
    setBio(initialSettings.bio || "");
    setWebsiteUrl(initialSettings.websiteUrl || "");
    setLocation(initialSettings.location || "");
    setSelectedThemeMode(initialSettings.themeMode);
    setSelectedDesignTheme(initialSettings.designTheme);
    setDisplayPreferences({ ...initialSettings.displayPreferences });
    setThemeMode(initialSettings.themeMode);
    setSaveFeedback(null);
  };

  // Toggle individual section visibility
  const handleToggleSection = (key: keyof DisplayPreferences) => {
    setDisplayPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Save all settings to DB
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveSlugStatus.available) return;

    setIsSaving(true);
    setSaveFeedback(null);

    try {
      const res = await updateUserSettingsAction({
        portfolioSlug: slug.trim().toLowerCase(),
        headline: headline.trim() || null,
        bio: bio.trim() || null,
        websiteUrl: websiteUrl.trim() || null,
        location: location.trim() || null,
        themeMode: selectedThemeMode,
        designTheme: selectedDesignTheme,
        displayPreferences,
      });

      if (res.success) {
        setSaveFeedback({
          type: "success",
          message: "All portfolio settings successfully synchronized.",
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        setSaveFeedback({
          type: "error",
          message: res.error || "Failed to update portfolio settings.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "A network error occurred while saving.";
      setSaveFeedback({
        type: "error",
        message: msg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Header Telemetry Strip */}
      <Reveal direction="up" delay={50}>
        <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan uppercase tracking-widest">
                  § 04.1 DASHBOARD CONFIGURATION // SETTINGS
                </span>
                <Badge variant={isAuthenticated ? "cyan" : "outline"} size="sm" dot>
                  {isAuthenticated ? "SYNCED" : "PREVIEW MODE"}
                </Badge>
              </div>
              <h1 className="font-serif text-heading-xl font-medium tracking-tight text-ink-primary dark:text-bone">
                Portfolio Settings
              </h1>
              <p className="font-sans text-body-sm text-ink-secondary dark:text-bone-secondary max-w-2xl">
                Configure your public portfolio URL slug, select visual theme modes, and customize
                which engineering dossiers and metrics appear on your vitrine.
              </p>
            </div>

            {/* Visit Public Portfolio CTA */}
            <div className="self-start sm:self-center">
              <Link
                href={`/${slug || initialSettings.username}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 font-mono text-mono-xs uppercase tracking-wider hairline-all bg-paper-sheet dark:bg-obsidian-panel hover:bg-paper-elevated dark:hover:bg-obsidian-void text-ink-primary dark:text-bone transition-colors"
              >
                <span>Live Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
              </Link>
            </div>
          </div>

          {/* Feedback Banner */}
          {saveFeedback && (
            <div
              className={`mt-4 p-3.5 border font-mono text-mono-sm flex items-center justify-between gap-3 ${
                saveFeedback.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-telemetry-emerald/40 text-emerald-800 dark:text-telemetry-emerald"
                  : "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-telemetry-rose/40 text-rose-800 dark:text-telemetry-rose"
              }`}
            >
              <div className="flex items-center gap-2">
                {saveFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{saveFeedback.message}</span>
                {saveFeedback.timestamp && (
                  <span className="text-[10px] text-ink-muted dark:text-bone-muted ml-2">
                    [{saveFeedback.timestamp}]
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSaveFeedback(null)}
                className="p-1 hover:opacity-75 transition-opacity"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </Reveal>

      <form onSubmit={handleSave} className="space-y-8">
        {/* ═══════════════════════════════════════════════════════════
            SECTION 1: Portfolio URL Slug Configuration & Bio
            ═══════════════════════════════════════════════════════════ */}
        <Reveal direction="up" delay={100}>
          <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-6 space-y-6">
            <div className="hairline-b pb-4">
              <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan uppercase tracking-wider block">
                § IDENTIFIER & DISCOVERY
              </span>
              <h2 className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone">
                Public Portfolio URL Slug
              </h2>
              <p className="font-sans text-body-xs text-ink-secondary dark:text-bone-secondary mt-1">
                Your canonical web destination. Choose a unique, concise slug for social bios,
                resumes, and recruiter outreach.
              </p>
            </div>

            {/* Slug Configuration Input */}
            <div className="space-y-2">
              <label
                htmlFor="portfolio-slug-input"
                className="block font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider font-semibold"
              >
                Canonical URL Slug
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="relative flex-1">
                  <div className="flex items-center border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-void focus-within:border-ink-primary dark:focus-within:border-telemetry-cyan transition-colors">
                    <span className="px-3.5 py-2.5 font-mono text-mono-sm text-ink-muted dark:text-bone-muted select-none border-r border-hairline dark:border-obsidian-border bg-paper-sheet/80 dark:bg-obsidian-panel/80">
                      https://vitrine.dev/
                    </span>
                    <input
                      id="portfolio-slug-input"
                      type="text"
                      value={slug}
                      onChange={(e) =>
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                      }
                      placeholder="username"
                      maxLength={30}
                      className="flex-1 px-3 py-2.5 font-mono text-mono-sm bg-transparent text-ink-primary dark:text-bone outline-none"
                    />
                    <div className="pr-3 flex items-center">
                      {effectiveSlugStatus.checking ? (
                        <Loader2 className="w-4 h-4 animate-spin text-ink-muted dark:text-bone-muted" />
                      ) : effectiveSlugStatus.available ? (
                        <Badge variant="success" size="sm">
                          AVAILABLE
                        </Badge>
                      ) : (
                        <Badge variant="destructive" size="sm">
                          UNAVAILABLE
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/${slug || initialSettings.username}`}
                  target="_blank"
                  className="px-4 py-2.5 hairline-all font-mono text-mono-xs uppercase tracking-wider text-ink-primary dark:text-bone bg-paper-sheet dark:bg-obsidian-panel hover:bg-paper-elevated dark:hover:bg-obsidian-void transition-colors text-center inline-flex items-center justify-center gap-1.5"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {effectiveSlugStatus.message && (
                <p
                  className={`font-mono text-[11px] ${
                    effectiveSlugStatus.available
                      ? "text-emerald-600 dark:text-telemetry-emerald"
                      : "text-rose-600 dark:text-telemetry-rose"
                  }`}
                >
                  {effectiveSlugStatus.message}
                </p>
              )}
            </div>

            {/* Editorial Headline */}
            <div className="space-y-1.5 pt-2 hairline-t">
              <label
                htmlFor="headline-input"
                className="block font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider font-semibold"
              >
                Editorial Tagline & Headline
              </label>
              <Input
                id="headline-input"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Staff Distributed Systems Engineer & Open Source Core Contributor"
                className="font-sans text-body-sm"
              />
              <p className="font-sans text-[11px] text-ink-muted dark:text-bone-muted">
                Prominently displayed in the portfolio hero section immediately below your name.
              </p>
            </div>

            {/* Biography */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="bio-input"
                  className="block font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider font-semibold"
                >
                  Engineering Narrative / Bio
                </label>
                <span className="font-mono text-[10px] text-ink-muted dark:text-bone-muted">
                  {bio.length} characters
                </span>
              </div>
              <Textarea
                id="bio-input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Describe your technical core expertise, architectural philosophy, and primary engineering interests..."
                className="font-sans text-body-sm"
              />
            </div>

            {/* Location & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="location-input"
                  className="block font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider font-semibold"
                >
                  Geographic Location
                </label>
                <Input
                  id="location-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="font-mono text-mono-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="website-input"
                  className="block font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider font-semibold"
                >
                  Personal Website / Blog
                </label>
                <Input
                  id="website-input"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://engineering.blog"
                  className="font-mono text-mono-sm"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2: Theme Preference (Light / Dark / System)
            ═══════════════════════════════════════════════════════════ */}
        <Reveal direction="up" delay={150}>
          <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-6 space-y-6">
            <div className="hairline-b pb-4">
              <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan uppercase tracking-wider block">
                § VISUAL APPEARANCE
              </span>
              <h2 className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone">
                Theme & Palette Preference
              </h2>
              <p className="font-sans text-body-xs text-ink-secondary dark:text-bone-secondary mt-1">
                Select your default display contrast mode. Visitors can toggle modes on your public
                vitrine, or default to your specified aesthetic.
              </p>
            </div>

            {/* Mode Selectors: Light / Dark / System */}
            <div className="space-y-3">
              <span className="font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider font-semibold block">
                Interface Mode
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Light Mode Card */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedThemeMode("light");
                    setThemeMode("light");
                  }}
                  className={`p-4 text-left border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                    selectedThemeMode === "light"
                      ? "border-terracotta bg-paper-sheet ring-1 ring-terracotta dark:ring-telemetry-cyan dark:border-telemetry-cyan"
                      : "border-hairline dark:border-obsidian-border bg-paper-sheet/40 dark:bg-obsidian-panel/40 hover:border-ink-primary dark:hover:border-bone"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-none border border-hairline flex items-center justify-center bg-[#faf9f5] text-[#121316]">
                        <Sun className="w-4 h-4 text-amber-600" />
                      </div>
                      {selectedThemeMode === "light" && (
                        <div className="w-4 h-4 bg-terracotta dark:bg-telemetry-cyan text-white dark:text-obsidian-void flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="font-mono text-mono-sm font-semibold text-ink-primary dark:text-bone block uppercase">
                        Archival Paper (Light)
                      </span>
                      <p className="font-sans text-body-xs text-ink-muted dark:text-bone-muted mt-1 leading-relaxed">
                        Off-white cream canvas with rich ink typography and terracotta editorial
                        accents.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 hairline-t flex items-center gap-1 font-mono text-[10px] text-ink-muted dark:text-bone-muted">
                    <span className="w-2 h-2 rounded-full bg-[#8a2d1b]" />
                    <span>#faf9f5 // Terracotta</span>
                  </div>
                </button>

                {/* Dark Mode Card */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedThemeMode("dark");
                    setThemeMode("dark");
                  }}
                  className={`p-4 text-left border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                    selectedThemeMode === "dark"
                      ? "border-terracotta bg-paper-sheet ring-1 ring-terracotta dark:ring-telemetry-cyan dark:border-telemetry-cyan dark:bg-obsidian-panel"
                      : "border-hairline dark:border-obsidian-border bg-paper-sheet/40 dark:bg-obsidian-panel/40 hover:border-ink-primary dark:hover:border-bone"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-none border border-obsidian-border flex items-center justify-center bg-[#090a0d] text-[#ededee]">
                        <Moon className="w-4 h-4 text-cyan-400" />
                      </div>
                      {selectedThemeMode === "dark" && (
                        <div className="w-4 h-4 bg-terracotta dark:bg-telemetry-cyan text-white dark:text-obsidian-void flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="font-mono text-mono-sm font-semibold text-ink-primary dark:text-bone block uppercase">
                        Obsidian Telemetry (Dark)
                      </span>
                      <p className="font-sans text-body-xs text-ink-muted dark:text-bone-muted mt-1 leading-relaxed">
                        Pitch obsidian void with glowing telemetry signal indicators and bone
                        typography.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 hairline-t flex items-center gap-1 font-mono text-[10px] text-ink-muted dark:text-bone-muted">
                    <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                    <span>#090a0d // Telemetry Cyan</span>
                  </div>
                </button>

                {/* System Mode Card */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedThemeMode("system");
                    setThemeMode("system");
                  }}
                  className={`p-4 text-left border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                    selectedThemeMode === "system"
                      ? "border-terracotta bg-paper-sheet ring-1 ring-terracotta dark:ring-telemetry-cyan dark:border-telemetry-cyan dark:bg-obsidian-panel"
                      : "border-hairline dark:border-obsidian-border bg-paper-sheet/40 dark:bg-obsidian-panel/40 hover:border-ink-primary dark:hover:border-bone"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-none border border-hairline dark:border-obsidian-border flex items-center justify-center bg-paper-elevated dark:bg-obsidian-void text-ink-primary dark:text-bone">
                        <Laptop className="w-4 h-4 text-ink-secondary dark:text-bone-secondary" />
                      </div>
                      {selectedThemeMode === "system" && (
                        <div className="w-4 h-4 bg-terracotta dark:bg-telemetry-cyan text-white dark:text-obsidian-void flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="font-mono text-mono-sm font-semibold text-ink-primary dark:text-bone block uppercase">
                        Device System Sync
                      </span>
                      <p className="font-sans text-body-xs text-ink-muted dark:text-bone-muted mt-1 leading-relaxed">
                        Automatically mirrors the visitor&apos;s OS light/dark scheme settings
                        dynamically.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 hairline-t flex items-center gap-1 font-mono text-[10px] text-ink-muted dark:text-bone-muted">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Dynamic OS Match</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Design Direction Options */}
            <div className="space-y-3 pt-3 hairline-t">
              <span className="font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider font-semibold block">
                Design Architecture Archetype
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "editorial" as DesignTheme,
                    name: "The Technical Monograph",
                    desc: "Academic serif titles, archival borders, and deep prose layout.",
                    icon: Layers,
                  },
                  {
                    id: "mono" as DesignTheme,
                    name: "Obsidian Terminal",
                    desc: "Full JetBrains Mono telemetry, command headers, and dense data rows.",
                    icon: Terminal,
                  },
                  {
                    id: "brutalist" as DesignTheme,
                    name: "Brutalist Vitrine",
                    desc: "High-contrast architectural rules, stark dividers, and raw technical grids.",
                    icon: FileCode2,
                  },
                ].map((archetype) => {
                  const Icon = archetype.icon;
                  const isSelected = selectedDesignTheme === archetype.id;
                  return (
                    <button
                      key={archetype.id}
                      type="button"
                      onClick={() => setSelectedDesignTheme(archetype.id)}
                      className={`p-3.5 text-left border transition-all cursor-pointer ${
                        isSelected
                          ? "border-terracotta bg-paper-sheet dark:border-telemetry-cyan dark:bg-obsidian-panel"
                          : "border-hairline dark:border-obsidian-border hover:border-ink-muted dark:hover:border-bone-muted bg-paper-canvas dark:bg-obsidian-card"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-terracotta dark:text-telemetry-cyan" />
                        <span className="font-mono text-mono-xs font-semibold uppercase text-ink-primary dark:text-bone">
                          {archetype.name}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-ink-muted dark:text-bone-muted mt-1 leading-snug">
                        {archetype.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3: Display Preferences (Which sections to show)
            ═══════════════════════════════════════════════════════════ */}
        <Reveal direction="up" delay={200}>
          <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-6 space-y-6">
            <div className="hairline-b pb-4">
              <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan uppercase tracking-wider block">
                § PORTFOLIO COMPOSITION
              </span>
              <h2 className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone">
                Display Preferences & Section Toggles
              </h2>
              <p className="font-sans text-body-xs text-ink-secondary dark:text-bone-secondary mt-1">
                Select which architectural sections are published on your public vitrine. Disable
                any unnecessary modules to create a targeted, minimal presentation.
              </p>
            </div>

            <div className="divide-y divide-hairline dark:divide-obsidian-border border border-hairline dark:border-obsidian-border">
              {[
                {
                  key: "showBio" as keyof DisplayPreferences,
                  title: "Biography & Editorial Overview",
                  desc: "Renders developer bio, editorial headline, location, and social links in the hero header.",
                },
                {
                  key: "showStats" as keyof DisplayPreferences,
                  title: "Engineering Telemetry & Activity",
                  desc: "Displays aggregated star counts, forks, commit frequency, and repository sync timestamps.",
                },
                {
                  key: "showTechStack" as keyof DisplayPreferences,
                  title: "Technology Stack & Language Breakdown",
                  desc: "Visual byte-level language breakdown bar and primary skill badges.",
                },
                {
                  key: "showCaseStudies" as keyof DisplayPreferences,
                  title: "Architectural Case Study Dossiers",
                  desc: "Publishes AI-synthesized engineering case studies (Problem, Approach, Architecture, and Key Decisions).",
                },
                {
                  key: "showAllRepos" as keyof DisplayPreferences,
                  title: "Public Repository Inventory Index",
                  desc: "Displays the searchable index of all selected GitHub repositories with stars and topic tags.",
                },
                {
                  key: "showContact" as keyof DisplayPreferences,
                  title: "Contact & Collaboration Links",
                  desc: "Displays direct email inquiry link, personal website, and GitHub profile handles in the vitrine footer.",
                },
              ].map((section) => {
                const isEnabled = displayPreferences[section.key];
                return (
                  <div
                    key={section.key}
                    className="p-4 flex items-center justify-between gap-4 bg-paper-sheet/20 dark:bg-obsidian-void/20 hover:bg-paper-sheet/50 dark:hover:bg-obsidian-panel/40 transition-colors"
                  >
                    <div className="space-y-0.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-mono-sm font-semibold text-ink-primary dark:text-bone">
                          {section.title}
                        </span>
                        <Badge variant={isEnabled ? "success" : "outline"} size="sm" dot>
                          {isEnabled ? "PUBLISHED" : "HIDDEN"}
                        </Badge>
                      </div>
                      <p className="font-sans text-body-xs text-ink-secondary dark:text-bone-secondary">
                        {section.desc}
                      </p>
                    </div>

                    {/* Minimal Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isEnabled}
                      onClick={() => handleToggleSection(section.key)}
                      className={`relative w-12 h-6 border transition-colors cursor-pointer rounded-none shrink-0 ${
                        isEnabled
                          ? "border-terracotta bg-terracotta dark:border-telemetry-cyan dark:bg-telemetry-cyan"
                          : "border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 bottom-0.5 w-5 bg-paper-canvas dark:bg-obsidian-void transition-transform duration-150 ${
                          isEnabled ? "right-0.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ═══════════════════════════════════════════════════════════
            BOTTOM ACTION BAR: Revert & Commit Changes
            ═══════════════════════════════════════════════════════════ */}
        <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span
              className={`w-2 h-2 rounded-full ${
                isDirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase">
              {isDirty ? "UNSAVED CONFIGURATION CHANGES" : "SETTINGS UP TO DATE"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!isDirty || isSaving}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Discard Changes
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!isDirty || isSaving || !effectiveSlugStatus.available}
              leftIcon={
                isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )
              }
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
