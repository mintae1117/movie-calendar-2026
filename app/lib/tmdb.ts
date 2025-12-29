const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

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
export type ApiRegion = "ALL" | "KR" | "US" | "JP" | "GB" | "FR" | "DE";

const getApiLanguageCode = (lang: ApiLanguage): string => {
  return lang === "ko" ? "ko-KR" : "en-US";
};

export async function getUpcomingMovies(
  year: number,
  month: number,
  language: ApiLanguage = "ko",
  region: ApiRegion = "ALL"
): Promise<Movie[]> {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];
  const langCode = getApiLanguageCode(language);

  const allMovies: Movie[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 10) {
    let url: string;
    if (region === "ALL") {
      // 전체: 국가 필터 없이 primary_release_date 사용
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=${langCode}&sort_by=popularity.desc&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&page=${page}`;
    } else {
      // 특정 국가: region 파라미터와 release_date 사용
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=${langCode}&region=${region}&sort_by=popularity.desc&release_date.gte=${startDate}&release_date.lte=${endDate}&with_release_type=2|3&page=${page}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data: TMDbResponse = await response.json();
    allMovies.push(...data.results);
    totalPages = data.total_pages;
    page++;
  }

  return allMovies;
}

export async function getMovieDetails(
  movieId: number,
  language: ApiLanguage = "ko"
): Promise<MovieDetails> {
  const langCode = getApiLanguageCode(language);
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=${langCode}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return response.json();
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
