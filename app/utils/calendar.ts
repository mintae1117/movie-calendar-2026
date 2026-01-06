import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";

export type DayType = "sunday" | "saturday" | "weekday";

/**
 * Get day type based on day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayType(dayOfWeek: number): DayType {
  if (dayOfWeek === 0) return "sunday";
  if (dayOfWeek === 6) return "saturday";
  return "weekday";
}

/**
 * Generate array of dates for calendar grid (7x5 or 7x6)
 * Starts from Sunday of the week containing the first day of the month
 * Ends on Saturday of the week containing the last day of the month
 */
export function getCalendarDays(currentDate: Date): Date[] {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }
  return days;
}

/**
 * Generate month key for caching/tracking loaded months
 */
export function getMonthKey(
  year: number,
  month: number,
  language: string,
  region: string
): string {
  return `${year}-${month}-${language}-${region}`;
}
