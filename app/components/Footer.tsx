"use client";

import styled from "styled-components";
import { FaSun, FaMoon } from "react-icons/fa";
import { useSettingsStore, themeColors, Theme } from "../lib/store";

const FooterContainer = styled.footer<{ $theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.375rem;
  flex-shrink: 0;
`;

const ToggleContainer = styled.div<{ $theme: Theme }>`
  display: inline-flex;
  background-color: ${(props) =>
    props.$theme === "dark" ? "#374151" : "#f3f4f6"};
  border-radius: 0.375rem;
  padding: 2px;
  gap: 2px;
`;

const ToggleButton = styled.button<{ $isActive: boolean; $theme: Theme }>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  background-color: ${(props) =>
    props.$isActive
      ? props.$theme === "dark"
        ? "#1e1e2e"
        : "white"
      : "transparent"};
  color: ${(props) =>
    props.$isActive
      ? themeColors[props.$theme].textPrimary
      : themeColors[props.$theme].textMuted};
  box-shadow: ${(props) =>
    props.$isActive ? "0 1px 2px 0 rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    color: ${(props) => themeColors[props.$theme].textPrimary};
  }

  &:focus {
    outline: none;
  }
`;

export default function Footer() {
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  return (
    <FooterContainer $theme={theme}>
      <ToggleContainer $theme={theme}>
        <ToggleButton
          $isActive={theme === "dark"}
          $theme={theme}
          onClick={() => setTheme("dark")}
          title="Dark"
        >
          <FaMoon size={12} />
        </ToggleButton>
        <ToggleButton
          $isActive={theme === "light"}
          $theme={theme}
          onClick={() => setTheme("light")}
          title="Light"
        >
          <FaSun size={12} />
        </ToggleButton>
      </ToggleContainer>
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
    </FooterContainer>
  );
}
