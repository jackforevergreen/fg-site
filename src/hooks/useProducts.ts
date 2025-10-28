// React Query hooks for product management

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  fetchCarbonCreditProducts,
  fetchSpecificProduct,
  fetchSubscriptionTiers,
  fetchOneTimeProducts,
  fetchSubscriptionProducts,
} from '@/lib/services/productService';
import { Product } from '@/types/product';
import { SubscriptionTier } from '@/types/subscription';

/**
 * Hook to fetch all carbon credit products
 */
export function useProducts(): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchCarbonCreditProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  });
}

/**
 * Hook to fetch a specific product by ID
 */
export function useProduct(productId: string): UseQueryResult<Product | null, Error> {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchSpecificProduct(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Hook to fetch subscription tiers
 * @param monthlyEmissions - Optional user's monthly CO2 emissions to determine recommended tier
 */
export function useSubscriptionTiers(
  monthlyEmissions?: number
): UseQueryResult<SubscriptionTier[], Error> {
  return useQuery({
    queryKey: ['subscription-tiers', monthlyEmissions],
    queryFn: () => fetchSubscriptionTiers(monthlyEmissions),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Hook to fetch one-time purchase products
 */
export function useOneTimeProducts(): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['products', 'one-time'],
    queryFn: fetchOneTimeProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Hook to fetch recurring subscription products
 */
export function useSubscriptionProducts(): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['products', 'subscription'],
    queryFn: fetchSubscriptionProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
