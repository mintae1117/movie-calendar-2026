// API calls are now proxied through /api/tmdb to hide API key

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
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];
  const langCode = getApiLanguageCode(language);

  const buildUrl = (page: number) => {
    const params = new URLSearchParams({
      action: "upcoming",
      startDate,
      endDate,
      language: langCode,
      region,
      page: page.toString(),
    });
    return `/api/tmdb?${params.toString()}`;
  };

  // 첫 페이지를 먼저 요청하여 총 페이지 수 확인
  const firstResponse = await fetch(buildUrl(1));
  if (!firstResponse.ok) {
    throw new Error("Failed to fetch movies");
  }
  const firstData: TMDbResponse = await firstResponse.json();
  const totalPages = Math.min(firstData.total_pages, 10);

  // 나머지 페이지들을 병렬로 요청
  if (totalPages <= 1) {
    return firstData.results;
  }

  const remainingPages = Array.from(
    { length: totalPages - 1 },
    (_, i) => i + 2
  );
  const remainingResponses = await Promise.all(
    remainingPages.map((page) =>
      fetch(buildUrl(page)).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch movies");
        return res.json() as Promise<TMDbResponse>;
      })
    )
  );

  const allMovies = [
    ...firstData.results,
    ...remainingResponses.flatMap((data) => data.results),
  ];

  return allMovies;
}

export async function getMovieDetails(
  movieId: number,
  language: ApiLanguage = "ko"
): Promise<MovieDetails> {
  const langCode = getApiLanguageCode(language);
  const params = new URLSearchParams({
    action: "details",
    movieId: movieId.toString(),
    language: langCode,
  });

  const response = await fetch(`/api/tmdb?${params.toString()}`);
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

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export async function getMovieVideos(
  movieId: number,
  language: ApiLanguage = "ko"
): Promise<MovieVideo[]> {
  const langCode = getApiLanguageCode(language);
  const params = new URLSearchParams({
    action: "videos",
    movieId: movieId.toString(),
    language: langCode,
  });

  const response = await fetch(`/api/tmdb?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie videos");
  }

  const data = await response.json();
  let videos: MovieVideo[] = data.results || [];

  // 한국어로 영상이 없으면 영어로 다시 시도
  if (videos.length === 0 && language === "ko") {
    const enParams = new URLSearchParams({
      action: "videos",
      movieId: movieId.toString(),
      language: "en-US",
    });
    const enResponse = await fetch(`/api/tmdb?${enParams.toString()}`);
    if (enResponse.ok) {
      const enData = await enResponse.json();
      videos = enData.results || [];
    }
  }

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

  const langCode = getApiLanguageCode(language);
  const params = new URLSearchParams({
    action: "search",
    query,
    language: langCode,
  });

  const response = await fetch(`/api/tmdb?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  const data: TMDbResponse = await response.json();
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
  const params = new URLSearchParams({
    action: "release-dates",
    movieId: movieId.toString(),
  });

  const response = await fetch(`/api/tmdb?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch release dates");
  }

  return response.json();
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
