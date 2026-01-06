import { format } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import type { Language } from "../types";

/**
 * Format a date string for display based on language
 */
export function formatDate(dateStr: string, language: Language): string {
  const date = new Date(dateStr);
  if (language === "ko") {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format runtime in minutes to human readable format
 */
export function formatRuntime(minutes: number, language: Language): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (language === "ko") {
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  }
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
}

/**
 * Format month title based on language
 */
export function formatMonthTitle(date: Date, language: Language): string {
  if (language === "ko") {
    return format(date, "yyyy년 M월", { locale: ko });
  }
  return format(date, "MMMM yyyy", { locale: enUS });
}

/**
 * Format date for tooltip display
 */
export function formatTooltipDate(date: Date, language: Language): string {
  if (language === "ko") {
    return format(date, "yyyy년 M월 d일", { locale: ko });
  }
  return format(date, "MMM d, yyyy", { locale: enUS });
}

/**
 * Get locale for date-fns based on language
 */
export function getDateLocale(language: Language) {
  return language === "ko" ? ko : enUS;
}
