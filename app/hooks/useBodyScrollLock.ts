"use client";

import { useEffect } from "react";

/**
 * Custom hook for locking body scroll (useful for modals)
 * Single Responsibility: Only handles body scroll locking
 */
export function useBodyScrollLock(locked: boolean = true): void {
  useEffect(() => {
    if (!locked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [locked]);
}
