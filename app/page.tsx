"use client";

import styled from "styled-components";
import MovieCalendar from "./components/MovieCalendar";
import { useSettingsStore, themeColors } from "./lib/store";

const PageContainer = styled.div<{ $bg: string }>`
  height: 100vh;
  background: ${(props) => props.$bg};
  padding: 0.75rem;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 90rem;
  width: 100%;
  margin: 0 auto;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

export default function Home() {
  const theme = useSettingsStore((state) => state.theme);

  return (
    <PageContainer $bg={themeColors[theme].pageBg}>
      <ContentWrapper>
        <MovieCalendar />
      </ContentWrapper>
    </PageContainer>
  );
}
