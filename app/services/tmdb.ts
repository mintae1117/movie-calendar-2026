import type {
  Movie,
  MovieDetails,
  MovieVideo,
  TMDbResponse,
  MovieVideosResponse,
  ReleaseDatesResponse,
  EarliestRelease,
  ApiLanguage,
  ApiRegion,
  MovieModalData,
} from "../types";
import { TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from "../constants";
import { movieCache } from "./cache";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/**
 * Convert language code to TMDB API language format
 */
const getApiLanguageCode = (lang: ApiLanguage): string => {
  return lang === "ko" ? "ko-KR" : "en-US";
};

/**
 * TMDB API Service
 * Single Responsibility: Only handles TMDB API interactions
 * Open/Closed: Can be extended with new methods without modifying existing ones
 */
class TMDbService {
  private apiKey: string;
  private baseUrl: string;

  constructor(
    apiKey: string = TMDB_API_KEY || "",
    baseUrl: string = TMDB_BASE_URL
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch upcoming movies for a specific month
   */
  async getUpcomingMovies(
    year: number,
    month: number,
    language: ApiLanguage = "ko",
    region: ApiRegion = "ALL"
  ): Promise<Movie[]> {
    const cacheKey = `upcoming-${year}-${month}-${language}-${region}`;

    return movieCache.getOrFetch(cacheKey, async () => {
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = new Date(year, month, 0).toISOString().split("T")[0];
      const langCode = getApiLanguageCode(language);

      const buildUrl = (page: number) => {
        if (region === "ALL") {
          return `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=${langCode}&sort_by=popularity.desc&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&page=${page}`;
        }
        return `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=${langCode}&region=${region}&sort_by=popularity.desc&release_date.gte=${startDate}&release_date.lte=${endDate}&with_release_type=2|3&page=${page}`;
      };

      // Fetch first 5 pages in parallel
      const initialPages = [1, 2, 3, 4, 5];
      const responses = await Promise.all(
        initialPages.map((page) =>
          fetch(buildUrl(page))
            .then((res) =>
              res.ok ? res.json() : { results: [], total_pages: 0 }
            )
            .catch(() => ({ results: [], total_pages: 0 }))
        )
      );

      const firstData = responses[0] as TMDbResponse;
      const totalPages = Math.min(firstData.total_pages || 0, 10);

      let allResults = responses
        .slice(0, Math.min(5, totalPages))
        .flatMap((data: TMDbResponse) => data.results || []);

      // Fetch remaining pages if needed
      if (totalPages > 5) {
        const remainingPages = Array.from(
          { length: totalPages - 5 },
          (_, i) => i + 6
        );
        const remainingResponses = await Promise.all(
          remainingPages.map((page) =>
            fetch(buildUrl(page))
              .then((res) => (res.ok ? res.json() : { results: [] }))
              .catch(() => ({ results: [] }))
          )
        );
        allResults = [
          ...allResults,
          ...remainingResponses.flatMap(
            (data: TMDbResponse) => data.results || []
          ),
        ];
      }

      return allResults;
    });
  }

  /**
   * Fetch detailed information about a specific movie
   */
  async getMovieDetails(
    movieId: number,
    language: ApiLanguage = "ko"
  ): Promise<MovieDetails> {
    const cacheKey = `details-${movieId}-${language}`;

    return movieCache.getOrFetch(cacheKey, async () => {
      const langCode = getApiLanguageCode(language);
      const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=${langCode}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }

      return response.json();
    });
  }

  /**
   * Fetch videos (trailers, teasers) for a movie
   * Falls back to English videos if no Korean videos found
   */
  async getMovieVideos(
    movieId: number,
    language: ApiLanguage = "ko"
  ): Promise<MovieVideo[]> {
    const cacheKey = `videos-${movieId}-${language}`;

    return movieCache.getOrFetch(cacheKey, async () => {
      const langCode = getApiLanguageCode(language);

      const [primaryResponse, fallbackResponse] = await Promise.all([
        fetch(
          `${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}&language=${langCode}`
        ),
        language === "ko"
          ? fetch(
              `${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}&language=en-US`
            )
          : Promise.resolve(null),
      ]);

      let videos: MovieVideo[] = [];

      if (primaryResponse.ok) {
        const data: MovieVideosResponse = await primaryResponse.json();
        videos = data.results || [];
      }

      // Use English videos if no primary language videos found
      if (videos.length === 0 && fallbackResponse && fallbackResponse.ok) {
        const fallbackData: MovieVideosResponse = await fallbackResponse.json();
        videos = fallbackData.results || [];
      }

      return videos;
    });
  }

  /**
   * Search movies by query string
   */
  async searchMovies(
    query: string,
    language: ApiLanguage = "ko"
  ): Promise<Movie[]> {
    if (!query.trim()) return [];

    const cacheKey = `search-${query}-${language}`;

    return movieCache.getOrFetch(cacheKey, async () => {
      const langCode = getApiLanguageCode(language);
      const url = `${this.baseUrl}/search/movie?api_key=${
        this.apiKey
      }&language=${langCode}&query=${encodeURIComponent(query)}&page=1`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to search movies");
      }

      const data: TMDbResponse = await response.json();
      return data.results;
    });
  }

  /**
   * Fetch release dates for a movie by country
   */
  async getMovieReleaseDates(movieId: number): Promise<ReleaseDatesResponse> {
    const cacheKey = `release-dates-${movieId}`;

    return movieCache.getOrFetch(cacheKey, async () => {
      const url = `${this.baseUrl}/movie/${movieId}/release_dates?api_key=${this.apiKey}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch release dates");
      }

      return response.json();
    });
  }

  /**
   * Fetch all data needed for the movie modal in parallel
   */
  async getMovieModalData(
    movieId: number,
    language: ApiLanguage,
    region: string,
    releaseDate?: string
  ): Promise<MovieModalData> {
    const [details, videos, releaseDatesData] = await Promise.all([
      this.getMovieDetails(movieId, language),
      this.getMovieVideos(movieId, language),
      region === "ALL" && releaseDate
        ? this.getMovieReleaseDates(movieId).catch(() => null)
        : Promise.resolve(null),
    ]);

    let releaseCountry: string | null = null;
    if (releaseDatesData && releaseDate) {
      const earliest = this.findEarliestRelease(releaseDatesData, releaseDate);
      if (earliest) {
        releaseCountry = earliest.country;
      }
    }

    return { details, videos, releaseCountry };
  }

  /**
   * Find the earliest theatrical release from release dates
   */
  findEarliestRelease(
    releaseDates: ReleaseDatesResponse,
    targetDate: string
  ): EarliestRelease | null {
    let earliest: EarliestRelease | null = null;

    for (const country of releaseDates.results) {
      const theatricalReleases = country.release_dates.filter(
        (r) => r.type === 2 || r.type === 3
      );

      for (const release of theatricalReleases) {
        const releaseDate = release.release_date.split("T")[0];

        if (releaseDate === targetDate) {
          return { country: country.iso_3166_1, date: releaseDate };
        }

        if (!earliest || releaseDate < earliest.date) {
          earliest = { country: country.iso_3166_1, date: releaseDate };
        }
      }
    }

    return earliest;
  }

  /**
   * Get the main trailer from a list of videos
   * Priority: Official Trailer > Trailer > Teaser
   */
  getMainTrailer(videos: MovieVideo[]): MovieVideo | null {
    const youtubeVideos = videos.filter((v) => v.site === "YouTube");

    const officialTrailer = youtubeVideos.find(
      (v) => v.type === "Trailer" && v.official
    );
    if (officialTrailer) return officialTrailer;

    const trailer = youtubeVideos.find((v) => v.type === "Trailer");
    if (trailer) return trailer;

    const teaser = youtubeVideos.find((v) => v.type === "Teaser");
    if (teaser) return teaser;

    return youtubeVideos[0] || null;
  }
}

// Export singleton instance
export const tmdbService = new TMDbService();

// Export class for testing or custom instances
export { TMDbService };

// ============ Image URL Helpers ============

export type PosterSize = "w185" | "w342" | "w500" | "original";
export type BackdropSize = "w780" | "w1280" | "original";

export function getPosterUrl(
  path: string | null,
  size: PosterSize = "w342"
): string {
  if (!path) return "/no-poster.png";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: BackdropSize = "w1280"
): string {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
