"use client";

import type { Movie } from "../../types";
import { useSettingsStore } from "../../lib/store";
import { useMovieModal, useEscapeKey, useBodyScrollLock } from "../../hooks";

import { ModalBackdrop } from "./ModalBackdrop";
import { ModalTitle } from "./ModalTitle";
import { ModalBadges } from "./ModalBadges";
import {
  ModalGenres,
  ModalOverview,
  ModalProduction,
  ModalLoading,
} from "./ModalContent";
import {
  Overlay,
  ModalContainer,
  ContentArea,
  ScrollableArea,
  InfoArea,
} from "./styles";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

/**
 * MovieModal Component
 * Displays detailed movie information in a modal
 *
 * SOLID Principles applied:
 * - SRP: Split into sub-components (Backdrop, Title, Badges, Content)
 * - OCP: Each section can be extended independently
 * - DIP: Uses hooks for data fetching and behavior
 */
export default function MovieModal({ movie, onClose }: MovieModalProps) {
  // Store selectors
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const region = useSettingsStore((state) => state.region);
  const t = useSettingsStore((state) => state.t);
  const getRegionName = useSettingsStore((state) => state.getRegionName);

  // Custom hooks
  const {
    details,
    trailer,
    releaseCountry,
    loading,
    isPlayingTrailer,
    setIsPlayingTrailer,
  } = useMovieModal(movie);

  // Keyboard and scroll handling
  useEscapeKey(onClose);
  useBodyScrollLock(true);

  return (
    <Overlay $theme={theme} onClick={onClose}>
      <ModalContainer $theme={theme} onClick={(e) => e.stopPropagation()}>
        <ModalBackdrop
          theme={theme}
          backdropPath={movie.backdrop_path}
          posterPath={movie.poster_path}
          title={movie.title}
          trailer={trailer}
          isPlayingTrailer={isPlayingTrailer}
          onPlayTrailer={() => setIsPlayingTrailer(true)}
          onStopTrailer={() => setIsPlayingTrailer(false)}
          onClose={onClose}
        />

        <ContentArea>
          <ModalTitle
            theme={theme}
            title={movie.title}
            originalTitle={movie.original_title}
            tagline={details?.tagline}
          />

          <ScrollableArea $theme={theme}>
            <InfoArea>
              <ModalBadges
                theme={theme}
                language={language}
                region={region}
                releaseDate={movie.release_date}
                releaseCountry={releaseCountry}
                details={details}
                getRegionName={getRegionName}
                voteAverage={movie.vote_average}
              />

              <ModalGenres theme={theme} genres={details?.genres || []} />

              <ModalOverview
                theme={theme}
                overview={movie.overview}
                title={t("modal.overview")}
              />

              <ModalProduction
                theme={theme}
                companies={details?.production_companies || []}
                title={t("modal.production")}
              />

              <ModalLoading loading={loading} />
            </InfoArea>
          </ScrollableArea>
        </ContentArea>
      </ModalContainer>
    </Overlay>
  );
}
