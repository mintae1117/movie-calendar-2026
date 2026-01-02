import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ Types ============

export type Theme = "dark" | "light";
export type Language = "ko" | "en";
export type Region =
  | "ALL"
  | "KR"
  | "US"
  | "JP"
  | "GB"
  | "FR"
  | "DE"
  | "CN"
  | "TW"
  | "HK"
  | "IN"
  | "AU"
  | "CA"
  | "IT"
  | "ES"
  | "BR"
  | "MX"
  | "RU"
  | "SE"
  | "NL"
  | "BE"
  | "PL"
  | "TH"
  | "SG"
  | "MY"
  | "PH"
  | "ID"
  | "VN"
  | "NZ"
  | "AR"
  | "CL"
  | "CO"
  | "PE"
  | "ZA"
  | "EG"
  | "TR"
  | "GR"
  | "PT"
  | "AT"
  | "CH"
  | "DK"
  | "NO"
  | "FI"
  | "IE"
  | "IL"
  | "AE"
  | "SA";

export const REGIONS: { code: Region; nameKo: string; nameEn: string }[] = [
  { code: "ALL", nameKo: "전체", nameEn: "Global" },
  // Asia
  { code: "KR", nameKo: "한국", nameEn: "South Korea" },
  { code: "JP", nameKo: "일본", nameEn: "Japan" },
  { code: "CN", nameKo: "중국", nameEn: "China" },
  { code: "TW", nameKo: "대만", nameEn: "Taiwan" },
  { code: "HK", nameKo: "홍콩", nameEn: "Hong Kong" },
  { code: "IN", nameKo: "인도", nameEn: "India" },
  { code: "TH", nameKo: "태국", nameEn: "Thailand" },
  { code: "SG", nameKo: "싱가포르", nameEn: "Singapore" },
  { code: "MY", nameKo: "말레이시아", nameEn: "Malaysia" },
  { code: "PH", nameKo: "필리핀", nameEn: "Philippines" },
  { code: "ID", nameKo: "인도네시아", nameEn: "Indonesia" },
  { code: "VN", nameKo: "베트남", nameEn: "Vietnam" },
  // North America
  { code: "US", nameKo: "미국", nameEn: "United States" },
  { code: "CA", nameKo: "캐나다", nameEn: "Canada" },
  { code: "MX", nameKo: "멕시코", nameEn: "Mexico" },
  // Europe
  { code: "GB", nameKo: "영국", nameEn: "United Kingdom" },
  { code: "FR", nameKo: "프랑스", nameEn: "France" },
  { code: "DE", nameKo: "독일", nameEn: "Germany" },
  { code: "IT", nameKo: "이탈리아", nameEn: "Italy" },
  { code: "ES", nameKo: "스페인", nameEn: "Spain" },
  { code: "PT", nameKo: "포르투갈", nameEn: "Portugal" },
  { code: "NL", nameKo: "네덜란드", nameEn: "Netherlands" },
  { code: "BE", nameKo: "벨기에", nameEn: "Belgium" },
  { code: "AT", nameKo: "오스트리아", nameEn: "Austria" },
  { code: "CH", nameKo: "스위스", nameEn: "Switzerland" },
  { code: "SE", nameKo: "스웨덴", nameEn: "Sweden" },
  { code: "DK", nameKo: "덴마크", nameEn: "Denmark" },
  { code: "NO", nameKo: "노르웨이", nameEn: "Norway" },
  { code: "FI", nameKo: "핀란드", nameEn: "Finland" },
  { code: "PL", nameKo: "폴란드", nameEn: "Poland" },
  { code: "GR", nameKo: "그리스", nameEn: "Greece" },
  { code: "IE", nameKo: "아일랜드", nameEn: "Ireland" },
  { code: "RU", nameKo: "러시아", nameEn: "Russia" },
  { code: "TR", nameKo: "터키", nameEn: "Turkey" },
  // Oceania
  { code: "AU", nameKo: "호주", nameEn: "Australia" },
  { code: "NZ", nameKo: "뉴질랜드", nameEn: "New Zealand" },
  // South America
  { code: "BR", nameKo: "브라질", nameEn: "Brazil" },
  { code: "AR", nameKo: "아르헨티나", nameEn: "Argentina" },
  { code: "CL", nameKo: "칠레", nameEn: "Chile" },
  { code: "CO", nameKo: "콜롬비아", nameEn: "Colombia" },
  { code: "PE", nameKo: "페루", nameEn: "Peru" },
  // Middle East & Africa
  { code: "IL", nameKo: "이스라엘", nameEn: "Israel" },
  { code: "AE", nameKo: "아랍에미리트", nameEn: "UAE" },
  { code: "SA", nameKo: "사우디아라비아", nameEn: "Saudi Arabia" },
  { code: "EG", nameKo: "이집트", nameEn: "Egypt" },
  { code: "ZA", nameKo: "남아프리카", nameEn: "South Africa" },
];

// ============ Translations ============

const translations: Record<Language, Record<string, string>> = {
  ko: {
    // Header
    "header.title": "더무비 캘린더",
    "header.loading": "로딩 중...",
    "header.general": "개봉작",
    "header.recommended": "추천작",

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
    "header.title": "The Moive Calendar",
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
    "settings.region": "Region",
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
    dayCellToday: "#E9F2FE",
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
