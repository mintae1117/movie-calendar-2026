"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
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
import { ko } from "date-fns/locale";
import { Tooltip } from "react-tooltip";
import { FaStar } from "react-icons/fa";
import { Movie, getUpcomingMovies, getPosterUrl } from "../lib/tmdb";
import MovieModal from "./MovieModal";

// ============ Styled Components ============

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LoadingText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
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

const LegendLabel = styled.span`
  color: #4b5563;
`;

const CalendarContainer = styled.div`
  flex: 1;
  min-height: 0;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: black;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const MonthTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: black;
  font-weight: 500;
  cursor: pointer;

  &:focus {
    outline: none;
    ring: 2px solid #3b82f6;
  }
`;

const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-bottom: 1px solid #e5e7eb;
`;

const WeekdayCell = styled.div<{ $dayType: "sunday" | "saturday" | "weekday" }>`
  padding: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #f9fafb;
  color: ${(props) =>
    props.$dayType === "sunday"
      ? "#ef4444"
      : props.$dayType === "saturday"
      ? "#3b82f6"
      : "#4b5563"};
`;

const CalendarGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  overflow: hidden;
`;

const DayCell = styled.div<{ $isCurrentMonth: boolean; $isToday: boolean }>`
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  background-color: ${(props) =>
    props.$isToday ? "#eff6ff" : props.$isCurrentMonth ? "white" : "#f9fafb"};
`;

const DateNumber = styled.div<{
  $isCurrentMonth: boolean;
  $dayType: "sunday" | "saturday" | "weekday";
  $isToday: boolean;
}>`
  padding: 0.25rem;
  text-align: right;
  font-size: 0.875rem;
  flex-shrink: 0;
  font-weight: ${(props) => (props.$isToday ? "700" : "400")};
  color: ${(props) => {
    if (!props.$isCurrentMonth) return "#9ca3af";
    if (props.$dayType === "sunday") return "#ef4444";
    if (props.$dayType === "saturday") return "#3b82f6";
    return "#374151";
  }};
`;

const EventsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 0.25rem 0.25rem;
  min-height: 0;

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
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
    props.$isRecommended ? "#10b981" : "#3b82f6"};

  &:hover {
    background-color: ${(props) =>
      props.$isRecommended ? "#059669" : "#2563eb"};
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

// ============ Types & Constants ============

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  movie: Movie;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const RECOMMENDED_MOVIES = [
  "28년 후: 뼈의 사원",
  "28 Years Later: The Bone Temple",
  "프로젝트 Y",
  "Project Y",
  "노 머시: 90분",
  "No Mercy: 90 Minutes",
];

const isRecommended = (movie: Movie): boolean => {
  return (
    RECOMMENDED_MOVIES.includes(movie.title) ||
    RECOMMENDED_MOVIES.includes(movie.original_title)
  );
};

const getDayType = (dayOfWeek: number): "sunday" | "saturday" | "weekday" => {
  if (dayOfWeek === 0) return "sunday";
  if (dayOfWeek === 6) return "saturday";
  return "weekday";
};

// ============ Component ============

export default function MovieCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());

  const fetchMoviesForMonth = useCallback(
    async (year: number, month: number) => {
      const monthKey = `${year}-${month}`;
      if (loadedMonths.has(monthKey)) return;

      setLoading(true);
      try {
        const newMovies = await getUpcomingMovies(year, month);
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

  useEffect(() => {
    fetchMoviesForMonth(2026, 1);
  }, []);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    if (year >= 2026) {
      fetchMoviesForMonth(year, month);
    }
  }, [currentDate, fetchMoviesForMonth]);

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

  return (
    <Container>
      <Header>
        <Title>영화 개봉 캘린더</Title>
        <HeaderRight>
          {loading && <LoadingText>로딩 중...</LoadingText>}
          <Legend>
            <LegendItem>
              <LegendDot $color="#3b82f6" />
              <LegendLabel>일반</LegendLabel>
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#10b981" />
              <LegendLabel>주인장 추천</LegendLabel>
            </LegendItem>
          </Legend>
        </HeaderRight>
      </Header>

      <CalendarContainer>
        <Toolbar>
          <ButtonGroup>
            <NavButton
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              이전
            </NavButton>
            <NavButton
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              다음
            </NavButton>
          </ButtonGroup>

          <MonthTitle>
            {format(currentDate, "yyyy년 M월", { locale: ko })}
          </MonthTitle>

          <ButtonGroup>
            <Select
              value={currentDate.getFullYear()}
              onChange={(e) =>
                setCurrentDate(
                  new Date(parseInt(e.target.value), currentDate.getMonth(), 1)
                )
              }
            >
              {[2026, 2027, 2028, 2029, 2030].map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </Select>
            <Select
              value={currentDate.getMonth()}
              onChange={(e) =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    parseInt(e.target.value),
                    1
                  )
                )
              }
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {i + 1}월
                </option>
              ))}
            </Select>
          </ButtonGroup>
        </Toolbar>

        <WeekdayHeader>
          {WEEKDAYS.map((day, index) => (
            <WeekdayCell key={day} $dayType={getDayType(index)}>
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
              >
                <DateNumber
                  $isCurrentMonth={isCurrentMonth}
                  $dayType={getDayType(dayOfWeek)}
                  $isToday={isToday(day)}
                >
                  {format(day, "d")}
                </DateNumber>

                <EventsContainer>
                  {dayEvents.map((event) => {
                    const recommended = isRecommended(event.movie);
                    return (
                      <EventItem
                        key={event.id}
                        $isRecommended={recommended}
                        onClick={() => setSelectedMovie(event.movie)}
                        data-tooltip-id="recommend-tooltip"
                        data-tooltip-content={
                          recommended ? "주인장 추천!" : undefined
                        }
                      >
                        {event.movie.poster_path && (
                          <EventPoster
                            src={getPosterUrl(event.movie.poster_path, "w185")}
                            alt=""
                          />
                        )}
                        <EventTitle>{event.title}</EventTitle>
                        {recommended && <RecommendStar><FaStar /></RecommendStar>}
                      </EventItem>
                    );
                  })}
                </EventsContainer>
              </DayCell>
            );
          })}
        </CalendarGrid>
      </CalendarContainer>

      <Tooltip
        id="recommend-tooltip"
        place="top"
        style={{
          backgroundColor: "#10b981",
          color: "white",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "8px 12px",
        }}
      />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </Container>
  );
}
