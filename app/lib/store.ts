import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SettingsStore } from "../types";
import { REGIONS, translations } from "../constants";

// Re-export types and constants for backward compatibility
export type { Theme, Language, Region } from "../types";
export { REGIONS } from "../constants";
export { themeColors } from "../constants";

/**
 * Settings Store
 * Interface Segregation: Store only contains settings-related state
 * Single Responsibility: Only manages user settings
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // State
      theme: "light",
      language: "ko",
      region: "ALL",
      _hasHydrated: false,

      // Actions
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setRegion: (region) => set({ region }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Helpers
      t: (key) => {
        const { language } = get();
        const value = translations[language][key];
        return value !== undefined ? value : key;
      },
      getRegionName: (code) => {
        const { language } = get();
        const regionData = REGIONS.find((r) => r.code === code);
        if (!regionData) return code;
        return language === "ko" ? regionData.nameKo : regionData.nameEn;
      },
    }),
    {
      name: "movie-calendar-settings",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/**
 * Hydration hook for SSR
 */
export const useHasHydrated = () => {
  return useSettingsStore((state) => state._hasHydrated);
};
