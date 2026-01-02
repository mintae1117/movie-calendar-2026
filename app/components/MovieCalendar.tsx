"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from "date-fns";
import { ko, enUS } from "date-fns/locale";
import { Tooltip } from "react-tooltip";
import {
  FaStar,
  FaSun,
  FaMoon,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  Movie,
  getUpcomingMovies,
  searchMovies,
  getPosterUrl,
  ApiLanguage,
  ApiRegion,
} from "../lib/tmdb";
import { isRecommended } from "../lib/recommendedMovies";
import {
  useSettingsStore,
  themeColors,
  Theme,
  Region,
  REGIONS,
} from "../lib/store";
import MovieModal from "./MovieModal";

const Container = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div<{ $theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const Title = styled.h1<{ $theme: Theme }>`
  font-family: var(--font-poppins), var(--font-noto-sans-kr), sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => themeColors[props.$theme].textPrimary};
  letter-spacing: -0.02em;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const LoadingText = styled.span<{ $theme: Theme }>`
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

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const LegendDot = styled.div<{ $color: string }>`
  width: 0.75rem;
  height: 0.75rem;
  background-color: ${(props) => props.$color};
  border-radius: 0.25rem;
`;

const LegendLabel = styled.span<{ $theme: Theme }>`
  color: ${(props) => themeColors[props.$theme].textSecondary};
`;

const CalendarContainer = styled.div<{ $theme: Theme }>`
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

const Toolbar = styled.div<{ $theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${(props) => themeColors[props.$theme].toolbarBorder};
  flex-shrink: 0;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavButton = styled.button<{ $theme: Theme }>`
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

const MonthTitle = styled.h2<{ $theme: Theme }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => themeColors[props.$theme].textPrimary};
  margin-left: 10px;
`;

const Select = styled.select<{ $theme: Theme }>`
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

const WeekdayHeader = styled.div<{ $theme: Theme }>`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-bottom: 1px solid ${(props) => themeColors[props.$theme].dayCellBorder};
`;

const WeekdayCell = styled.div<{
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

const CalendarGrid = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: 1fr;
`;

const DayCell = styled.div<{
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

const DateNumber = styled.div<{
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

  /* 오늘 날짜 표시를 위한 컨테이너 */
  display: flex;
  justify-content: flex-end;

  /* 날짜 숫자를 span처럼 동작하도록 */
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

const EventsContainer = styled.div<{ $theme: Theme }>`
  flex: 1;
  overflow-y: auto;
  padding: 0 0.25rem 0.25rem;
  min-height: 0;

  /* Custom scrollbar */
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

const EventItem = styled.div<{ $isRecommended: boolean }>`
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

const EventPoster = styled.img`
  width: 1rem;
  height: 1.25rem;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
`;

const EventTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RecommendStar = styled.span`
  flex-shrink: 0;
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const ToggleContainer = styled.div<{ $theme: Theme }>`
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

const ToggleButton = styled.button<{ $isActive: boolean; $theme: Theme }>`
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

const MonthInput = styled.input<{ $theme: Theme }>`
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

  /* 다크모드에서 달력 아이콘 색상 */
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: ${(props) => (props.$theme === "dark" ? "invert(1)" : "none")};
  }
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input<{ $theme: Theme }>`
  padding: 0.25rem 0.5rem 0.25rem 2rem;
  border: 1px solid ${(props) => themeColors[props.$theme].selectBorder};
  border-radius: 0.375rem;
  background: ${(props) => themeColors[props.$theme].selectBg};
  color: ${(props) => themeColors[props.$theme].selectText};
  font-size: 0.8125rem;
  font-weight: 500;
  width: 180px;
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

const SearchIcon = styled.div<{ $theme: Theme }>`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => themeColors[props.$theme].textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchResults = styled.div<{ $theme: Theme }>`
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

  /* Custom scrollbar */
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

const SearchResultItem = styled.div<{ $theme: Theme }>`
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

const SearchResultPoster = styled.img`
  width: 2.5rem;
  height: 3.5rem;
  object-fit: cover;
  border-radius: 0.25rem;
  flex-shrink: 0;
`;

const SearchResultNoPoster = styled.div<{ $theme: Theme }>`
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

const SearchResultInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SearchResultTitle = styled.div<{ $theme: Theme }>`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(props) => themeColors[props.$theme].textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SearchResultYear = styled.div<{ $theme: Theme }>`
  font-size: 0.75rem;
  color: ${(props) => themeColors[props.$theme].textMuted};
  margin-top: 0.125rem;
`;

const SearchNoResults = styled.div<{ $theme: Theme }>`
  padding: 1rem;
  text-align: center;
  color: ${(props) => themeColors[props.$theme].textMuted};
  font-size: 0.8125rem;
`;

const SearchLoading = styled.div<{ $theme: Theme }>`
  padding: 1rem;
  text-align: center;
  color: ${(props) => themeColors[props.$theme].textMuted};
  font-size: 0.8125rem;
`;

// ============ Types & Constants ============

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  movie: Movie;
}

const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDayType = (dayOfWeek: number): "sunday" | "saturday" | "weekday" => {
  if (dayOfWeek === 0) return "sunday";
  if (dayOfWeek === 6) return "saturday";
  return "weekday";
};

// ============ Component ============

export default function MovieCalendar() {
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const region = useSettingsStore((state) => state.region);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const setRegion = useSettingsStore((state) => state.setRegion);
  const t = useSettingsStore((state) => state.t);
  const getRegionName = useSettingsStore((state) => state.getRegionName);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const weekdays = language === "ko" ? WEEKDAYS_KO : WEEKDAYS_EN;

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 테마 변경 시 body 스타일 업데이트
  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "dark" ? "#000000" : "#ffffff";
    document.body.style.color = theme === "dark" ? "#ededed" : "#171717";
  }, [theme]);

  const fetchMoviesForMonth = useCallback(
    async (year: number, month: number, lang: ApiLanguage, reg: ApiRegion) => {
      const monthKey = `${year}-${month}-${lang}-${reg}`;
      if (loadedMonths.has(monthKey)) return;

      setLoading(true);
      try {
        const newMovies = await getUpcomingMovies(year, month, lang, reg);
        // 현재 설정과 일치하는지 확인 (race condition 방지)
        const currentLang = useSettingsStore.getState().language;
        const currentReg = useSettingsStore.getState().region;
        if (lang !== currentLang || reg !== currentReg) {
          return; // 설정이 변경되었으면 결과 무시
        }
        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const uniqueNewMovies = newMovies.filter(
            (m) => !existingIds.has(m.id)
          );
          return [...prev, ...uniqueNewMovies];
        });
        setLoadedMonths((prev) => new Set(prev).add(monthKey));
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    },
    [loadedMonths]
  );

  // 언어 또는 지역 변경 시 영화 데이터 리셋
  useEffect(() => {
    setMovies([]);
    setLoadedMonths(new Set());
  }, [language, region]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    fetchMoviesForMonth(year, month, language, region as ApiRegion);
  }, [currentDate, fetchMoviesForMonth, language, region]);

  const events: CalendarEvent[] = useMemo(() => {
    return movies
      .filter((movie) => movie.release_date)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        date: new Date(movie.release_date),
        movie,
      }));
  }, [movies]);

  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(event);
    });

    // 각 날짜별로 추천 영화를 최상단에 정렬
    // 추천 조건: 수동 추천 OR (평점 7.5+ AND 평가 100+) OR 인기도 300+
    const checkRecommended = (movie: Movie) =>
      isRecommended(movie) ||
      (movie.vote_average >= 7.5 && movie.vote_count >= 100) ||
      movie.popularity >= 300;

    grouped.forEach((dayEvents) => {
      dayEvents.sort((a, b) => {
        const aRecommended = checkRecommended(a.movie);
        const bRecommended = checkRecommended(b.movie);
        if (aRecommended && !bRecommended) return -1;
        if (!aRecommended && bRecommended) return 1;
        return 0;
      });
    });

    return grouped;
  }, [events]);

  const calendarDays = useMemo(() => {
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
  }, [currentDate]);

  const formatMonthTitle = () => {
    if (language === "ko") {
      return format(currentDate, "yyyy년 M월", { locale: ko });
    }
    return format(currentDate, "MMMM yyyy", { locale: enUS });
  };

  // 검색 기능
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      // 이전 타이머 취소
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!query.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setShowSearchResults(true);
      setIsSearching(true);

      // 디바운스: 300ms 후에 검색 실행
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchMovies(query, language as ApiLanguage);
          setSearchResults(results.slice(0, 10)); // 최대 10개만 표시
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [language]
  );

  const handleSearchResultClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  }, []);

  // 검색 영역 외부 클릭 시 결과 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Container>
      <Header $theme={theme}>
        <Title $theme={theme}>{t("header.title")}</Title>
        <HeaderRight>
          {loading && (
            <LoadingText $theme={theme}>{t("header.loading")}</LoadingText>
          )}
          <Legend>
            <LegendItem>
              <LegendDot $color="#6b7280" />
              <LegendLabel $theme={theme}>{t("header.general")}</LegendLabel>
            </LegendItem>
            <LegendItem className="mr-1.5">
              <LegendDot $color="#10b981" />
              <LegendLabel $theme={theme}>
                {t("header.recommended")}
              </LegendLabel>
            </LegendItem>
          </Legend>
          <Select
            $theme={theme}
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
          >
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>
                {getRegionName(r.code)} {language === "ko" ? "개봉" : "Release"}
              </option>
            ))}
          </Select>
          <ToggleContainer $theme={theme}>
            <ToggleButton
              $isActive={language === "ko"}
              $theme={theme}
              onClick={() => setLanguage("ko")}
            >
              한국어
            </ToggleButton>
            <ToggleButton
              $isActive={language === "en"}
              $theme={theme}
              onClick={() => setLanguage("en")}
            >
              EN
            </ToggleButton>
          </ToggleContainer>
          <ToggleContainer $theme={theme}>
            <ToggleButton
              $isActive={theme === "light"}
              $theme={theme}
              onClick={() => setTheme("light")}
              title="Light"
            >
              <FaSun size={12} />
            </ToggleButton>
            <ToggleButton
              $isActive={theme === "dark"}
              $theme={theme}
              onClick={() => setTheme("dark")}
              title="Dark"
            >
              <FaMoon size={12} />
            </ToggleButton>
          </ToggleContainer>
        </HeaderRight>
      </Header>

      <CalendarContainer $theme={theme}>
        <Toolbar $theme={theme}>
          <ToolbarLeft>
            <ButtonGroup>
              <NavButton
                $theme={theme}
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <FaChevronLeft size={10} />
                {t("nav.prev")}
              </NavButton>
              <NavButton
                $theme={theme}
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                {t("nav.next")}
                <FaChevronRight size={10} />
              </NavButton>
            </ButtonGroup>
            <MonthTitle $theme={theme}>{formatMonthTitle()}</MonthTitle>
          </ToolbarLeft>

          <ToolbarRight>
            <SearchContainer ref={searchContainerRef}>
              <SearchIcon $theme={theme}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </SearchIcon>
              <SearchInput
                $theme={theme}
                type="text"
                placeholder={
                  language === "ko" ? "영화 검색..." : "Search movies..."
                }
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSearchResults(true)}
              />
              {showSearchResults && (
                <SearchResults $theme={theme}>
                  {isSearching ? (
                    <SearchLoading $theme={theme}>
                      {language === "ko" ? "검색 중..." : "Searching..."}
                    </SearchLoading>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((movie) => (
                      <SearchResultItem
                        key={movie.id}
                        $theme={theme}
                        onClick={() => handleSearchResultClick(movie)}
                      >
                        {movie.poster_path ? (
                          <SearchResultPoster
                            src={getPosterUrl(movie.poster_path, "w185")}
                            alt=""
                          />
                        ) : (
                          <SearchResultNoPoster $theme={theme}>
                            No Image
                          </SearchResultNoPoster>
                        )}
                        <SearchResultInfo>
                          <SearchResultTitle $theme={theme}>
                            {movie.title}
                          </SearchResultTitle>
                          <SearchResultYear $theme={theme}>
                            {movie.release_date
                              ? movie.release_date.split("-")[0]
                              : language === "ko"
                              ? "개봉일 미정"
                              : "TBA"}
                          </SearchResultYear>
                        </SearchResultInfo>
                      </SearchResultItem>
                    ))
                  ) : (
                    <SearchNoResults $theme={theme}>
                      {language === "ko"
                        ? "검색 결과가 없습니다"
                        : "No results found"}
                    </SearchNoResults>
                  )}
                </SearchResults>
              )}
            </SearchContainer>

            <MonthInput
              $theme={theme}
              type="month"
              value={format(currentDate, "yyyy-MM")}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-").map(Number);
                if (year && month) {
                  setCurrentDate(new Date(year, month - 1, 1));
                }
              }}
            />
          </ToolbarRight>
        </Toolbar>

        <WeekdayHeader $theme={theme}>
          {weekdays.map((day, index) => (
            <WeekdayCell key={day} $dayType={getDayType(index)} $theme={theme}>
              {day}
            </WeekdayCell>
          ))}
        </WeekdayHeader>

        <CalendarGrid>
          {calendarDays.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate.get(dateKey) || [];
            const isCurrentMonth = isSameMonth(day, currentDate);
            const dayOfWeek = day.getDay();

            return (
              <DayCell
                key={index}
                $isCurrentMonth={isCurrentMonth}
                $isToday={isToday(day)}
                $theme={theme}
              >
                <DateNumber
                  $isCurrentMonth={isCurrentMonth}
                  $dayType={getDayType(dayOfWeek)}
                  $isToday={isToday(day)}
                  $theme={theme}
                >
                  <span>{format(day, "d")}</span>
                </DateNumber>

                <EventsContainer $theme={theme}>
                  {dayEvents.map((event) => {
                    const recommended =
                      isRecommended(event.movie) ||
                      (event.movie.vote_average >= 7.5 &&
                        event.movie.vote_count >= 100) ||
                      event.movie.popularity >= 300;
                    const releaseDate = new Date(event.movie.release_date);
                    const formattedDate =
                      language === "ko"
                        ? format(releaseDate, "yyyy년 M월 d일", { locale: ko })
                        : format(releaseDate, "MMM d, yyyy", { locale: enUS });

                    const tooltipHtml = `
                      <div style="display: flex; gap: 10px; align-items: flex-start; max-width: 280px;">
                        ${
                          event.movie.poster_path
                            ? `<img src="${getPosterUrl(
                                event.movie.poster_path,
                                "w185"
                              )}" style="width: 50px; border-radius: 4px;" />`
                            : ""
                        }
                        <div style="flex: 1;">
                          <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${
                            event.title
                          }</div>
                          <div style="font-size: 11px; opacity: 0.9;">${formattedDate}</div>
                          ${
                            recommended
                              ? `<div style="font-size: 11px; margin-top: 4px;">${t(
                                  "tooltip.recommended"
                                )}</div>`
                              : ""
                          }
                        </div>
                      </div>
                    `;

                    return (
                      <EventItem
                        key={event.id}
                        $isRecommended={recommended}
                        onClick={() => setSelectedMovie(event.movie)}
                        data-tooltip-id={
                          isMobile
                            ? undefined
                            : recommended
                            ? "recommend-tooltip"
                            : "general-tooltip"
                        }
                        data-tooltip-html={isMobile ? undefined : tooltipHtml}
                      >
                        {event.movie.poster_path && (
                          <EventPoster
                            src={getPosterUrl(event.movie.poster_path, "w185")}
                            alt=""
                          />
                        )}
                        <EventTitle>{event.title}</EventTitle>
                        {recommended && (
                          <RecommendStar>
                            <FaStar />
                          </RecommendStar>
                        )}
                      </EventItem>
                    );
                  })}
                </EventsContainer>
              </DayCell>
            );
          })}
        </CalendarGrid>
      </CalendarContainer>

      {!isMobile && (
        <>
          <Tooltip
            id="general-tooltip"
            place="top"
            style={{
              backgroundColor: "#606673",
              color: "white",
              borderRadius: "10px",
              padding: "10px 12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 9999,
            }}
          />
          <Tooltip
            id="recommend-tooltip"
            place="top"
            style={{
              backgroundColor: "#0faa76",
              color: "white",
              borderRadius: "10px",
              padding: "10px 12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 9999,
            }}
          />
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </Container>
  );
}
