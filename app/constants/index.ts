export { REGIONS, COUNTRY_NAMES } from "./regions";
export { themeColors } from "./theme";
export { translations, WEEKDAYS_KO, WEEKDAYS_EN } from "./translations";

// API Constants
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// UI Constants
export const MOBILE_BREAKPOINT = 768;
export const SEARCH_DEBOUNCE_MS = 300;
export const MAX_SEARCH_RESULTS = 10;
export const MAX_PRODUCTION_COMPANIES = 5;
