import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Edge Runtime for lower latency
export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    let url: string;

    switch (action) {
      // 모든 페이지를 서버에서 병렬로 가져와서 한 번에 반환
      case "upcoming-all": {
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const language = searchParams.get("language") || "ko-KR";
        const region = searchParams.get("region") || "ALL";

        const buildUrl = (page: number) => {
          if (region === "ALL") {
            return `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=${language}&sort_by=popularity.desc&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&page=${page}`;
          }
          return `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=${language}&region=${region}&sort_by=popularity.desc&release_date.gte=${startDate}&release_date.lte=${endDate}&with_release_type=2|3&page=${page}`;
        };

        // 첫 페이지로 총 페이지 수 확인
        const firstResponse = await fetch(buildUrl(1));
        if (!firstResponse.ok) {
          return NextResponse.json({ error: "Failed to fetch" }, { status: firstResponse.status });
        }
        const firstData = await firstResponse.json();
        const totalPages = Math.min(firstData.total_pages, 10);

        if (totalPages <= 1) {
          return NextResponse.json({ results: firstData.results });
        }

        // 나머지 페이지 병렬 요청 (서버에서 처리)
        const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const remainingResponses = await Promise.all(
          remainingPages.map((page) =>
            fetch(buildUrl(page)).then((res) => res.json())
          )
        );

        const allResults = [
          ...firstData.results,
          ...remainingResponses.flatMap((data) => data.results || []),
        ];

        return NextResponse.json({ results: allResults });
      }

      case "upcoming": {
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const language = searchParams.get("language") || "ko-KR";
        const region = searchParams.get("region") || "ALL";
        const page = searchParams.get("page") || "1";

        if (region === "ALL") {
          url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=${language}&sort_by=popularity.desc&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&page=${page}`;
        } else {
          url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=${language}&region=${region}&sort_by=popularity.desc&release_date.gte=${startDate}&release_date.lte=${endDate}&with_release_type=2|3&page=${page}`;
        }
        break;
      }

      case "details": {
        const movieId = searchParams.get("movieId");
        const language = searchParams.get("language") || "ko-KR";
        url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=${language}`;
        break;
      }

      case "videos": {
        const movieId = searchParams.get("movieId");
        const language = searchParams.get("language") || "ko-KR";
        url = `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=${language}`;
        break;
      }

      case "release-dates": {
        const movieId = searchParams.get("movieId");
        url = `${TMDB_BASE_URL}/movie/${movieId}/release_dates?api_key=${TMDB_API_KEY}`;
        break;
      }

      case "search": {
        const query = searchParams.get("query");
        const language = searchParams.get("language") || "ko-KR";
        url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=${language}&query=${encodeURIComponent(query || "")}&page=1`;
        break;
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from TMDB" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
