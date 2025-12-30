import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ Types ============

export type Theme = "dark" | "light";
export type Language = "ko" | "en";
export type Region = "ALL" | "KR" | "US" | "JP" | "GB" | "FR" | "DE";

export const REGIONS: { code: Region; nameKo: string; nameEn: string }[] = [
  { code: "ALL", nameKo: "전체", nameEn: "All" },
  { code: "KR", nameKo: "한국", nameEn: "South Korea" },
  { code: "US", nameKo: "미국", nameEn: "United States" },
  { code: "JP", nameKo: "일본", nameEn: "Japan" },
  { code: "GB", nameKo: "영국", nameEn: "United Kingdom" },
  { code: "FR", nameKo: "프랑스", nameEn: "France" },
  { code: "DE", nameKo: "독일", nameEn: "Germany" },
];

// ============ Translations ============

const translations: Record<Language, Record<string, string>> = {
  ko: {
    // Header
    "header.title": "더무비 캘린더",
    "header.loading": "로딩 중...",
    "header.general": "개봉 예정 작품",
    "header.recommended": "추천 작품",

    // Navigation
    "nav.prev": "이전",
    "nav.next": "다음",
    "nav.year": "년",
    "nav.month": "월",

    // Weekdays
    "weekday.sun": "일",
    "weekday.mon": "월",
    "weekday.tue": "화",
    "weekday.wed": "수",
    "weekday.thu": "목",
    "weekday.fri": "금",
    "weekday.sat": "토",

    // Modal
    "modal.overview": "줄거리",
    "modal.production": "제작사",
    "modal.hour": "시간",
    "modal.minute": "분",

    // Tooltip
    "tooltip.recommended": "추천하는 작품!",

    // Settings
    "settings.theme": "테마",
    "settings.language": "언어",
    "settings.dark": "다크",
    "settings.light": "라이트",
    "settings.region": "개봉 기준 국가",
  },
  en: {
    // Header
    "header.title": "TMDB Moive Calendar",
    "header.loading": "Loading...",
    "header.general": "Upcoming Movies",
    "header.recommended": "Recommended Movies",

    // Navigation
    "nav.prev": "Prev",
    "nav.next": "Next",
    "nav.year": "",
    "nav.month": "",

    // Weekdays
    "weekday.sun": "Sun",
    "weekday.mon": "Mon",
    "weekday.tue": "Tue",
    "weekday.wed": "Wed",
    "weekday.thu": "Thu",
    "weekday.fri": "Fri",
    "weekday.sat": "Sat",

    // Modal
    "modal.overview": "Overview",
    "modal.production": "Production",
    "modal.hour": "h",
    "modal.minute": "min",

    // Tooltip
    "tooltip.recommended": "Recommended!",

    // Settings
    "settings.theme": "Theme",
    "settings.language": "Language",
    "settings.dark": "Dark",
    "settings.light": "Light",
    "settings.region": "Release Region",
  },
};

// ============ Theme Colors ============

export const themeColors = {
  dark: {
    // Page
    pageBg: "black",
    // Calendar container
    calendarBg: "#1e1e2e",
    calendarBorder: "#374151",
    calendarShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    // Header & Toolbar
    headerBg: "#1e1e2e",
    toolbarBorder: "#374151",
    // Text
    textPrimary: "#f3f4f6",
    textSecondary: "#9ca3af",
    textMuted: "#6b7280",
    // Weekday header
    weekdayBg: "#2d2d3d",
    // Day cell
    dayCellBg: "#1e1e2e",
    dayCellOtherMonth: "#151521",
    dayCellToday: "#1e3a5f",
    dayCellBorder: "#374151",
    // Buttons
    buttonBg: "#374151",
    buttonBorder: "#4b5563",
    buttonText: "#f3f4f6",
    buttonHover: "#4b5563",
    // Select
    selectBg: "#374151",
    selectBorder: "#4b5563",
    selectText: "#f3f4f6",
    // Scrollbar
    scrollbarThumb: "#4b5563",
    // Modal
    modalBg: "#1e1e2e",
    modalOverlay: "rgba(0, 0, 0, 0.85)",
  },
  light: {
    // Page
    pageBg: "white",
    // Calendar container
    calendarBg: "#ffffff",
    calendarBorder: "#e5e7eb",
    calendarShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    // Header & Toolbar
    headerBg: "#ffffff",
    toolbarBorder: "#e5e7eb",
    // Text
    textPrimary: "#1f2937",
    textSecondary: "#4b5563",
    textMuted: "#9ca3af",
    // Weekday header
    weekdayBg: "#f9fafb",
    // Day cell
    dayCellBg: "#ffffff",
    dayCellOtherMonth: "#f9fafb",
    dayCellToday: "#eff6ff",
    dayCellBorder: "#e5e7eb",
    // Buttons
    buttonBg: "#ffffff",
    buttonBorder: "#d1d5db",
    buttonText: "#1f2937",
    buttonHover: "#f3f4f6",
    // Select
    selectBg: "#ffffff",
    selectBorder: "#d1d5db",
    selectText: "#1f2937",
    // Scrollbar
    scrollbarThumb: "#d1d5db",
    // Modal
    modalBg: "#ffffff",
    modalOverlay: "rgba(0, 0, 0, 0.7)",
  },
};

// ============ Store Interface ============

interface SettingsState {
  theme: Theme;
  language: Language;
  region: Region;
  _hasHydrated: boolean;
}

interface SettingsActions {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setRegion: (region: Region) => void;
  setHasHydrated: (state: boolean) => void;
}

interface SettingsHelpers {
  t: (key: string) => string;
  getRegionName: (code: Region) => string;
}

type SettingsStore = SettingsState & SettingsActions & SettingsHelpers;

// ============ Zustand Store ============

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

// Hydration hook for SSR
export const useHasHydrated = () => {
  return useSettingsStore((state) => state._hasHydrated);
};
