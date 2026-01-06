"use client";

import { useEffect } from "react";

/**
 * Custom hook for handling keyboard events
 * Single Responsibility: Only handles keyboard interactions
 */
export function useKeyboard(
  key: string,
  callback: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) {
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, enabled]);
}

/**
 * Hook specifically for Escape key handling
 */
export function useEscapeKey(
  callback: () => void,
  enabled: boolean = true
): void {
  useKeyboard("Escape", callback, enabled);
}
