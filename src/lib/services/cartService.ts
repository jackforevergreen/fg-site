// Cart service for managing shopping cart in Firestore

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CartItem, ProductType, PriceType, ProjectType, PriceRecurring } from '@/types/product';

/**
 * Get user's cart from Firestore
 */
export async function getCart(userId: string): Promise<CartItem[]> {
  try {
    const cartRef = collection(db, `users/${userId}/cart`);
    const cartSnapshot = await getDocs(cartRef);

    const cartItems: CartItem[] = cartSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as CartItem));

    return cartItems;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error('Failed to fetch cart');
  }
}

/**
 * Add item to cart
 */
export async function addToCart(
  userId: string,
  item: Omit<CartItem, 'id'>
): Promise<CartItem> {
  try {
    // Generate a unique ID for the cart item (using priceId as base)
    const cartItemId = `${item.priceId}_${Date.now()}`;
    const cartItemRef = doc(db, `users/${userId}/cart`, cartItemId);

    // Filter out undefined values (Firestore doesn't support them)
    const cartItemData: any = {
      productId: item.productId,
      priceId: item.priceId,
      name: item.name,
      productType: item.productType,
      quantity: item.quantity,
      unitAmount: item.unitAmount,
      type: item.type,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Only add optional fields if they're defined
    if (item.projectType !== undefined) {
      cartItemData.projectType = item.projectType;
    }
    if (item.recurring !== undefined) {
      cartItemData.recurring = item.recurring;
    }

    await setDoc(cartItemRef, cartItemData);

    return {
      id: cartItemId,
      ...item,
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw new Error('Failed to add item to cart');
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(userId: string, itemId: string): Promise<void> {
  try {
    const cartItemRef = doc(db, `users/${userId}/cart`, itemId);
    await deleteDoc(cartItemRef);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw new Error('Failed to remove item from cart');
  }
}

/**
 * Update item quantity in cart
 */
export async function updateQuantity(
  userId: string,
  itemId: string,
  quantity: number
): Promise<void> {
  try {
    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      await removeFromCart(userId, itemId);
      return;
    }

    const cartItemRef = doc(db, `users/${userId}/cart`, itemId);
    await updateDoc(cartItemRef, {
      quantity,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating quantity:', error);
    throw new Error('Failed to update quantity');
  }
}

/**
 * Increment item quantity
 */
export async function incrementQuantity(userId: string, itemId: string): Promise<void> {
  try {
    const cartItemRef = doc(db, `users/${userId}/cart`, itemId);
    const cartItemDoc = await getDoc(cartItemRef);

    if (!cartItemDoc.exists()) {
      throw new Error('Cart item not found');
    }

    const currentQuantity = cartItemDoc.data().quantity || 0;
    await updateQuantity(userId, itemId, currentQuantity + 1);
  } catch (error) {
    console.error('Error incrementing quantity:', error);
    throw new Error('Failed to increment quantity');
  }
}

/**
 * Decrement item quantity
 */
export async function decrementQuantity(userId: string, itemId: string): Promise<void> {
  try {
    const cartItemRef = doc(db, `users/${userId}/cart`, itemId);
    const cartItemDoc = await getDoc(cartItemRef);

    if (!cartItemDoc.exists()) {
      throw new Error('Cart item not found');
    }

    const currentQuantity = cartItemDoc.data().quantity || 0;
    await updateQuantity(userId, itemId, currentQuantity - 1);
  } catch (error) {
    console.error('Error decrementing quantity:', error);
    throw new Error('Failed to decrement quantity');
  }
}

/**
 * Clear entire cart
 */
export async function clearCart(userId: string): Promise<void> {
  try {
    const cartRef = collection(db, `users/${userId}/cart`);
    const cartSnapshot = await getDocs(cartRef);

    // Delete all cart items
    const deletePromises = cartSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw new Error('Failed to clear cart');
  }
}

/**
 * Subscribe to real-time cart updates
 */
export function subscribeToCart(
  userId: string,
  callback: (items: CartItem[]) => void
): Unsubscribe {
  const cartRef = collection(db, `users/${userId}/cart`);

  return onSnapshot(
    cartRef,
    (snapshot) => {
      const cartItems: CartItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as CartItem));

      callback(cartItems);
    },
    (error) => {
      console.error('Error in cart subscription:', error);
      callback([]);
    }
  );
}

/**
 * Get cart item count
 */
export async function getCartCount(userId: string): Promise<number> {
  try {
    const cartItems = await getCart(userId);
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
}

/**
 * Check if item already exists in cart
 */
export async function isItemInCart(userId: string, priceId: string): Promise<boolean> {
  try {
    const cartItems = await getCart(userId);
    return cartItems.some((item) => item.priceId === priceId);
  } catch (error) {
    console.error('Error checking cart item:', error);
    return false;
  }
}

/**
 * Merge duplicate items in cart (if any exist)
 */
export async function mergeDuplicateItems(userId: string): Promise<void> {
  try {
    const cartItems = await getCart(userId);

    // Group items by priceId
    const itemGroups = cartItems.reduce((groups, item) => {
      if (!groups[item.priceId]) {
        groups[item.priceId] = [];
      }
      groups[item.priceId].push(item);
      return groups;
    }, {} as Record<string, CartItem[]>);

    // Merge duplicates
    for (const priceId in itemGroups) {
      const items = itemGroups[priceId];

      if (items.length > 1) {
        // Keep the first item and merge quantities
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

        // Update the first item with total quantity
        await updateQuantity(userId, items[0].id, totalQuantity);

        // Delete the rest
        for (let i = 1; i < items.length; i++) {
          await removeFromCart(userId, items[i].id);
        }
      }
    }
  } catch (error) {
    console.error('Error merging duplicate items:', error);
    throw new Error('Failed to merge duplicate items');
  }
}
