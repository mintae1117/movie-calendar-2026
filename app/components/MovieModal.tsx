"use client";

import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Movie,
  MovieDetails,
  getMovieDetails,
  getPosterUrl,
  getBackdropUrl,
  ApiLanguage,
} from "../lib/tmdb";
import { useSettingsStore, themeColors, Theme } from "../lib/store";

// ============ Styled Components ============

const Overlay = styled.div<{ $theme: Theme }>`
  position: fixed;
  inset: 0;
  background-color: ${(props) => themeColors[props.$theme].modalOverlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContainer = styled.div<{ $theme: Theme }>`
  background-color: ${(props) => themeColors[props.$theme].modalBg};
  border-radius: 1rem;
  max-width: 48rem;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${(props) => themeColors[props.$theme].calendarBorder};
`;

const BackdropContainer = styled.div`
  position: relative;
  height: 12rem;

  @media (min-width: 768px) {
    height: 16rem;
  }
`;

const BackdropImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BackdropFallback = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #3b82f6, #9333ea);
`;

const BackdropOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
`;

const PosterContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 1rem;
  transform: translateY(50%);
  z-index: 20;

  @media (min-width: 768px) {
    left: 1.5rem;
  }
`;

const PosterImage = styled.img<{ $theme: Theme }>`
  width: 7rem;
  border-width: 4px;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 3px solid ${(props) => themeColors[props.$theme].modalBg};

  @media (min-width: 768px) {
    width: 9rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 20;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  max-height: calc(80vh - 12rem);

  @media (min-width: 768px) {
    max-height: calc(80vh - 16rem);
  }
`;

const TitleArea = styled.div<{ $theme: Theme }>`
  margin-left: 9rem;
  padding: 1.5rem 1.5rem 0.7rem 0;
  flex-shrink: 0;
  position: relative;
  min-height: 100px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: -9rem;
    right: -1.5rem;
    height: 1px;
    background: ${(props) =>
      props.$theme === "dark"
        ? "linear-gradient(to right, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent)"
        : "linear-gradient(to right, transparent, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.08) 80%, transparent)"};
  }

  @media (min-width: 768px) {
    margin-left: 11rem;
    padding: 1.5rem 1.5rem 2rem 0.7rem;
    min-height: 120px;

    &::after {
      left: -11rem;
    }
  }
`;

const Title = styled.h2<{ $theme: Theme }>`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => themeColors[props.$theme].textPrimary};
  margin-bottom: 0.25rem;
  line-height: 1.3;

  @media (min-width: 480px) {
    font-size: 1.375rem;
  }

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const OriginalTitle = styled.p<{ $theme: Theme }>`
  color: ${(props) => themeColors[props.$theme].textMuted};
  font-size: 0.75rem;
  margin-bottom: 0.375rem;

  @media (min-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
`;

const Tagline = styled.p<{ $theme: Theme }>`
  color: ${(props) => themeColors[props.$theme].textSecondary};
  font-style: italic;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;

  @media (min-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }
`;

const ScrollableArea = styled.div<{ $theme: Theme }>`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  background: ${(props) =>
    props.$theme === "dark"
      ? "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 100px)"
      : "linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, transparent 100px)"};

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${(props) =>
    props.$theme === "dark" ? "#4b5563 transparent" : "#d1d5db transparent"};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) =>
      props.$theme === "dark" ? "#4b5563" : "#d1d5db"};
    border-radius: 3px;
  }
`;

const InfoArea = styled.div`
  margin-top: 1.3rem;
  padding: 0 1rem 1.5rem 1rem;

  @media (min-width: 768px) {
    margin-top: 1rem;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Badge = styled.span<{
  $variant: "date" | "runtime" | "rating";
  $theme: Theme;
}>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  ${(props) => {
    const isDark = props.$theme === "dark";
    switch (props.$variant) {
      case "date":
        return `
          background-color: ${isDark ? "#1e3a5f" : "#dbeafe"};
          color: ${isDark ? "#93c5fd" : "#1e40af"};
          font-weight: 500;
        `;
      case "runtime":
        return `
          background-color: ${isDark ? "#374151" : "#f3f4f6"};
          color: ${isDark ? "#d1d5db" : "#374151"};
        `;
      case "rating":
        return `
          background-color: ${isDark ? "#422006" : "#fef3c7"};
          color: ${isDark ? "#fcd34d" : "#92400e"};
        `;
    }
  }}
`;

const GenreContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const GenreBadge = styled.span<{ $theme: Theme }>`
  padding: 0.25rem 0.5rem;
  background-color: ${(props) =>
    props.$theme === "dark" ? "#3b0764" : "#f3e8ff"};
  color: ${(props) => (props.$theme === "dark" ? "#c4b5fd" : "#7c3aed")};
  border-radius: 0.25rem;
  font-size: 0.75rem;
`;

const Section = styled.div`
  margin-top: 1rem;
`;

const SectionTitle = styled.h3<{ $theme: Theme }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => themeColors[props.$theme].textPrimary};
  margin-bottom: 0.5rem;
`;

const Overview = styled.p<{ $theme: Theme }>`
  color: ${(props) => themeColors[props.$theme].textSecondary};
  line-height: 1.625;
`;

const CompanyContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CompanyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CompanyLogo = styled.img<{ $theme: Theme }>`
  height: 1.5rem;
  object-fit: contain;
  ${(props) =>
    props.$theme === "dark" &&
    `
    filter: brightness(0) invert(1);
  `}
`;

const CompanyName = styled.span<{ $theme: Theme }>`
  font-size: 0.875rem;
  color: ${(props) => themeColors[props.$theme].textMuted};
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid transparent;
  border-bottom-color: #3b82f6;
  animation: ${spin} 1s linear infinite;
`;

// ============ Component ============

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const t = useSettingsStore((state) => state.t);
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getMovieDetails(movie.id, language as ApiLanguage);
        setDetails(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie.id, language]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (language === "ko") {
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (language === "ko") {
      return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
    }
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <Overlay $theme={theme} onClick={onClose}>
      <ModalContainer $theme={theme} onClick={(e) => e.stopPropagation()}>
        <BackdropContainer>
          {movie.backdrop_path ? (
            <BackdropImage src={getBackdropUrl(movie.backdrop_path)} alt="" />
          ) : (
            <BackdropFallback />
          )}
          <BackdropOverlay />

          <PosterContainer>
            <PosterImage
              $theme={theme}
              src={getPosterUrl(movie.poster_path, "w342")}
              alt={movie.title}
            />
          </PosterContainer>

          <CloseButton onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </CloseButton>
        </BackdropContainer>

        <ContentArea>
          <TitleArea $theme={theme}>
            <Title $theme={theme}>{movie.title}</Title>
            {movie.original_title !== movie.title && (
              <OriginalTitle $theme={theme}>
                {movie.original_title}
              </OriginalTitle>
            )}
            {details?.tagline && (
              <Tagline $theme={theme}>&ldquo;{details.tagline}&rdquo;</Tagline>
            )}
          </TitleArea>

          <ScrollableArea $theme={theme}>
            <InfoArea>
              <BadgeContainer>
                <Badge $variant="date" $theme={theme}>
                  {formatDate(movie.release_date)}
                </Badge>
                {details?.runtime && details.runtime > 0 && (
                  <Badge $variant="runtime" $theme={theme}>
                    {formatRuntime(details.runtime)}
                  </Badge>
                )}
                {movie.vote_average > 0 && (
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
                    {movie.vote_average.toFixed(1)}
                  </Badge>
                )}
              </BadgeContainer>

              {details?.genres && details.genres.length > 0 && (
                <GenreContainer>
                  {details.genres.map((genre) => (
                    <GenreBadge key={genre.id} $theme={theme}>
                      {genre.name}
                    </GenreBadge>
                  ))}
                </GenreContainer>
              )}

              {movie.overview && (
                <Section>
                  <SectionTitle $theme={theme}>
                    {t("modal.overview")}
                  </SectionTitle>
                  <Overview $theme={theme}>{movie.overview}</Overview>
                </Section>
              )}

              {details?.production_companies &&
                details.production_companies.length > 0 && (
                  <Section>
                    <SectionTitle $theme={theme}>
                      {t("modal.production")}
                    </SectionTitle>
                    <CompanyContainer>
                      {details.production_companies
                        .slice(0, 5)
                        .map((company) => (
                          <CompanyItem key={company.id}>
                            {company.logo_path ? (
                              <CompanyLogo
                                $theme={theme}
                                src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                                alt={company.name}
                              />
                            ) : (
                              <CompanyName $theme={theme}>
                                {company.name}
                              </CompanyName>
                            )}
                          </CompanyItem>
                        ))}
                    </CompanyContainer>
                  </Section>
                )}

              {loading && (
                <LoadingContainer>
                  <Spinner />
                </LoadingContainer>
              )}
            </InfoArea>
          </ScrollableArea>
        </ContentArea>
      </ModalContainer>
    </Overlay>
  );
}
