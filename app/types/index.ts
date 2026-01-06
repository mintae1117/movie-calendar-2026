// ============ Theme & Language Types ============

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

export type ApiLanguage = "ko" | "en";
export type ApiRegion = Region;

// ============ Movie Types ============

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

// ============ API Response Types ============

export interface TMDbResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieVideosResponse {
  id: number;
  results: MovieVideo[];
}

export interface ReleaseDate {
  iso_3166_1: string;
  release_dates: {
    certification: string;
    release_date: string;
    type: number;
  }[];
}

export interface ReleaseDatesResponse {
  id: number;
  results: ReleaseDate[];
}

export interface EarliestRelease {
  country: string;
  date: string;
}

// ============ Calendar Types ============

export interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  movie: Movie;
}

// ============ Region Types ============

export interface RegionInfo {
  code: Region;
  nameKo: string;
  nameEn: string;
}

// ============ Country Types ============

export interface CountryName {
  ko: string;
  en: string;
}

// ============ Theme Colors Type ============

export interface ThemeColors {
  pageBg: string;
  calendarBg: string;
  calendarBorder: string;
  calendarShadow: string;
  headerBg: string;
  toolbarBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  weekdayBg: string;
  dayCellBg: string;
  dayCellOtherMonth: string;
  dayCellToday: string;
  dayCellBorder: string;
  buttonBg: string;
  buttonBorder: string;
  buttonText: string;
  buttonHover: string;
  selectBg: string;
  selectBorder: string;
  selectText: string;
  scrollbarThumb: string;
  modalBg: string;
  modalOverlay: string;
}

// ============ Store Types ============

export interface SettingsState {
  theme: Theme;
  language: Language;
  region: Region;
  _hasHydrated: boolean;
}

export interface SettingsActions {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setRegion: (region: Region) => void;
  setHasHydrated: (state: boolean) => void;
}

export interface SettingsHelpers {
  t: (key: string) => string;
  getRegionName: (code: Region) => string;
}

export type SettingsStore = SettingsState & SettingsActions & SettingsHelpers;

// ============ Modal Data Type ============

export interface MovieModalData {
  details: MovieDetails;
  videos: MovieVideo[];
  releaseCountry: string | null;
}
