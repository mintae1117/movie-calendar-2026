import { COUNTRY_NAMES, REGIONS } from "../constants";
import type { Language, Region } from "../types";

/**
 * Get country name by code based on language
 */
export function getCountryName(code: string, language: Language): string {
  const country = COUNTRY_NAMES[code];
  if (country) {
    return language === "ko" ? country.ko : country.en;
  }
  return code;
}

/**
 * Get region display name by code based on language
 */
export function getRegionDisplayName(code: Region, language: Language): string {
  const regionData = REGIONS.find((r) => r.code === code);
  if (!regionData) return code;
  return language === "ko" ? regionData.nameKo : regionData.nameEn;
}
