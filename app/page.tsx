"use client";

import styled from "styled-components";
import MovieCalendar from "./components/MovieCalendar";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8fafc, #eff6ff);
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  height: calc(100vh - 4rem);
`;

export default function Home() {
  return (
    <PageContainer>
      <ContentWrapper>
        <MovieCalendar />
      </ContentWrapper>
    </PageContainer>
  );
}
