// React Query hooks for checkout management

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCheckoutSession,
  pollCheckoutStatus,
  getCheckoutSession,
  CheckoutSessionResponse,
} from '@/lib/services/checkoutService';
import { CartItem } from '@/types/product';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

/**
 * Hook to create checkout session and redirect to Stripe
 */
export function useCreateCheckout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartItems,
      successUrl,
      cancelUrl,
    }: {
      cartItems: CartItem[];
      successUrl?: string;
      cancelUrl?: string;
    }) => {
      if (!user?.uid) throw new Error('User not authenticated');

      const origin = window.location.origin;
      const defaultSuccessUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
      const defaultCancelUrl = `${origin}/cart`;

      // Create checkout session document
      const sessionId = await createCheckoutSession(
        user.uid,
        cartItems,
        successUrl || defaultSuccessUrl,
        cancelUrl || defaultCancelUrl
      );

      // Poll for Stripe session URL
      const sessionData = await pollCheckoutStatus(user.uid, sessionId, 15, 1000);

      return sessionData;
    },
    onSuccess: (data: CheckoutSessionResponse) => {
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      console.error('Checkout error:', error);
      const errorMessage = error?.message || error?.toString() || 'Failed to create checkout session';
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to get checkout session details
 */
export function useCheckoutSession(sessionId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['checkout-session', user?.uid, sessionId],
    queryFn: () => {
      if (!user?.uid || !sessionId) return null;
      return getCheckoutSession(user.uid, sessionId);
    },
    enabled: !!user?.uid && !!sessionId,
    staleTime: 1000 * 60, // 1 minute
  });
}
