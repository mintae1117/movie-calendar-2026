"use client";

import type { Theme, MovieVideo } from "../../types";
import { getBackdropUrl, getPosterUrl } from "../../services";
import {
  BackdropContainer,
  BackdropImage,
  BackdropFallback,
  BackdropOverlay,
  PlayButton,
  VideoContainer,
  VideoIframe,
  VideoCloseButton,
  PosterContainer,
  PosterImage,
  CloseButton,
} from "./styles";

interface ModalBackdropProps {
  theme: Theme;
  backdropPath: string | null;
  posterPath: string | null;
  title: string;
  trailer: MovieVideo | null;
  isPlayingTrailer: boolean;
  onPlayTrailer: () => void;
  onStopTrailer: () => void;
  onClose: () => void;
}

export function ModalBackdrop({
  theme,
  backdropPath,
  posterPath,
  title,
  trailer,
  isPlayingTrailer,
  onPlayTrailer,
  onStopTrailer,
  onClose,
}: ModalBackdropProps) {
  return (
    <BackdropContainer>
      {isPlayingTrailer && trailer ? (
        <VideoContainer>
          <VideoIframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <VideoCloseButton onClick={onStopTrailer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          </VideoCloseButton>
        </VideoContainer>
      ) : (
        <>
          {backdropPath ? (
            <BackdropImage src={getBackdropUrl(backdropPath)} alt="" />
          ) : (
            <BackdropFallback $theme={theme} />
          )}
          <BackdropOverlay />

          {trailer && (
            <PlayButton onClick={onPlayTrailer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </PlayButton>
          )}
        </>
      )}

      <PosterContainer>
        <PosterImage
          $theme={theme}
          src={
            posterPath
              ? getPosterUrl(posterPath, "w342")
              : theme === "dark"
              ? "/noimg-dark.svg"
              : "/noimg-light.svg"
          }
          alt={title}
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
  );
}
