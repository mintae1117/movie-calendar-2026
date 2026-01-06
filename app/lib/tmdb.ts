// Re-export everything from the new services layer for backward compatibility
export { tmdbService, getPosterUrl, getBackdropUrl } from "../services";

// Re-export types
export type {
  Movie,
  MovieDetails,
  MovieVideo,
  TMDbResponse,
  ApiLanguage,
  ApiRegion,
  ReleaseDatesResponse,
  EarliestRelease,
} from "../types";

// Backward compatible function exports
import { tmdbService } from "../services";
import type {
  ApiLanguage,
  ApiRegion,
  Movie,
  MovieDetails,
  MovieVideo,
  ReleaseDatesResponse,
  EarliestRelease,
} from "../types";

export async function getUpcomingMovies(
  year: number,
  month: number,
  language: ApiLanguage = "ko",
  region: ApiRegion = "ALL"
): Promise<Movie[]> {
  return tmdbService.getUpcomingMovies(year, month, language, region);
}

export async function getMovieDetails(
  movieId: number,
  language: ApiLanguage = "ko"
): Promise<MovieDetails> {
  return tmdbService.getMovieDetails(movieId, language);
}

export async function getMovieVideos(
  movieId: number,
  language: ApiLanguage = "ko"
): Promise<MovieVideo[]> {
  return tmdbService.getMovieVideos(movieId, language);
}

export async function searchMovies(
  query: string,
  language: ApiLanguage = "ko"
): Promise<Movie[]> {
  return tmdbService.searchMovies(query, language);
}

export async function getMovieReleaseDates(
  movieId: number
): Promise<ReleaseDatesResponse> {
  return tmdbService.getMovieReleaseDates(movieId);
}

export function findEarliestRelease(
  releaseDates: ReleaseDatesResponse,
  targetDate: string
): EarliestRelease | null {
  return tmdbService.findEarliestRelease(releaseDates, targetDate);
}

export function getMainTrailer(videos: MovieVideo[]): MovieVideo | null {
  return tmdbService.getMainTrailer(videos);
}

export async function getMovieModalData(
  movieId: number,
  language: ApiLanguage,
  region: string,
  releaseDate?: string
) {
  return tmdbService.getMovieModalData(movieId, language, region, releaseDate);
}
