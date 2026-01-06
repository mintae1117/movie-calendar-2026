"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import type { Movie, CalendarEvent, ApiLanguage, ApiRegion } from "../types";
import { tmdbService } from "../services";
import { getMonthKey } from "../utils";
import { useSettingsStore } from "../lib/store";

interface UseMoviesOptions {
  year: number;
  month: number;
}

interface UseMoviesReturn {
  movies: Movie[];
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing movie data
 * Single Responsibility: Only handles movie data fetching and state
 */
export function useMovies({ year, month }: UseMoviesOptions): UseMoviesReturn {
  const language = useSettingsStore((state) => state.language);
  const region = useSettingsStore((state) => state.region);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());

  const fetchMoviesForMonth = useCallback(
    async (y: number, m: number, lang: ApiLanguage, reg: ApiRegion) => {
      const monthKey = getMonthKey(y, m, lang, reg);
      if (loadedMonths.has(monthKey)) return;

      setLoading(true);
      setError(null);

      try {
        const newMovies = await tmdbService.getUpcomingMovies(y, m, lang, reg);

        // Check current settings to prevent race conditions
        const currentLang = useSettingsStore.getState().language;
        const currentReg = useSettingsStore.getState().region;
        if (lang !== currentLang || reg !== currentReg) {
          return;
        }

        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const uniqueNewMovies = newMovies.filter(
            (m) => !existingIds.has(m.id)
          );
          return [...prev, ...uniqueNewMovies];
        });
        setLoadedMonths((prev) => new Set(prev).add(monthKey));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movies");
        console.error("Failed to fetch movies:", err);
      } finally {
        setLoading(false);
      }
    },
    [loadedMonths]
  );

  // Reset when language or region changes
  useEffect(() => {
    setMovies([]);
    setLoadedMonths(new Set());
  }, [language, region]);

  // Fetch movies when month changes
  useEffect(() => {
    fetchMoviesForMonth(
      year,
      month,
      language as ApiLanguage,
      region as ApiRegion
    );
  }, [year, month, fetchMoviesForMonth, language, region]);

  // Transform movies to calendar events
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

  const refetch = useCallback(async () => {
    setLoadedMonths(new Set());
    await fetchMoviesForMonth(
      year,
      month,
      language as ApiLanguage,
      region as ApiRegion
    );
  }, [year, month, language, region, fetchMoviesForMonth]);

  return { movies, events, loading, error, refetch };
}
