import styled, { keyframes } from "styled-components";
import type { Theme } from "../../types";
import { themeColors } from "../../constants";

export const Overlay = styled.div<{ $theme: Theme }>`
  position: fixed;
  inset: 0;
  background-color: ${(props) => themeColors[props.$theme].modalOverlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

export const ModalContainer = styled.div<{ $theme: Theme }>`
  background-color: ${(props) => themeColors[props.$theme].modalBg};
  border-radius: 1rem;
  max-width: 48rem;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${(props) => themeColors[props.$theme].calendarBorder};
`;

export const BackdropContainer = styled.div`
  position: relative;
  height: 12rem;

  @media (min-width: 768px) {
    height: 16rem;
  }
`;

export const BackdropImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BackdropFallback = styled.div<{ $theme: Theme }>`
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.$theme === "dark"
      ? "linear-gradient(to bottom right, #1e3a5f, #312e81)"
      : "linear-gradient(to bottom right, #93c5fd, #c4b5fd)"};
`;

export const BackdropOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
`;

export const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4rem;
  height: 4rem;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;
  z-index: 15;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: translate(-50%, -50%) scale(1.1);
    border-color: white;
  }

  @media (min-width: 768px) {
    width: 5rem;
    height: 5rem;
  }
`;

export const VideoContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  background-color: black;
`;

export const VideoIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export const VideoCloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 25;

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }
`;

export const PosterContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 1rem;
  transform: translateY(50%);
  z-index: 20;

  @media (min-width: 768px) {
    left: 1.5rem;
  }
`;

export const PosterImage = styled.img<{ $theme: Theme }>`
  width: 7rem;
  border-width: 4px;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 3px solid ${(props) => themeColors[props.$theme].modalBg};

  @media (min-width: 768px) {
    width: 9rem;
  }
`;

export const CloseButton = styled.button`
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

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  max-height: calc(80vh - 12rem);

  @media (min-width: 768px) {
    max-height: calc(80vh - 16rem);
  }
`;

export const TitleArea = styled.div<{ $theme: Theme }>`
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

export const Title = styled.h2<{ $theme: Theme }>`
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

export const OriginalTitle = styled.p<{ $theme: Theme }>`
  color: ${(props) => themeColors[props.$theme].textMuted};
  font-size: 0.75rem;
  margin-bottom: 0.375rem;

  @media (min-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
`;

export const Tagline = styled.p<{ $theme: Theme }>`
  color: ${(props) => themeColors[props.$theme].textSecondary};
  font-style: italic;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;

  @media (min-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }
`;

export const ScrollableArea = styled.div<{ $theme: Theme }>`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  background: ${(props) =>
    props.$theme === "dark"
      ? "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 100px)"
      : "linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, transparent 100px)"};

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

export const InfoArea = styled.div`
  margin-top: 1.3rem;
  padding: 0 1rem 1.5rem 1rem;

  @media (min-width: 768px) {
    margin-top: 1rem;
  }
`;

export const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export type BadgeVariant =
  | "date"
  | "runtime"
  | "rating"
  | "release"
  | "production";

export const Badge = styled.span<{
  $variant: BadgeVariant;
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
      case "release":
        return `
          background-color: ${isDark ? "#064e3b" : "#d1fae5"};
          color: ${isDark ? "#6ee7b7" : "#065f46"};
          font-weight: 500;
        `;
      case "production":
        return `
          background-color: ${isDark ? "#581c87" : "#f3e8ff"};
          color: ${isDark ? "#d8b4fe" : "#7c3aed"};
          font-weight: 500;
        `;
    }
  }}
`;

export const BadgeLabel = styled.span`
  opacity: 0.8;
  font-size: 0.75rem;
`;

export const GenreContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const GenreBadge = styled.span<{ $theme: Theme }>`
  padding: 0.25rem 0.5rem;
  background-color: ${(props) =>
    props.$theme === "dark" ? "#3b0764" : "#f3e8ff"};
  color: ${(props) => (props.$theme === "dark" ? "#c4b5fd" : "#7c3aed")};
  border-radius: 0.25rem;
  font-size: 0.75rem;
`;

export const Section = styled.div`
  margin-top: 1rem;
`;

export const SectionTitle = styled.h3<{ $theme: Theme }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => themeColors[props.$theme].textPrimary};
  margin-bottom: 0.5rem;
`;

export const Overview = styled.p<{ $theme: Theme }>`
  color: ${(props) => themeColors[props.$theme].textSecondary};
  line-height: 1.625;
`;

export const CompanyContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const CompanyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CompanyLogo = styled.img<{ $theme: Theme }>`
  height: 1.5rem;
  object-fit: contain;
  ${(props) =>
    props.$theme === "dark" &&
    `
    filter: brightness(0) invert(1);
  `}
`;

export const CompanyName = styled.span<{ $theme: Theme }>`
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

export const LoadingContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
`;

export const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid transparent;
  border-bottom-color: #3b82f6;
  animation: ${spin} 1s linear infinite;
`;
