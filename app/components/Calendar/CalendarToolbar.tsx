"use client";

import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { format } from "date-fns";
import type { Theme, Movie, Language } from "../../types";
import { getPosterUrl } from "../../services";
import { formatMonthTitle, getReleaseYear } from "../../utils";
import { useClickOutside } from "../../hooks";
import {
  Toolbar,
  ToolbarLeft,
  ButtonGroup,
  NavButton,
  MonthTitle,
  ToolbarRight,
  SearchContainer,
  SearchInput,
  SearchIcon,
  SearchResults,
  SearchResultItem,
  SearchResultPoster,
  SearchResultNoPoster,
  SearchResultInfo,
  SearchResultTitle,
  SearchResultYear,
  SearchNoResults,
  SearchLoading,
  MonthInput,
} from "./styles";

interface CalendarToolbarProps {
  theme: Theme;
  language: Language;
  currentDate: Date;
  searchQuery: string;
  searchResults: Movie[];
  isSearching: boolean;
  showSearchResults: boolean;
  t: (key: string) => string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthChange: (date: Date) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchResultClick: (movie: Movie) => void;
  onSearchFocus: () => void;
  setShowSearchResults: (show: boolean) => void;
}

export function CalendarToolbar({
  theme,
  language,
  currentDate,
  searchQuery,
  searchResults,
  isSearching,
  showSearchResults,
  t,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onSearchChange,
  onSearchResultClick,
  onSearchFocus,
  setShowSearchResults,
}: CalendarToolbarProps) {
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchContainerRef, () => setShowSearchResults(false));

  return (
    <Toolbar $theme={theme}>
      <ToolbarLeft>
        <ButtonGroup>
          <NavButton $theme={theme} onClick={onPrevMonth}>
            <FaChevronLeft size={10} />
            {t("nav.prev")}
          </NavButton>
          <NavButton $theme={theme} onClick={onNextMonth}>
            {t("nav.next")}
            <FaChevronRight size={10} />
          </NavButton>
        </ButtonGroup>
        <MonthTitle $theme={theme}>
          {formatMonthTitle(currentDate, language)}
        </MonthTitle>
      </ToolbarLeft>

      <ToolbarRight>
        <SearchContainer ref={searchContainerRef}>
          <SearchIcon $theme={theme}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </SearchIcon>
          <SearchInput
            $theme={theme}
            type="text"
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={onSearchChange}
            onFocus={onSearchFocus}
          />
          {showSearchResults && (
            <SearchResults $theme={theme}>
              {isSearching ? (
                <SearchLoading $theme={theme}>
                  {t("search.loading")}
                </SearchLoading>
              ) : searchResults.length > 0 ? (
                searchResults.map((movie) => (
                  <SearchResultItem
                    key={movie.id}
                    $theme={theme}
                    onClick={() => onSearchResultClick(movie)}
                  >
                    {movie.poster_path ? (
                      <SearchResultPoster
                        src={getPosterUrl(movie.poster_path, "w185")}
                        alt=""
                      />
                    ) : (
                      <SearchResultNoPoster $theme={theme}>
                        No Image
                      </SearchResultNoPoster>
                    )}
                    <SearchResultInfo>
                      <SearchResultTitle $theme={theme}>
                        {movie.title}
                      </SearchResultTitle>
                      <SearchResultYear $theme={theme}>
                        {getReleaseYear(movie.release_date) ||
                          t("search.releaseUnknown")}
                      </SearchResultYear>
                    </SearchResultInfo>
                  </SearchResultItem>
                ))
              ) : (
                <SearchNoResults $theme={theme}>
                  {t("search.noResults")}
                </SearchNoResults>
              )}
            </SearchResults>
          )}
        </SearchContainer>

        <MonthInput
          $theme={theme}
          type="month"
          value={format(currentDate, "yyyy-MM")}
          onChange={(e) => {
            const [year, month] = e.target.value.split("-").map(Number);
            if (year && month) {
              onMonthChange(new Date(year, month - 1, 1));
            }
          }}
        />
      </ToolbarRight>
    </Toolbar>
  );
}
