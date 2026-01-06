import type { Language } from "../types";

export const translations: Record<Language, Record<string, string>> = {
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

    // Search
    "search.placeholder": "영화 검색...",
    "search.loading": "검색 중...",
    "search.noResults": "검색 결과가 없습니다",
    "search.releaseUnknown": "개봉일 미정",

    // Release
    "release.label": "개봉",
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

    // Search
    "search.placeholder": "Search movies...",
    "search.loading": "Searching...",
    "search.noResults": "No results found",
    "search.releaseUnknown": "TBA",

    // Release
    "release.label": "Release",
  },
};

export const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
export const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
