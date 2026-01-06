// Direct API calls to TMDB with caching

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Simple in-memory cache with TTL
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
}

export interface TMDbResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type ApiLanguage = "ko" | "en";
export type ApiRegion =
  | "ALL"
  | "KR"
  | "US"
  | "JP"
  | "GB"
  | "FR"
  | "DE"
  | "CN"
  | "TW"
  | "HK"
  | "IN"
  | "AU"
  | "CA"
  | "IT"
  | "ES"
  | "BR"
  | "MX"
  | "RU"
  | "SE"
  | "NL"
  | "BE"
  | "PL"
  | "TH"
  | "SG"
  | "MY"
  | "PH"
  | "ID"
  | "VN"
  | "NZ"
  | "AR"
  | "CL"
  | "CO"
  | "PE"
  | "ZA"
  | "EG"
  | "TR"
  | "GR"
  | "PT"
  | "AT"
  | "CH"
  | "DK"
  | "NO"
  | "FI"
  | "IE"
  | "IL"
  | "AE"
  | "SA";

const getApiLanguageCode = (lang: ApiLanguage): string => {
  return lang === "ko" ? "ko-KR" : "en-US";
};

export async function getUpcomingMovies(
  year: number,
  month: number,
  language: ApiLanguage = "ko",
  region: ApiRegion = "ALL"
): Promise<Movie[]> {
  const cacheKey = `upcoming-${year}-${month}-${language}-${region}`;
  const cached = getCached<Movie[]>(cacheKey);
  if (cached) return cached;

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];
  const langCode = getApiLanguageCode(language);

  const buildUrl = (page: number) => {
    if (region === "ALL") {
      return `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=${langCode}&sort_by=popularity.desc&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&page=${page}`;
    }
    return `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=${langCode}&region=${region}&sort_by=popularity.desc&release_date.gte=${startDate}&release_date.lte=${endDate}&with_release_type=2|3&page=${page}`;
  };

  // Fetch first 5 pages in parallel (covers most months)
  const initialPages = [1, 2, 3, 4, 5];
  const responses = await Promise.all(
    initialPages.map((page) =>
      fetch(buildUrl(page))
        .then((res) => (res.ok ? res.json() : { results: [], total_pages: 0 }))
        .catch(() => ({ results: [], total_pages: 0 }))
    )
  );

  const firstData = responses[0] as TMDbResponse;
  const totalPages = Math.min(firstData.total_pages || 0, 10);

  // Collect results from initial requests
  let allResults = responses
    .slice(0, Math.min(5, totalPages))
    .flatMap((data: TMDbResponse) => data.results || []);

  // If more pages needed, fetch them in parallel
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
      ...remainingResponses.flatMap((data: TMDbResponse) => data.results || []),
    ];
  }

  setCache(cacheKey, allResults);
  return allResults;
}

export async function getMovieDetails(
  movieId: number,
  language: ApiLanguage = "ko"
): Promise<MovieDetails> {
  const cacheKey = `details-${movieId}-${language}`;
  const cached = getCached<MovieDetails>(cacheKey);
  if (cached) return cached;

  const langCode = getApiLanguageCode(language);
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=${langCode}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

export function getPosterUrl(
  path: string | null,
  size: "w185" | "w342" | "w500" | "original" = "w342"
): string {
  if (!path) return "/no-poster.png";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: "w780" | "w1280" | "original" = "w1280"
): string {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

interface MovieVideosResponse {
  id: number;
  results: MovieVideo[];
}

export async function getMovieVideos(
  movieId: number,
  language: ApiLanguage = "ko"
): Promise<MovieVideo[]> {
  const cacheKey = `videos-${movieId}-${language}`;
  const cached = getCached<MovieVideo[]>(cacheKey);
  if (cached) return cached;

  const langCode = getApiLanguageCode(language);

  // Fetch both Korean and English videos in parallel
  const [koResponse, enResponse] = await Promise.all([
    fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=${langCode}`
    ),
    language === "ko"
      ? fetch(
          `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        )
      : Promise.resolve(null),
  ]);

  let videos: MovieVideo[] = [];

  if (koResponse.ok) {
    const data: MovieVideosResponse = await koResponse.json();
    videos = data.results || [];
  }

  // Use English videos if no Korean videos found
  if (videos.length === 0 && enResponse && enResponse.ok) {
    const enData: MovieVideosResponse = await enResponse.json();
    videos = enData.results || [];
  }

  setCache(cacheKey, videos);
  return videos;
}

export function getMainTrailer(videos: MovieVideo[]): MovieVideo | null {
  // YouTube 영상만 필터링
  const youtubeVideos = videos.filter((v) => v.site === "YouTube");

  // 우선순위: Official Trailer > Trailer > Teaser > 기타
  const officialTrailer = youtubeVideos.find(
    (v) => v.type === "Trailer" && v.official
  );
  if (officialTrailer) return officialTrailer;

  const trailer = youtubeVideos.find((v) => v.type === "Trailer");
  if (trailer) return trailer;

  const teaser = youtubeVideos.find((v) => v.type === "Teaser");
  if (teaser) return teaser;

  // 아무 YouTube 영상이라도 반환
  return youtubeVideos[0] || null;
}

export async function searchMovies(
  query: string,
  language: ApiLanguage = "ko"
): Promise<Movie[]> {
  if (!query.trim()) return [];

  const cacheKey = `search-${query}-${language}`;
  const cached = getCached<Movie[]>(cacheKey);
  if (cached) return cached;

  const langCode = getApiLanguageCode(language);
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=${langCode}&query=${encodeURIComponent(
    query
  )}&page=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  const data: TMDbResponse = await response.json();
  setCache(cacheKey, data.results);
  return data.results;
}

// Release dates by country
export interface ReleaseDate {
  iso_3166_1: string; // Country code (e.g., "KR", "US")
  release_dates: {
    certification: string;
    release_date: string;
    type: number; // 1=Premiere, 2=Theatrical (limited), 3=Theatrical, 4=Digital, 5=Physical, 6=TV
  }[];
}

export interface ReleaseDatesResponse {
  id: number;
  results: ReleaseDate[];
}

export interface EarliestRelease {
  country: string;
  date: string;
}

export async function getMovieReleaseDates(
  movieId: number
): Promise<ReleaseDatesResponse> {
  const cacheKey = `release-dates-${movieId}`;
  const cached = getCached<ReleaseDatesResponse>(cacheKey);
  if (cached) return cached;

  const url = `${TMDB_BASE_URL}/movie/${movieId}/release_dates?api_key=${TMDB_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch release dates");
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

// Find the earliest theatrical release (type 2 or 3) from release dates
export function findEarliestRelease(
  releaseDates: ReleaseDatesResponse,
  targetDate: string
): EarliestRelease | null {
  let earliest: EarliestRelease | null = null;

  for (const country of releaseDates.results) {
    // Find theatrical releases (type 2 or 3)
    const theatricalReleases = country.release_dates.filter(
      (r) => r.type === 2 || r.type === 3
    );

    for (const release of theatricalReleases) {
      const releaseDate = release.release_date.split("T")[0];

      // Match with the target date (the movie's release_date from calendar)
      if (releaseDate === targetDate) {
        return { country: country.iso_3166_1, date: releaseDate };
      }

      // Track earliest if no exact match
      if (!earliest || releaseDate < earliest.date) {
        earliest = { country: country.iso_3166_1, date: releaseDate };
      }
    }
  }

  return earliest;
}

// Fetch all movie modal data in parallel
export async function getMovieModalData(
  movieId: number,
  language: ApiLanguage,
  region: string,
  releaseDate?: string
): Promise<{
  details: MovieDetails;
  videos: MovieVideo[];
  releaseCountry: string | null;
}> {
  const promises: [
    Promise<MovieDetails>,
    Promise<MovieVideo[]>,
    Promise<ReleaseDatesResponse | null>
  ] = [
    getMovieDetails(movieId, language),
    getMovieVideos(movieId, language),
    region === "ALL" && releaseDate
      ? getMovieReleaseDates(movieId).catch(() => null)
      : Promise.resolve(null),
  ];

  const [details, videos, releaseDatesData] = await Promise.all(promises);

  let releaseCountry: string | null = null;
  if (releaseDatesData && releaseDate) {
    const earliest = findEarliestRelease(releaseDatesData, releaseDate);
    if (earliest) {
      releaseCountry = earliest.country;
    }
  }

  return { details, videos, releaseCountry };
}
