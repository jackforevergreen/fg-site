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

// Local storage key for anonymous cart
const ANONYMOUS_CART_KEY = 'anonymousCart';

// Helper functions for localStorage cart
const getLocalCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(ANONYMOUS_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading local cart:', error);
    return [];
  }
};

const setLocalCart = (items: CartItem[]): void => {
  try {
    localStorage.setItem(ANONYMOUS_CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving local cart:', error);
  }
};

/**
 * Hook to get cart with real-time updates
 * Works for both authenticated and anonymous users
 */
export function useCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.uid;

  // Initial fetch - use localStorage for anonymous users
  const query = useQuery({
    queryKey: ['cart', userId || 'anonymous'],
    queryFn: async () => {
      if (userId) {
        return getCart(userId);
      } else {
        // Return local cart for anonymous users
        return getLocalCart();
      }
    },
    staleTime: 1000, // 1 second
  });

  // Real-time subscription for authenticated users
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
 * Works for both authenticated and anonymous users
 */
export function useAddToCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<CartItem, 'id'>) => {
      if (!user?.uid) {
        // For anonymous users, store cart in localStorage
        const localCart = getLocalCart();
        const cartItemId = `${item.priceId}_${Date.now()}`;
        const newItem: CartItem = { ...item, id: cartItemId };
        const updatedCart = [...localCart, newItem];
        setLocalCart(updatedCart);
        return newItem;
      }
      return addToCart(user.uid, item);
    },
    onMutate: async (newItem) => {
      const cartKey = ['cart', user?.uid || 'anonymous'];

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKey });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData<CartItem[]>(cartKey);

      // Optimistically update
      queryClient.setQueryData<CartItem[]>(cartKey, (old) => [
        ...(old || []),
        { ...newItem, id: `temp_${Date.now()}` } as CartItem,
      ]);

      return { previousCart };
    },
    onError: (err, newItem, context) => {
      // Rollback on error
      const cartKey = ['cart', user?.uid || 'anonymous'];
      if (context?.previousCart) {
        queryClient.setQueryData(cartKey, context.previousCart);
      }
    },
    onSuccess: () => {
      // Invalidate to refetch
      const cartKey = ['cart', user?.uid || 'anonymous'];
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });
}

/**
 * Hook to remove item from cart
 * Works for both authenticated and anonymous users
 */
export function useRemoveFromCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      if (!user?.uid) {
        // For anonymous users, remove from localStorage
        const localCart = getLocalCart();
        const updatedCart = localCart.filter((item) => item.id !== itemId);
        setLocalCart(updatedCart);
        return;
      }
      return removeFromCart(user.uid, itemId);
    },
    onMutate: async (itemId) => {
      const cartKey = ['cart', user?.uid || 'anonymous'];

      await queryClient.cancelQueries({ queryKey: cartKey });

      const previousCart = queryClient.getQueryData<CartItem[]>(cartKey);

      queryClient.setQueryData<CartItem[]>(cartKey, (old) =>
        (old || []).filter((item) => item.id !== itemId)
      );

      return { previousCart };
    },
    onError: (err, itemId, context) => {
      const cartKey = ['cart', user?.uid || 'anonymous'];
      if (context?.previousCart) {
        queryClient.setQueryData(cartKey, context.previousCart);
      }
    },
    onSuccess: () => {
      const cartKey = ['cart', user?.uid || 'anonymous'];
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });
}

/**
 * Hook to update item quantity
 * Works for both authenticated and anonymous users
 */
export function useUpdateQuantity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!user?.uid) {
        // For anonymous users, update localStorage
        const localCart = getLocalCart();
        const updatedCart = localCart
          .map((item) => item.id === itemId ? { ...item, quantity } : item)
          .filter((item) => item.quantity > 0);
        setLocalCart(updatedCart);
        return;
      }
      return updateQuantity(user.uid, itemId, quantity);
    },
    onMutate: async ({ itemId, quantity }) => {
      const cartKey = ['cart', user?.uid || 'anonymous'];

      await queryClient.cancelQueries({ queryKey: cartKey });

      const previousCart = queryClient.getQueryData<CartItem[]>(cartKey);

      queryClient.setQueryData<CartItem[]>(cartKey, (old) =>
        (old || []).map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ).filter((item) => item.quantity > 0)
      );

      return { previousCart };
    },
    onError: (err, variables, context) => {
      const cartKey = ['cart', user?.uid || 'anonymous'];
      if (context?.previousCart) {
        queryClient.setQueryData(cartKey, context.previousCart);
      }
    },
    onSuccess: () => {
      const cartKey = ['cart', user?.uid || 'anonymous'];
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });
}

/**
 * Hook to increment item quantity
 * Works for both authenticated and anonymous users
 */
export function useIncrementQuantity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      if (!user?.uid) {
        const localCart = getLocalCart();
        const item = localCart.find(i => i.id === itemId);
        if (item) {
          const updatedCart = localCart.map(i =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
          );
          setLocalCart(updatedCart);
        }
        return;
      }
      return incrementQuantity(user.uid, itemId);
    },
    onSuccess: () => {
      const cartKey = ['cart', user?.uid || 'anonymous'];
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });
}

/**
 * Hook to decrement item quantity
 * Works for both authenticated and anonymous users
 */
export function useDecrementQuantity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      if (!user?.uid) {
        const localCart = getLocalCart();
        const item = localCart.find(i => i.id === itemId);
        if (item) {
          const updatedCart = localCart
            .map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)
            .filter(i => i.quantity > 0);
          setLocalCart(updatedCart);
        }
        return;
      }
      return decrementQuantity(user.uid, itemId);
    },
    onSuccess: () => {
      const cartKey = ['cart', user?.uid || 'anonymous'];
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });
}

/**
 * Hook to clear entire cart
 * Works for both authenticated and anonymous users
 */
export function useClearCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.uid) {
        setLocalCart([]);
        return;
      }
      return clearCart(user.uid);
    },
    onSuccess: () => {
      const cartKey = ['cart', user?.uid || 'anonymous'];
      queryClient.setQueryData(cartKey, []);
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
