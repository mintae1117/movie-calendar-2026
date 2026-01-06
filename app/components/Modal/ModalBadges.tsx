"use client";

import { FaGlobe, FaFilm } from "react-icons/fa";
import type { Theme, Language, Region, MovieDetails } from "../../types";
import { formatDate, formatRuntime, getCountryName } from "../../utils";
import { BadgeContainer, Badge, BadgeLabel } from "./styles";

interface ModalBadgesProps {
  theme: Theme;
  language: Language;
  region: Region;
  releaseDate: string;
  releaseCountry: string | null;
  details: MovieDetails | null;
  getRegionName: (code: Region) => string;
  voteAverage: number;
}

export function ModalBadges({
  theme,
  language,
  region,
  releaseDate,
  releaseCountry,
  details,
  getRegionName,
  voteAverage,
}: ModalBadgesProps) {
  return (
    <BadgeContainer>
      {releaseDate && (
        <Badge $variant="date" $theme={theme}>
          {formatDate(releaseDate, language)}
        </Badge>
      )}

      {region === "ALL" && releaseCountry && (
        <Badge $variant="release" $theme={theme}>
          <FaGlobe size={12} />
          <BadgeLabel>{language === "ko" ? "개봉" : "Release"}:</BadgeLabel>
          {getCountryName(releaseCountry, language)}
        </Badge>
      )}

      {region !== "ALL" && (
        <Badge $variant="release" $theme={theme}>
          <FaGlobe size={12} />
          <BadgeLabel>{language === "ko" ? "개봉" : "Release"}:</BadgeLabel>
          {getRegionName(region)}
        </Badge>
      )}

      {details?.production_countries &&
        details.production_countries.length > 0 && (
          <Badge $variant="production" $theme={theme}>
            <FaFilm size={12} />
            <BadgeLabel>{language === "ko" ? "제작" : "Made in"}:</BadgeLabel>
            {details.production_countries
              .slice(0, 2)
              .map((c) => getCountryName(c.iso_3166_1, language))
              .join(", ")}
          </Badge>
        )}

      {details && details.runtime > 0 && (
        <Badge $variant="runtime" $theme={theme}>
          {formatRuntime(details.runtime, language)}
        </Badge>
      )}

      {voteAverage > 0 && (
        <Badge $variant="rating" $theme={theme}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {voteAverage.toFixed(1)}
        </Badge>
      )}
    </BadgeContainer>
  );
}
