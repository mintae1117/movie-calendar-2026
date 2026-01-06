"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { addMonths, subMonths, format } from "date-fns";
import { Tooltip } from "react-tooltip";
import type { Movie, CalendarEvent } from "../../types";
import { useSettingsStore } from "../../lib/store";
import { useMovies, useMovieSearch, useMobile } from "../../hooks";
import { sortByRecommendation } from "../../utils";
import MovieModal from "../Modal";

import { CalendarHeader } from "./CalendarHeader";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarGridView } from "./CalendarGrid";
import { Container, CalendarContainer } from "./styles";

export default function MovieCalendar() {
  // Store selectors
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const region = useSettingsStore((state) => state.region);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const setRegion = useSettingsStore((state) => state.setRegion);
  const t = useSettingsStore((state) => state.t);
  const getRegionName = useSettingsStore((state) => state.getRegionName);

  // Local state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Custom hooks
  const isMobile = useMobile();
  const { events, loading } = useMovies({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  });
  const {
    searchQuery,
    searchResults,
    isSearching,
    showSearchResults,
    handleSearchChange,
    handleSearchResultClick: onSearchResultClick,
    setShowSearchResults,
  } = useMovieSearch(setSelectedMovie);

  // Theme effect on body
  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "dark" ? "#000000" : "#ffffff";
    document.body.style.color = theme === "dark" ? "#ededed" : "#171717";
  }, [theme]);

  // Group events by date with sorting
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(event);
    });

    // Sort each day's events with recommended first
    grouped.forEach((dayEvents, key) => {
      grouped.set(key, sortByRecommendation(dayEvents));
    });

    return grouped;
  }, [events]);

  // Handlers
  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedMovie(event.movie);
  }, []);

  const handleSearchFocus = useCallback(() => {
    if (searchQuery) {
      setShowSearchResults(true);
    }
  }, [searchQuery, setShowSearchResults]);

  return (
    <Container>
      <CalendarHeader
        theme={theme}
        language={language}
        region={region}
        loading={loading}
        t={t}
        getRegionName={getRegionName}
        setTheme={setTheme}
        setLanguage={setLanguage}
        setRegion={setRegion}
      />

      <CalendarContainer $theme={theme}>
        <CalendarToolbar
          theme={theme}
          language={language}
          currentDate={currentDate}
          searchQuery={searchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          showSearchResults={showSearchResults}
          t={t}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onMonthChange={handleMonthChange}
          onSearchChange={handleSearchChange}
          onSearchResultClick={onSearchResultClick}
          onSearchFocus={handleSearchFocus}
          setShowSearchResults={setShowSearchResults}
        />

        <CalendarGridView
          theme={theme}
          language={language}
          currentDate={currentDate}
          eventsByDate={eventsByDate}
          isMobile={isMobile}
          t={t}
          onEventClick={handleEventClick}
        />
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
