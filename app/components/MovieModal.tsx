"use client";

import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Movie,
  MovieDetails,
  getMovieDetails,
  getPosterUrl,
  getBackdropUrl,
} from "../lib/tmdb";

// ============ Styled Components ============

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 1rem;
  max-width: 48rem;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
  left: 1.5rem;
  transform: translateY(50%);
  z-index: 20;
`;

const PosterImage = styled.img`
  width: 7rem;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 4px solid white;

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
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 16rem);
`;

const TitleArea = styled.div`
  margin-left: 8rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-left: 10rem;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const OriginalTitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const Tagline = styled.p`
  color: #4b5563;
  font-style: italic;
  margin-bottom: 0.75rem;
`;

const InfoArea = styled.div`
  margin-top: 4rem;

  @media (min-width: 768px) {
    margin-top: 5rem;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Badge = styled.span<{ $variant: "date" | "runtime" | "rating" }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  ${(props) => {
    switch (props.$variant) {
      case "date":
        return `
          background-color: #dbeafe;
          color: #1e40af;
          font-weight: 500;
        `;
      case "runtime":
        return `
          background-color: #f3f4f6;
          color: #374151;
        `;
      case "rating":
        return `
          background-color: #fef3c7;
          color: #92400e;
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

const GenreBadge = styled.span`
  padding: 0.25rem 0.5rem;
  background-color: #f3e8ff;
  color: #7c3aed;
  border-radius: 0.25rem;
  font-size: 0.75rem;
`;

const Section = styled.div`
  margin-top: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Overview = styled.p`
  color: #4b5563;
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

const CompanyLogo = styled.img`
  height: 1.5rem;
  object-fit: contain;
`;

const CompanyName = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
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
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getMovieDetails(movie.id);
        setDetails(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie.id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <BackdropContainer>
          {movie.backdrop_path ? (
            <BackdropImage src={getBackdropUrl(movie.backdrop_path)} alt="" />
          ) : (
            <BackdropFallback />
          )}
          <BackdropOverlay />

          <PosterContainer>
            <PosterImage
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
          <TitleArea>
            <Title>{movie.title}</Title>
            {movie.original_title !== movie.title && (
              <OriginalTitle>{movie.original_title}</OriginalTitle>
            )}
            {details?.tagline && (
              <Tagline>&ldquo;{details.tagline}&rdquo;</Tagline>
            )}
          </TitleArea>

          <InfoArea>
            <BadgeContainer>
              <Badge $variant="date">{formatDate(movie.release_date)}</Badge>
              {details?.runtime && details.runtime > 0 && (
                <Badge $variant="runtime">
                  {formatRuntime(details.runtime)}
                </Badge>
              )}
              {movie.vote_average > 0 && (
                <Badge $variant="rating">
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
                  <GenreBadge key={genre.id}>{genre.name}</GenreBadge>
                ))}
              </GenreContainer>
            )}

            {movie.overview && (
              <Section>
                <SectionTitle>줄거리</SectionTitle>
                <Overview>{movie.overview}</Overview>
              </Section>
            )}

            {details?.production_companies &&
              details.production_companies.length > 0 && (
                <Section>
                  <SectionTitle>제작사</SectionTitle>
                  <CompanyContainer>
                    {details.production_companies.slice(0, 5).map((company) => (
                      <CompanyItem key={company.id}>
                        {company.logo_path ? (
                          <CompanyLogo
                            src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                            alt={company.name}
                          />
                        ) : (
                          <CompanyName>{company.name}</CompanyName>
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
        </ContentArea>
      </ModalContainer>
    </Overlay>
  );
}
