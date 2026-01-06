"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Movie, ApiLanguage } from "../types";
import { tmdbService } from "../services";
import { SEARCH_DEBOUNCE_MS, MAX_SEARCH_RESULTS } from "../constants";
import { useSettingsStore } from "../lib/store";

interface UseMovieSearchReturn {
  searchQuery: string;
  searchResults: Movie[];
  isSearching: boolean;
  showSearchResults: boolean;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchResultClick: (movie: Movie) => void;
  setShowSearchResults: (show: boolean) => void;
  clearSearch: () => void;
}

/**
 * Custom hook for movie search functionality
 * Single Responsibility: Only handles search logic
 */
export function useMovieSearch(
  onMovieSelect: (movie: Movie) => void
): UseMovieSearchReturn {
  const language = useSettingsStore((state) => state.language);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      // Clear previous timeout
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

      // Debounced search
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await tmdbService.searchMovies(
            query,
            language as ApiLanguage
          );
          setSearchResults(results.slice(0, MAX_SEARCH_RESULTS));
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, SEARCH_DEBOUNCE_MS);
    },
    [language]
  );

  const handleSearchResultClick = useCallback(
    (movie: Movie) => {
      onMovieSelect(movie);
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
    },
    [onMovieSelect]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    showSearchResults,
    handleSearchChange,
    handleSearchResultClick,
    setShowSearchResults,
    clearSearch,
  };
}
