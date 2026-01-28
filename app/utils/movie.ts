import type { Movie } from "../types";
import { isRecommended as isManuallyRecommended } from "../lib/recommendedMovies";

/**
 * Recommendation criteria thresholds
 */
const RECOMMENDATION_THRESHOLDS = {
  minVoteAverage: 7.2,
  minVoteCount: 100,
  minPopularity: 300,
} as const;

/**
 * Check if a movie is recommended based on multiple criteria:
 * - Manual recommendation list
 * - High vote average (>=7.5) with sufficient votes (>=100)
 * - High popularity (>=300)
 */
export function isMovieRecommended(movie: Movie): boolean {
  return (
    isManuallyRecommended(movie) ||
    (movie.vote_average >= RECOMMENDATION_THRESHOLDS.minVoteAverage &&
      movie.vote_count >= RECOMMENDATION_THRESHOLDS.minVoteCount) ||
    movie.popularity >= RECOMMENDATION_THRESHOLDS.minPopularity
  );
}

/**
 * Sort movies with recommended ones first
 */
export function sortByRecommendation<T extends { movie: Movie }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const aRecommended = isMovieRecommended(a.movie);
    const bRecommended = isMovieRecommended(b.movie);
    if (aRecommended && !bRecommended) return -1;
    if (!aRecommended && bRecommended) return 1;
    return 0;
  });
}

/**
 * Get year from release date string
 */
export function getReleaseYear(releaseDate: string | null): string | null {
  if (!releaseDate) return null;
  return releaseDate.split("-")[0];
}
