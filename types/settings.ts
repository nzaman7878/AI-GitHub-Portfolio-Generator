export type ThemeMode = "light" | "dark" | "system";
export type DesignTheme = "editorial" | "mono" | "brutalist";

export interface DisplayPreferences {
  showBio: boolean;
  showStats: boolean;
  showTechStack: boolean;
  showCaseStudies: boolean;
  showAllRepos: boolean;
  showContact: boolean;
}

export interface UserSettings {
  portfolioSlug: string;
  username: string;
  name: string | null;
  email: string | null;
  headline: string | null;
  bio: string | null;
  websiteUrl: string | null;
  location: string | null;
  themeMode: ThemeMode;
  designTheme: DesignTheme;
  displayPreferences: DisplayPreferences;
}

export interface UpdateSettingsInput {
  portfolioSlug?: string;
  headline?: string | null;
  bio?: string | null;
  websiteUrl?: string | null;
  location?: string | null;
  themeMode?: ThemeMode;
  designTheme?: DesignTheme;
  displayPreferences?: Partial<DisplayPreferences>;
}

export type GetSettingsResult =
  | {
      success: true;
      settings: UserSettings;
    }
  | {
      success: false;
      error: string;
    };

export type UpdateSettingsResult =
  | {
      success: true;
      settings: UserSettings;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

export type CheckSlugResult = {
  available: boolean;
  slug: string;
  message?: string;
};
