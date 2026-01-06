"use client";

import type { Theme, Genre, ProductionCompany } from "../../types";
import {
  GenreContainer,
  GenreBadge,
  Section,
  SectionTitle,
  Overview,
  CompanyContainer,
  CompanyItem,
  CompanyLogo,
  CompanyName,
  LoadingContainer,
  Spinner,
} from "./styles";

interface ModalGenresProps {
  theme: Theme;
  genres: Genre[];
}

export function ModalGenres({ theme, genres }: ModalGenresProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <GenreContainer>
      {genres.map((genre) => (
        <GenreBadge key={genre.id} $theme={theme}>
          {genre.name}
        </GenreBadge>
      ))}
    </GenreContainer>
  );
}

interface ModalOverviewProps {
  theme: Theme;
  overview: string;
  title: string;
}

export function ModalOverview({ theme, overview, title }: ModalOverviewProps) {
  if (!overview) return null;

  return (
    <Section>
      <SectionTitle $theme={theme}>{title}</SectionTitle>
      <Overview $theme={theme}>{overview}</Overview>
    </Section>
  );
}

interface ModalProductionProps {
  theme: Theme;
  companies: ProductionCompany[];
  title: string;
}

export function ModalProduction({
  theme,
  companies,
  title,
}: ModalProductionProps) {
  if (!companies || companies.length === 0) return null;

  return (
    <Section>
      <SectionTitle $theme={theme}>{title}</SectionTitle>
      <CompanyContainer>
        {companies.slice(0, 5).map((company) => (
          <CompanyItem key={company.id}>
            {company.logo_path ? (
              <CompanyLogo
                $theme={theme}
                src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                alt={company.name}
              />
            ) : (
              <CompanyName $theme={theme}>{company.name}</CompanyName>
            )}
          </CompanyItem>
        ))}
      </CompanyContainer>
    </Section>
  );
}

interface ModalLoadingProps {
  loading: boolean;
}

export function ModalLoading({ loading }: ModalLoadingProps) {
  if (!loading) return null;

  return (
    <LoadingContainer>
      <Spinner />
    </LoadingContainer>
  );
}
