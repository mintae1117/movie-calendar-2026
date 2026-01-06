"use client";

import type { Theme } from "../../types";
import { TitleArea, Title, OriginalTitle, Tagline } from "./styles";

interface ModalTitleProps {
  theme: Theme;
  title: string;
  originalTitle: string;
  tagline?: string;
}

export function ModalTitle({
  theme,
  title,
  originalTitle,
  tagline,
}: ModalTitleProps) {
  return (
    <TitleArea $theme={theme}>
      <Title $theme={theme}>{title}</Title>
      {originalTitle !== title && (
        <OriginalTitle $theme={theme}>{originalTitle}</OriginalTitle>
      )}
      {tagline && <Tagline $theme={theme}>&ldquo;{tagline}&rdquo;</Tagline>}
    </TitleArea>
  );
}
