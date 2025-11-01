// Custom hook for fetching and managing emissions data

import { useState, useEffect } from 'react';
import { fetchEmissionsData } from '@/api/emissions';
import { EmissionsDocument } from '@/types/emissions';

interface UseEmissionsDataResult {
  emissionsData: EmissionsDocument | null;
  yearlyEmissions: number;
  monthlyEmissions: number;
  loading: boolean;
  error: Error | null;
}

interface UseEmissionsDataOptions {
  isAuthenticated: boolean;
  defaultYearlyEmissions?: number;
  defaultMonthlyEmissions?: number;
}

/**
 * Hook to fetch and calculate emissions data for authenticated users
 * Returns both yearly and monthly emissions with loading states
 */
export function useEmissionsData({
  isAuthenticated,
  defaultYearlyEmissions = 24, // Default yearly emissions for non-authenticated users
  defaultMonthlyEmissions = 2, // Default monthly emissions for non-authenticated users
}: UseEmissionsDataOptions): UseEmissionsDataResult {
  const [emissionsData, setEmissionsData] = useState<EmissionsDocument | null>(null);
  const [yearlyEmissions, setYearlyEmissions] = useState<number>(defaultYearlyEmissions);
  const [monthlyEmissions, setMonthlyEmissions] = useState<number>(defaultMonthlyEmissions);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAndSetEmissions = async () => {
      if (!isAuthenticated) {
        // Use default values for non-authenticated users
        setYearlyEmissions(defaultYearlyEmissions);
        setMonthlyEmissions(defaultMonthlyEmissions);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchEmissionsData();
        setEmissionsData(data);

        if (data?.totalEmissions) {
          // totalEmissions in database is yearly emissions
          const yearly = data.totalEmissions;
          const monthly = yearly / 12;

          setYearlyEmissions(yearly);
          setMonthlyEmissions(monthly);
        } else {
          // Use defaults if no data found
          setYearlyEmissions(defaultYearlyEmissions);
          setMonthlyEmissions(defaultMonthlyEmissions);
          //console.log('No emissions data found in database, using defaults');
        }
      } catch (err) {
        console.error('Error fetching emissions data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch emissions data'));
        // Use defaults on error
        setYearlyEmissions(defaultYearlyEmissions);
        setMonthlyEmissions(defaultMonthlyEmissions);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetEmissions();
  }, [isAuthenticated, defaultYearlyEmissions, defaultMonthlyEmissions]);

  return {
    emissionsData,
    yearlyEmissions,
    monthlyEmissions,
    loading,
    error,
  };
}
