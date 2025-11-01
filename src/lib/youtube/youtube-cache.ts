// Local storage caching system for YouTube API data with TTL (Time To Live)

import {
  type ChannelStats,
  type VideoData,
  type CachedData,
  type YouTubeCacheData,
} from './youtube-types';

// Cache configuration
const CACHE_CONFIG = {
  STORAGE_KEY: 'forevergreen_youtube_cache',
  TTL: {
    CHANNEL_STATS: 60 * 60 * 1000, // 1 hour
    LATEST_VIDEOS: 30 * 60 * 1000, // 30 minutes
  },
} as const;

// Cache keys for different data types
const CACHE_KEYS = {
  CHANNEL_STATS: 'channelStats',
  LATEST_VIDEOS: 'latestVideos',
} as const;

// Utility: Check if cached data is still valid
function isDataValid<T>(cachedData: CachedData<T> | undefined): boolean {
  if (!cachedData) return false;
  const now = Date.now();
  return now - cachedData.timestamp < cachedData.ttl;
}

// Utility: Create cached data wrapper
function createCachedData<T>(data: T, ttl: number): CachedData<T> {
  return {
    data,
    timestamp: Date.now(),
    ttl,
  };
}

// Utility: Safe JSON parsing with fallback
function safeJsonParse<T>(jsonString: string | null): T | null {
  if (!jsonString) return null;

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('Failed to parse cached YouTube data:', error);
    return null;
  }
}

// Get all cached YouTube data from localStorage
function getAllCachedData(): YouTubeCacheData {
  const cached = localStorage.getItem(CACHE_CONFIG.STORAGE_KEY);
  return safeJsonParse<YouTubeCacheData>(cached) || {};
}

// Save all cached YouTube data to localStorage
function saveAllCachedData(data: YouTubeCacheData): void {
  try {
    localStorage.setItem(CACHE_CONFIG.STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save YouTube data to cache:', error);
  }
}

// Generic cache getter
function getCachedData<T>(key: keyof YouTubeCacheData): T | null {
  const allData = getAllCachedData();
  const cachedItem = allData[key] as CachedData<T> | undefined;

  if (isDataValid(cachedItem)) {
    return cachedItem.data;
  }

  return null;
}

// Generic cache setter
function setCachedData<T>(key: keyof YouTubeCacheData, data: T, ttl: number): void {
  const allData = getAllCachedData();
  allData[key] = createCachedData(data, ttl) as any;
  saveAllCachedData(allData);
}

// === Channel Stats Cache ===

export function getCachedChannelStats(): ChannelStats | null {
  return getCachedData<ChannelStats>(CACHE_KEYS.CHANNEL_STATS);
}

export function setCachedChannelStats(stats: ChannelStats): void {
  setCachedData(CACHE_KEYS.CHANNEL_STATS, stats, CACHE_CONFIG.TTL.CHANNEL_STATS);
}

export function isChannelStatsCacheValid(): boolean {
  const allData = getAllCachedData();
  return isDataValid(allData.channelStats);
}

// === Latest Videos Cache ===

export function getCachedLatestVideos(): VideoData[] | null {
  return getCachedData<VideoData[]>(CACHE_KEYS.LATEST_VIDEOS);
}

export function setCachedLatestVideos(videos: VideoData[]): void {
  setCachedData(CACHE_KEYS.LATEST_VIDEOS, videos, CACHE_CONFIG.TTL.LATEST_VIDEOS);
}

export function isLatestVideosCacheValid(): boolean {
  const allData = getAllCachedData();
  return isDataValid(allData.latestVideos);
}

// === Cache Management ===

// Check if any cached data exists
export function hasCachedData(): boolean {
  const data = getAllCachedData();
  return Boolean(data.channelStats || data.latestVideos);
}

// Get cache status for debugging
export function getCacheStatus() {
  const data = getAllCachedData();
  const now = Date.now();

  return {
    channelStats: {
      exists: Boolean(data.channelStats),
      valid: isDataValid(data.channelStats),
      age: data.channelStats ? now - data.channelStats.timestamp : null,
      ttl: data.channelStats?.ttl || null,
    },
    latestVideos: {
      exists: Boolean(data.latestVideos),
      valid: isDataValid(data.latestVideos),
      age: data.latestVideos ? now - data.latestVideos.timestamp : null,
      ttl: data.latestVideos?.ttl || null,
    },
  };
}

// Clear specific cache entry
export function clearCacheEntry(key: keyof YouTubeCacheData): void {
  const data = getAllCachedData();
  delete data[key];
  saveAllCachedData(data);
}

// Clear all cached YouTube data
export function clearAllCache(): void {
  try {
    localStorage.removeItem(CACHE_CONFIG.STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear YouTube cache:', error);
  }
}

// Force refresh by clearing cache
export function forceRefresh(): void {
  clearAllCache();
}

// Get time until cache expires (in milliseconds)
export function getTimeUntilExpiry(key: keyof YouTubeCacheData): number | null {
  const data = getAllCachedData();
  const cachedItem = data[key] as CachedData<unknown> | undefined;

  if (!cachedItem) return null;

  const expiryTime = cachedItem.timestamp + cachedItem.ttl;
  const now = Date.now();

  return Math.max(0, expiryTime - now);
}

// Check if cache is approaching expiry (within 5 minutes)
export function isCacheApproachingExpiry(key: keyof YouTubeCacheData): boolean {
  const timeUntilExpiry = getTimeUntilExpiry(key);
  if (timeUntilExpiry === null) return false;

  const fiveMinutes = 5 * 60 * 1000;
  return timeUntilExpiry < fiveMinutes;
}

// Development helper: Log cache status
export function logCacheStatus(): void {
  if (import.meta.env.DEV) {
    //('YouTube Cache Status:', getCacheStatus());
  }
}