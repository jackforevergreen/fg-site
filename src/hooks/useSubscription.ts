// React Query hooks for subscription management

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getSubscriptionStatus,
  getAllSubscriptions,
  cancelSubscription,
  reactivateSubscription,
  hasActiveSubscription,
  subscribeToSubscription,
} from '@/lib/services/subscriptionService';
import { Subscription } from '@/types/subscription';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

/**
 * Hook to get user's active subscription with real-time updates
 */
export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.uid;

  // Initial fetch
  const query = useQuery({
    queryKey: ['subscription', userId],
    queryFn: () => getSubscriptionStatus(userId!),
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToSubscription(userId, (subscription) => {
      queryClient.setQueryData(['subscription', userId], subscription);
    });

    return () => {
      unsubscribe();
    };
  }, [userId, queryClient]);

  return query;
}

/**
 * Hook to get all user subscriptions (including past ones)
 */
export function useAllSubscriptions(): UseQueryResult<Subscription[], Error> {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subscriptions', 'all', user?.uid],
    queryFn: () => getAllSubscriptions(user!.uid),
    enabled: !!user?.uid,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to cancel subscription
 */
export function useCancelSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return cancelSubscription(user.uid, subscriptionId);
    },
    onSuccess: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ['subscription', user.uid] });
        queryClient.invalidateQueries({ queryKey: ['subscriptions', 'all', user.uid] });
      }
      toast.success('Subscription will be canceled at the end of the billing period.');
    },
    onError: (error: Error) => {
      console.error('Cancel subscription error:', error);
      toast.error('Failed to cancel subscription. Please try again.');
    },
  });
}

/**
 * Hook to reactivate a canceled subscription
 */
export function useReactivateSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return reactivateSubscription(user.uid, subscriptionId);
    },
    onSuccess: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ['subscription', user.uid] });
        queryClient.invalidateQueries({ queryKey: ['subscriptions', 'all', user.uid] });
      }
      toast.success('Subscription has been reactivated.');
    },
    onError: (error: Error) => {
      console.error('Reactivate subscription error:', error);
      toast.error('Failed to reactivate subscription. Please try again.');
    },
  });
}

/**
 * Hook to check if user has active subscription
 */
export function useHasActiveSubscription(): boolean {
  const { data: subscription, isLoading } = useSubscription();

  if (isLoading) return false;

  return subscription !== null && subscription.status === 'active';
}
