"use client";

import { useState, useEffect } from "react";
import { MOBILE_BREAKPOINT } from "../constants";

/**
 * Custom hook for detecting mobile viewport
 * Single Responsibility: Only handles mobile detection
 */
export function useMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}
