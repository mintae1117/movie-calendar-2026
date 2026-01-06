import styled from "styled-components";
import type { Theme } from "../../types";
import { themeColors } from "../../constants";

export const Container = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div<{ $theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex-shrink: 0;
`;

export const Title = styled.h1<{ $theme: Theme }>`
  font-family: var(--font-poppins), var(--font-noto-sans-kr), sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => themeColors[props.$theme].textPrimary};
  letter-spacing: -0.02em;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const LoadingText = styled.span<{ $theme: Theme }>`
  font-size: 0.875rem;
  color: ${(props) => themeColors[props.$theme].textSecondary};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const LegendDot = styled.div<{ $color: string }>`
  width: 0.75rem;
  height: 0.75rem;
  background-color: ${(props) => props.$color};
  border-radius: 0.25rem;
`;

export const LegendLabel = styled.span<{ $theme: Theme }>`
  color: ${(props) => themeColors[props.$theme].textSecondary};
`;

export const CalendarContainer = styled.div<{ $theme: Theme }>`
  flex: 1;
  min-height: 0;
  background-color: ${(props) => themeColors[props.$theme].calendarBg};
  border-radius: 0.5rem;
  box-shadow: ${(props) => themeColors[props.$theme].calendarShadow};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => themeColors[props.$theme].calendarBorder};
`;

export const Toolbar = styled.div<{ $theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${(props) => themeColors[props.$theme].toolbarBorder};
  flex-shrink: 0;
`;

export const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const NavButton = styled.button<{ $theme: Theme }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${(props) => themeColors[props.$theme].buttonBorder};
  border-radius: 0.375rem;
  background: ${(props) => themeColors[props.$theme].buttonBg};
  color: ${(props) => themeColors[props.$theme].buttonText};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background-color: ${(props) => themeColors[props.$theme].buttonHover};
  }
`;

export const MonthTitle = styled.h2<{ $theme: Theme }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => themeColors[props.$theme].textPrimary};
  margin-left: 10px;
`;

export const Select = styled.select<{ $theme: Theme }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${(props) => themeColors[props.$theme].selectBorder};
  border-radius: 0.375rem;
  background: ${(props) => themeColors[props.$theme].selectBg};
  color: ${(props) => themeColors[props.$theme].selectText};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  option {
    background: ${(props) => themeColors[props.$theme].selectBg};
    color: ${(props) => themeColors[props.$theme].selectText};
  }
`;

export const WeekdayHeader = styled.div<{ $theme: Theme }>`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-bottom: 1px solid ${(props) => themeColors[props.$theme].dayCellBorder};
`;

export const WeekdayCell = styled.div<{
  $dayType: "sunday" | "saturday" | "weekday";
  $theme: Theme;
}>`
  padding: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${(props) => themeColors[props.$theme].weekdayBg};
  color: ${(props) =>
    props.$dayType === "sunday"
      ? "#ef4444"
      : props.$dayType === "saturday"
      ? "#3b82f6"
      : themeColors[props.$theme].textSecondary};
`;

export const CalendarGrid = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: 1fr;
`;

export const DayCell = styled.div<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $theme: Theme;
}>`
  border-bottom: 1px solid ${(props) => themeColors[props.$theme].dayCellBorder};
  border-right: 1px solid ${(props) => themeColors[props.$theme].dayCellBorder};
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  background-color: ${(props) =>
    props.$isToday
      ? themeColors[props.$theme].dayCellToday
      : props.$isCurrentMonth
      ? themeColors[props.$theme].dayCellBg
      : themeColors[props.$theme].dayCellOtherMonth};
`;

export const DateNumber = styled.div<{
  $isCurrentMonth: boolean;
  $dayType: "sunday" | "saturday" | "weekday";
  $isToday: boolean;
  $theme: Theme;
}>`
  padding: 0.25rem;
  text-align: right;
  font-size: 0.875rem;
  flex-shrink: 0;
  font-weight: ${(props) => (props.$isToday ? "700" : "400")};
  color: ${(props) => {
    if (props.$isToday) return "white";
    if (!props.$isCurrentMonth) return themeColors[props.$theme].textMuted;
    if (props.$dayType === "sunday") return "#ef4444";
    if (props.$dayType === "saturday") return "#3b82f6";
    return themeColors[props.$theme].textPrimary;
  }};

  display: flex;
  justify-content: flex-end;

  & > span {
    ${(props) =>
      props.$isToday
        ? `
      background-color: #3b82f6;
      border-radius: 50%;
      width: 1.7rem;
      height: 1.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
    `
        : ""}
  }
`;

export const EventsContainer = styled.div<{ $theme: Theme }>`
  flex: 1;
  overflow-y: auto;
  padding: 0 0.25rem 0.25rem;
  min-height: 0;

  scrollbar-width: thin;
  scrollbar-color: ${(props) => themeColors[props.$theme].scrollbarThumb}
    transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => themeColors[props.$theme].scrollbarThumb};
    border-radius: 2px;
  }
`;

export const EventItem = styled.div<{ $isRecommended: boolean }>`
  margin-bottom: 0.25rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow: hidden;
  background-color: ${(props) =>
    props.$isRecommended ? "#10b981" : "#6b7280"};

  &:hover {
    background-color: ${(props) =>
      props.$isRecommended ? "#059669" : "#4b5563"};
  }
`;

export const EventPoster = styled.img`
  width: 1rem;
  height: 1.25rem;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
`;

export const EventTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RecommendStar = styled.span`
  flex-shrink: 0;
  margin-left: auto;
  display: flex;
  align-items: center;
`;

export const ToggleContainer = styled.div<{ $theme: Theme }>`
  display: inline-flex;
  height: 1.75rem;
  background-color: ${(props) =>
    props.$theme === "dark"
      ? "rgba(55, 65, 81, 0.8)"
      : "rgba(243, 244, 246, 0.9)"};
  border: 1px solid ${(props) => themeColors[props.$theme].selectBorder};
  border-radius: 0.375rem;
  padding: 2px;
  gap: 2px;
`;

export const ToggleButton = styled.button<{
  $isActive: boolean;
  $theme: Theme;
}>`
  padding: 0 0.5rem;
  height: 100%;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;

  background-color: ${(props) =>
    props.$isActive
      ? props.$theme === "dark"
        ? "rgba(30, 30, 46, 0.9)"
        : "rgba(255, 255, 255, 0.95)"
      : "transparent"};
  color: ${(props) =>
    props.$isActive
      ? themeColors[props.$theme].textPrimary
      : themeColors[props.$theme].textMuted};
  box-shadow: ${(props) =>
    props.$isActive ? "0 1px 2px 0 rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    color: ${(props) => themeColors[props.$theme].textPrimary};
  }

  &:focus {
    outline: none;
  }
`;

export const MonthInput = styled.input<{ $theme: Theme }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${(props) => themeColors[props.$theme].selectBorder};
  border-radius: 0.375rem;
  background: ${(props) => themeColors[props.$theme].selectBg};
  color: ${(props) => themeColors[props.$theme].selectText};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #3b82f6;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: ${(props) => (props.$theme === "dark" ? "invert(1)" : "none")};
  }
`;

export const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SearchContainer = styled.div`
  position: relative;
`;

export const SearchInput = styled.input<{ $theme: Theme }>`
  padding: 0.25rem 0.5rem 0.25rem 2rem;
  border: 1px solid ${(props) => themeColors[props.$theme].selectBorder};
  border-radius: 0.375rem;
  background: ${(props) => themeColors[props.$theme].selectBg};
  color: ${(props) => themeColors[props.$theme].selectText};
  font-size: 0.8125rem;
  font-weight: 500;
  width: 240px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #3b82f6;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &::placeholder {
    color: ${(props) => themeColors[props.$theme].textMuted};
  }
`;

export const SearchIcon = styled.div<{ $theme: Theme }>`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => themeColors[props.$theme].textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchResults = styled.div<{ $theme: Theme }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background: ${(props) => themeColors[props.$theme].calendarBg};
  border: 1px solid ${(props) => themeColors[props.$theme].calendarBorder};
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;

  scrollbar-width: thin;
  scrollbar-color: ${(props) => themeColors[props.$theme].scrollbarThumb}
    transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => themeColors[props.$theme].scrollbarThumb};
    border-radius: 3px;
  }
`;

export const SearchResultItem = styled.div<{ $theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${(props) =>
      props.$theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"};
  }

  &:not(:last-child) {
    border-bottom: 1px solid
      ${(props) => themeColors[props.$theme].calendarBorder};
  }
`;

export const SearchResultPoster = styled.img`
  width: 2.5rem;
  height: 3.5rem;
  object-fit: cover;
  border-radius: 0.25rem;
  flex-shrink: 0;
`;

export const SearchResultNoPoster = styled.div<{ $theme: Theme }>`
  width: 2.5rem;
  height: 3.5rem;
  background: ${(props) => (props.$theme === "dark" ? "#374151" : "#e5e7eb")};
  border-radius: 0.25rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => themeColors[props.$theme].textMuted};
  font-size: 0.625rem;
`;

export const SearchResultInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SearchResultTitle = styled.div<{ $theme: Theme }>`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(props) => themeColors[props.$theme].textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SearchResultYear = styled.div<{ $theme: Theme }>`
  font-size: 0.75rem;
  color: ${(props) => themeColors[props.$theme].textMuted};
  margin-top: 0.125rem;
`;

export const SearchNoResults = styled.div<{ $theme: Theme }>`
  padding: 1rem;
  text-align: center;
  color: ${(props) => themeColors[props.$theme].textMuted};
  font-size: 0.8125rem;
`;

export const SearchLoading = styled.div<{ $theme: Theme }>`
  padding: 1rem;
  text-align: center;
  color: ${(props) => themeColors[props.$theme].textMuted};
  font-size: 0.8125rem;
`;
