// YouTube Data API v3 service for fetching channel statistics and video data

import {
  type ChannelStats,
  type VideoData,
  type YouTubeChannelStatsResponse,
  type YouTubeVideoSearchResponse,
  type YouTubeVideoDetailsResponse,
  type ApiError,
  type FormattedNumber,
  FOREVERGREEN_CHANNEL_ID
} from './youtube-types';

// Configuration
const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const DEFAULT_CONFIG = {
  channelId: FOREVERGREEN_CHANNEL_ID,
  maxResults: 3,
  apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
};

// Utility: Format numbers for display (1234 -> "1.2K")
export function formatNumber(num: number): FormattedNumber {
  const value = num;
  let formatted: string;

  if (num >= 1_000_000) {
    formatted = `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    formatted = `${(num / 1_000).toFixed(1)}K`;
  } else {
    formatted = num.toString();
  }

  // Remove unnecessary decimals (e.g., "1.0K" -> "1K")
  formatted = formatted.replace('.0', '');

  return { value, formatted };
}

// Utility: Get relative time string
export function getRelativeTime(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else if (diffWeeks > 0) {
    return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return 'Today';
  }
}

// Utility: Parse ISO 8601 duration to seconds (e.g., "PT1M30S" -> 90)
export function parseDurationToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}

// Utility: Check if video is a YouTube Short (duration <= 60 seconds / 1 minutes)
export function isShort(duration: string): boolean {
  const durationInSeconds = parseDurationToSeconds(duration);
  return durationInSeconds > 0 && durationInSeconds <= 60;
}

// Utility: Create API error
function createApiError(message: string, code?: number, details?: unknown): ApiError {
  return { message, code, details };
}

// Utility: Make API request with error handling
async function apiRequest<T>(url: string): Promise<T> {
  if (!DEFAULT_CONFIG.apiKey) {
    throw createApiError('YouTube API key not configured. Please set VITE_YOUTUBE_API_KEY environment variable.');
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 403) {
        throw createApiError('YouTube API quota exceeded or access forbidden', 403);
      } else if (response.status === 404) {
        throw createApiError('YouTube channel not found', 404);
      } else {
        throw createApiError(`API request failed: ${response.statusText}`, response.status);
      }
    }

    const data = await response.json();

    if (data.error) {
      throw createApiError(data.error.message, data.error.code, data.error);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw createApiError(`Network error: ${error.message}`, undefined, error);
    }
    throw createApiError('Unknown error occurred during API request', undefined, error);
  }
}

// Fetch channel statistics (subscriber count, view count, video count)
export async function fetchChannelStats(channelId: string = DEFAULT_CONFIG.channelId): Promise<ChannelStats> {
  const url = `${API_BASE_URL}/channels?part=statistics&id=${channelId}&key=${DEFAULT_CONFIG.apiKey}`;

  const response = await apiRequest<YouTubeChannelStatsResponse>(url);

  if (!response.items || response.items.length === 0) {
    throw createApiError('Channel not found or has no statistics available');
  }

  const stats = response.items[0].statistics;

  return {
    subscriberCount: parseInt(stats.subscriberCount, 10),
    totalViewCount: parseInt(stats.viewCount, 10),
    videoCount: parseInt(stats.videoCount, 10),
    lastUpdated: Date.now(),
  };
}

// Fetch latest videos from channel (excludes YouTube Shorts)
export async function fetchLatestVideos(
  channelId: string = DEFAULT_CONFIG.channelId,
  maxResults: number = DEFAULT_CONFIG.maxResults
): Promise<VideoData[]> {
  // Fetch more videos initially to ensure we have enough after filtering out shorts
  const fetchCount = 50; // Fetch many videos to ensure we get enough regular videos after filtering

  const searchUrl = `${API_BASE_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${fetchCount}&key=${DEFAULT_CONFIG.apiKey}`;

  const searchResponse = await apiRequest<YouTubeVideoSearchResponse>(searchUrl);

  if (!searchResponse.items || searchResponse.items.length === 0) {
    return [];
  }

  // Get video IDs for detailed statistics
  const videoIds = searchResponse.items.map(item => item.id.videoId).join(',');
  const detailsUrl = `${API_BASE_URL}/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${DEFAULT_CONFIG.apiKey}`;

  const detailsResponse = await apiRequest<YouTubeVideoDetailsResponse>(detailsUrl);

  // Combine search results with detailed statistics and filter out shorts
  const allVideos = searchResponse.items
    .map((searchItem) => {
      const detailItem = detailsResponse.items.find(detail => detail.id === searchItem.id.videoId);
      const viewCount = detailItem ? parseInt(detailItem.statistics.viewCount, 10) : 0;
      const duration = detailItem?.contentDetails?.duration || '';

      return {
        id: searchItem.id.videoId,
        title: searchItem.snippet.title,
        description: searchItem.snippet.description,
        thumbnail: {
          url: searchItem.snippet.thumbnails.high.url,
          width: searchItem.snippet.thumbnails.high.width,
          height: searchItem.snippet.thumbnails.high.height,
        },
        publishedAt: searchItem.snippet.publishedAt,
        viewCount,
        url: `https://www.youtube.com/watch?v=${searchItem.id.videoId}`,
        duration,
        relativeTime: getRelativeTime(searchItem.snippet.publishedAt),
      };
    })
    .filter(video => video.duration && !isShort(video.duration)); // Filter out shorts

  // Return only the requested number of regular videos
  return allVideos.slice(0, maxResults);
}

// Fetch both channel stats and latest videos in one call (for efficiency)
export async function fetchAllYouTubeData(channelId?: string): Promise<{
  channelStats: ChannelStats;
  latestVideos: VideoData[];
}> {
  try {
    const [channelStats, latestVideos] = await Promise.all([
      fetchChannelStats(channelId),
      fetchLatestVideos(channelId),
    ]);

    return { channelStats, latestVideos };
  } catch (error) {
    // Re-throw with additional context
    if (error instanceof Error) {
      throw createApiError(`Failed to fetch YouTube data: ${error.message}`, undefined, error);
    }
    throw error;
  }
}

// Validation: Check if API key is configured
export function isApiConfigured(): boolean {
  return Boolean(DEFAULT_CONFIG.apiKey);
}

// Get current configuration
export function getConfig() {
  return { ...DEFAULT_CONFIG };
}