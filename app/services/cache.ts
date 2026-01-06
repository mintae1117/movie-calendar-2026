import { CACHE_TTL } from "../constants";

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

/**
 * Generic cache service for managing in-memory cache with TTL
 * Single Responsibility: Only handles caching logic
 */
class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private ttl: number;

  constructor(ttl: number = CACHE_TTL) {
    this.ttl = ttl;
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, expiry: Date.now() + this.ttl });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  /**
   * Get or fetch data with caching
   * Useful for avoiding race conditions and duplicate requests
   */
  async getOrFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data);
    return data;
  }
}

// Export singleton instance for movie data caching
export const movieCache = new CacheService();

// Export class for creating custom cache instances if needed
export { CacheService };
