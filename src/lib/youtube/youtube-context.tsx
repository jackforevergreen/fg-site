// React Context provider for global YouTube data state management

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import {
  type YouTubeData,
  type ChannelStats,
  type VideoData,
  type LoadingState,
} from './youtube-types';
import {
  fetchAllYouTubeData,
  isApiConfigured,
  formatNumber,
} from './youtube-api';
import {
  getCachedChannelStats,
  setCachedChannelStats,
  getCachedLatestVideos,
  setCachedLatestVideos,
  isChannelStatsCacheValid,
  isLatestVideosCacheValid,
  clearAllCache,
  logCacheStatus,
} from './youtube-cache';

// === Action Types ===

type YouTubeAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { channelStats: ChannelStats; latestVideos: VideoData[] } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_CHANNEL_STATS'; payload: ChannelStats }
  | { type: 'SET_LATEST_VIDEOS'; payload: VideoData[] }
  | { type: 'CLEAR_ERROR' }
  | { type: 'FORCE_REFRESH' };

// === State Reducer ===

const initialState: YouTubeData = {
  channelStats: null,
  latestVideos: [],
  loading: false,
  error: null,
  lastFetched: null,
};

function youtubeReducer(state: YouTubeData, action: YouTubeAction): YouTubeData {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        channelStats: action.payload.channelStats,
        latestVideos: action.payload.latestVideos,
        lastFetched: Date.now(),
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'SET_CHANNEL_STATS':
      return {
        ...state,
        channelStats: action.payload,
      };

    case 'SET_LATEST_VIDEOS':
      return {
        ...state,
        latestVideos: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'FORCE_REFRESH':
      return {
        ...state,
        channelStats: null,
        latestVideos: [],
        lastFetched: null,
        error: null,
      };

    default:
      return state;
  }
}

// === Context Types ===

interface YouTubeContextValue {
  // State
  data: YouTubeData;

  // Computed values
  formattedSubscriberCount: string;
  formattedViewCount: string;
  formattedVideoCount: string;

  // Actions
  fetchData: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  clearError: () => void;

  // Utilities
  isApiConfigured: boolean;
  hasCachedData: boolean;
}

// === Context Creation ===

const YouTubeContext = createContext<YouTubeContextValue | null>(null);

// === Static Fallback Data ===

const FALLBACK_DATA = {
  subscriberCount: 250000, // 250K
  totalViewCount: 630341877, // 630M
  videoCount: 500,
  lastUpdated: Date.now(),
};

const FALLBACK_VIDEOS: VideoData[] = [
  {
    id: '9JIAtBjy0Z0',
    title: 'The Immortal Jellyfish Explained',
    description: 'Discover the secrets of the immortal jellyfish and how it defies aging.',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/9JIAtBjy0Z0/hqdefault.jpg',
      width: 480,
      height: 360,
    },
    publishedAt: '2024-12-01T10:00:00Z',
    viewCount: 2100,
    url: 'https://www.youtube.com/watch?v=9JIAtBjy0Z0',
    relativeTime: '2 weeks ago',
  },
  {
    id: '2a6BRN0TXu0',
    title: 'Top 5 Smartest Animals and How We Measure Intelligence',
    description: 'Exploring animal intelligence and the fascinating ways we measure it.',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/2a6BRN0TXu0/hqdefault.jpg',
      width: 480,
      height: 360,
    },
    publishedAt: '2024-11-15T14:30:00Z',
    viewCount: 4200,
    url: 'https://www.youtube.com/watch?v=2a6BRN0TXu0',
    relativeTime: '1 month ago',
  },
  {
    id: 'uswcbDK2HeM',
    title: 'How Bees Make Honey',
    description: 'The incredible process of how bees create the sweet golden nectar we love.',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/uswcbDK2HeM/hqdefault.jpg',
      width: 480,
      height: 360,
    },
    publishedAt: '2024-10-20T09:15:00Z',
    viewCount: 8700,
    url: 'https://www.youtube.com/watch?v=uswcbDK2HeM',
    relativeTime: '2 months ago',
  },
];

// === Provider Component ===

export function YouTubeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(youtubeReducer, initialState);

  // Check if API is configured
  const apiConfigured = isApiConfigured();

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = () => {
      const cachedStats = getCachedChannelStats();
      const cachedVideos = getCachedLatestVideos();

      if (cachedStats) {
        dispatch({ type: 'SET_CHANNEL_STATS', payload: cachedStats });
      }

      if (cachedVideos && cachedVideos.length > 0) {
        dispatch({ type: 'SET_LATEST_VIDEOS', payload: cachedVideos });
      }

      // If no cached data, use fallback
      if (!cachedStats && !cachedVideos) {
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            channelStats: FALLBACK_DATA,
            latestVideos: FALLBACK_VIDEOS,
          },
        });
      }

      // Log cache status in development
      logCacheStatus();
    };

    loadCachedData();
  }, []);

  // Fetch fresh data from API
  const fetchData = useCallback(async () => {
    if (!apiConfigured) {
      console.warn('YouTube API not configured, using cached/fallback data');
      return;
    }

    // Check if cache is still valid to avoid unnecessary API calls
    const statsValid = isChannelStatsCacheValid();
    const videosValid = isLatestVideosCacheValid();

    if (statsValid && videosValid) {
      //console.log('Using valid cached YouTube data');
      return;
    }

    dispatch({ type: 'FETCH_START' });

    try {
      const { channelStats, latestVideos } = await fetchAllYouTubeData();

      // Cache the fresh data
      setCachedChannelStats(channelStats);
      setCachedLatestVideos(latestVideos);

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: { channelStats, latestVideos },
      });

      //console.log('Fetched fresh YouTube data:', { subscribers: formatNumber(channelStats.subscriberCount).formatted, videos: latestVideos.length });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch YouTube data';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      console.error('YouTube API error:', error);

      // Fall back to cached data if available
      const cachedStats = getCachedChannelStats();
      const cachedVideos = getCachedLatestVideos();

      if (cachedStats || cachedVideos) {
        //console.log('Falling back to cached YouTube data');
        if (cachedStats) dispatch({ type: 'SET_CHANNEL_STATS', payload: cachedStats });
        if (cachedVideos) dispatch({ type: 'SET_LATEST_VIDEOS', payload: cachedVideos });
      } else {
        // Final fallback to static data
        //console.log('Using fallback YouTube data');
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            channelStats: FALLBACK_DATA,
            latestVideos: FALLBACK_VIDEOS,
          },
        });
      }
    }
  }, [apiConfigured]);

  // Force refresh by clearing cache and fetching new data
  const forceRefresh = useCallback(async () => {
    clearAllCache();
    dispatch({ type: 'FORCE_REFRESH' });
    await fetchData();
  }, [fetchData]);

  // Clear error state
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Auto-fetch data on mount if needed
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compute formatted values
  const formattedSubscriberCount = state.channelStats
    ? formatNumber(state.channelStats.subscriberCount).formatted
    : '250K+';

  const formattedViewCount = state.channelStats
    ? formatNumber(state.channelStats.totalViewCount).formatted
    : '630M+';

  const formattedVideoCount = state.channelStats
    ? formatNumber(state.channelStats.videoCount).formatted
    : '500+';

  const contextValue: YouTubeContextValue = {
    data: state,
    formattedSubscriberCount,
    formattedViewCount,
    formattedVideoCount,
    fetchData,
    forceRefresh,
    clearError,
    isApiConfigured: apiConfigured,
    hasCachedData: Boolean(state.channelStats || state.latestVideos.length > 0),
  };

  return (
    <YouTubeContext.Provider value={contextValue}>
      {children}
    </YouTubeContext.Provider>
  );
}

// === Custom Hook ===

export function useYouTube(): YouTubeContextValue {
  const context = useContext(YouTubeContext);

  if (!context) {
    throw new Error('useYouTube must be used within a YouTubeProvider');
  }

  return context;
}

// === Utility Hooks ===

// Hook for just the formatted subscriber count (most common use case)
export function useSubscriberCount(): string {
  const { formattedSubscriberCount } = useYouTube();
  return formattedSubscriberCount;
}

// Hook for latest videos
export function useLatestVideos(): VideoData[] {
  const { data } = useYouTube();
  return data.latestVideos;
}

// Hook for channel stats
export function useChannelStats(): ChannelStats | null {
  const { data } = useYouTube();
  return data.channelStats;
}