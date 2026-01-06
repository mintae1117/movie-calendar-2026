"use client";

import { useState, useEffect } from "react";
import type { Movie, MovieDetails, MovieVideo, ApiLanguage } from "../types";
import { tmdbService } from "../services";
import { useSettingsStore } from "../lib/store";

interface UseMovieModalReturn {
  details: MovieDetails | null;
  trailer: MovieVideo | null;
  releaseCountry: string | null;
  loading: boolean;
  isPlayingTrailer: boolean;
  setIsPlayingTrailer: (playing: boolean) => void;
}

/**
 * Custom hook for movie modal data fetching
 * Single Responsibility: Only handles modal data
 */
export function useMovieModal(movie: Movie): UseMovieModalReturn {
  const language = useSettingsStore((state) => state.language);
  const region = useSettingsStore((state) => state.region);

  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [trailer, setTrailer] = useState<MovieVideo | null>(null);
  const [releaseCountry, setReleaseCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const {
          details: detailsData,
          videos,
          releaseCountry: country,
        } = await tmdbService.getMovieModalData(
          movie.id,
          language as ApiLanguage,
          region,
          movie.release_date
        );
        setDetails(detailsData);
        setTrailer(tmdbService.getMainTrailer(videos));
        setReleaseCountry(country);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie.id, language, region, movie.release_date]);

  return {
    details,
    trailer,
    releaseCountry,
    loading,
    isPlayingTrailer,
    setIsPlayingTrailer,
  };
}
