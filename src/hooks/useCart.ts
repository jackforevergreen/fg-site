// React Query hooks for cart management

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  subscribeToCart,
} from '@/lib/services/cartService';
import { CartItem } from '@/types/product';
import { useAuth } from './useAuth';

/**
 * Hook to get cart with real-time updates
 */
export function useCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.uid;

  // Initial fetch
  const query = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => getCart(userId!),
    enabled: !!userId,
    staleTime: 1000, // 1 second
  });

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToCart(userId, (items) => {
      queryClient.setQueryData(['cart', userId], items);
    });

    return () => {
      unsubscribe();
    };
  }, [userId, queryClient]);

  return query;
}

/**
 * Hook to add item to cart
 */
export function useAddToCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: Omit<CartItem, 'id'>) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return addToCart(user.uid, item);
    },
    onMutate: async (newItem) => {
      if (!user?.uid) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart', user.uid] });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData<CartItem[]>(['cart', user.uid]);

      // Optimistically update
      queryClient.setQueryData<CartItem[]>(['cart', user.uid], (old) => [
        ...(old || []),
        { ...newItem, id: `temp_${Date.now()}` } as CartItem,
      ]);

      return { previousCart };
    },
    onError: (err, newItem, context) => {
      // Rollback on error
      if (user?.uid && context?.previousCart) {
        queryClient.setQueryData(['cart', user.uid], context.previousCart);
      }
    },
    onSuccess: () => {
      // Invalidate to refetch
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.uid] });
      }
    },
  });
}

/**
 * Hook to remove item from cart
 */
export function useRemoveFromCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return removeFromCart(user.uid, itemId);
    },
    onMutate: async (itemId) => {
      if (!user?.uid) return;

      await queryClient.cancelQueries({ queryKey: ['cart', user.uid] });

      const previousCart = queryClient.getQueryData<CartItem[]>(['cart', user.uid]);

      queryClient.setQueryData<CartItem[]>(['cart', user.uid], (old) =>
        (old || []).filter((item) => item.id !== itemId)
      );

      return { previousCart };
    },
    onError: (err, itemId, context) => {
      if (user?.uid && context?.previousCart) {
        queryClient.setQueryData(['cart', user.uid], context.previousCart);
      }
    },
    onSuccess: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.uid] });
      }
    },
  });
}

/**
 * Hook to update item quantity
 */
export function useUpdateQuantity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return updateQuantity(user.uid, itemId, quantity);
    },
    onMutate: async ({ itemId, quantity }) => {
      if (!user?.uid) return;

      await queryClient.cancelQueries({ queryKey: ['cart', user.uid] });

      const previousCart = queryClient.getQueryData<CartItem[]>(['cart', user.uid]);

      queryClient.setQueryData<CartItem[]>(['cart', user.uid], (old) =>
        (old || []).map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ).filter((item) => item.quantity > 0)
      );

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (user?.uid && context?.previousCart) {
        queryClient.setQueryData(['cart', user.uid], context.previousCart);
      }
    },
    onSuccess: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.uid] });
      }
    },
  });
}

/**
 * Hook to increment item quantity
 */
export function useIncrementQuantity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return incrementQuantity(user.uid, itemId);
    },
    onSuccess: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.uid] });
      }
    },
  });
}

/**
 * Hook to decrement item quantity
 */
export function useDecrementQuantity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return decrementQuantity(user.uid, itemId);
    },
    onSuccess: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.uid] });
      }
    },
  });
}

/**
 * Hook to clear entire cart
 */
export function useClearCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user?.uid) throw new Error('User not authenticated');
      return clearCart(user.uid);
    },
    onSuccess: () => {
      if (user?.uid) {
        queryClient.setQueryData(['cart', user.uid], []);
      }
    },
  });
}

/**
 * Hook to get cart count
 */
export function useCartCount(): number {
  const { data: cartItems } = useCart();
  return (cartItems || []).reduce((total, item) => total + item.quantity, 0);
}
