"use client";

import { FaSun, FaMoon } from "react-icons/fa";
import type { Theme, Region, Language } from "../../types";
import { REGIONS } from "../../constants";
import {
  Header,
  Title,
  HeaderRight,
  LoadingText,
  Legend,
  LegendItem,
  LegendDot,
  LegendLabel,
  Select,
  ToggleContainer,
  ToggleButton,
} from "./styles";

interface CalendarHeaderProps {
  theme: Theme;
  language: Language;
  region: Region;
  loading: boolean;
  t: (key: string) => string;
  getRegionName: (code: Region) => string;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setRegion: (region: Region) => void;
}

export function CalendarHeader({
  theme,
  language,
  region,
  loading,
  t,
  getRegionName,
  setTheme,
  setLanguage,
  setRegion,
}: CalendarHeaderProps) {
  return (
    <Header $theme={theme}>
      <Title $theme={theme}>{t("header.title")}</Title>
      <HeaderRight>
        {loading && (
          <LoadingText $theme={theme}>{t("header.loading")}</LoadingText>
        )}
        <Legend>
          <LegendItem>
            <LegendDot $color="#6b7280" />
            <LegendLabel $theme={theme}>{t("header.general")}</LegendLabel>
          </LegendItem>
          <LegendItem className="mr-1.5">
            <LegendDot $color="#10b981" />
            <LegendLabel $theme={theme}>{t("header.recommended")}</LegendLabel>
          </LegendItem>
        </Legend>
        <Select
          $theme={theme}
          value={region}
          onChange={(e) => setRegion(e.target.value as Region)}
        >
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code}>
              {getRegionName(r.code)} {language === "ko" ? "개봉" : "Release"}
            </option>
          ))}
        </Select>
        <ToggleContainer $theme={theme}>
          <ToggleButton
            $isActive={language === "ko"}
            $theme={theme}
            onClick={() => setLanguage("ko")}
          >
            한국어
          </ToggleButton>
          <ToggleButton
            $isActive={language === "en"}
            $theme={theme}
            onClick={() => setLanguage("en")}
          >
            EN
          </ToggleButton>
        </ToggleContainer>
        <ToggleContainer $theme={theme}>
          <ToggleButton
            $isActive={theme === "light"}
            $theme={theme}
            onClick={() => setTheme("light")}
            title="Light"
          >
            <FaSun size={12} />
          </ToggleButton>
          <ToggleButton
            $isActive={theme === "dark"}
            $theme={theme}
            onClick={() => setTheme("dark")}
            title="Dark"
          >
            <FaMoon size={12} />
          </ToggleButton>
        </ToggleContainer>
      </HeaderRight>
    </Header>
  );
}
