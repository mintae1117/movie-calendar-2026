import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

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
