// Subscription service for managing carbon credit subscriptions

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Subscription, SubscriptionStatus } from '@/types/subscription';

/**
 * Get user's active subscription
 */
export async function getSubscriptionStatus(userId: string): Promise<Subscription | null> {
  try {
    const subscriptionsRef = collection(db, `users/${userId}/subscriptions`);
    const q = query(
      subscriptionsRef,
      where('status', 'in', ['active', 'trialing']),
      orderBy('created', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const subscriptionDoc = querySnapshot.docs[0];
    return {
      id: subscriptionDoc.id,
      ...subscriptionDoc.data(),
    } as Subscription;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw new Error('Failed to fetch subscription status');
  }
}

/**
 * Get all user subscriptions (active and past)
 */
export async function getAllSubscriptions(userId: string): Promise<Subscription[]> {
  try {
    const subscriptionsRef = collection(db, `users/${userId}/subscriptions`);
    const q = query(subscriptionsRef, orderBy('created', 'desc'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Subscription));
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw new Error('Failed to fetch subscriptions');
  }
}

/**
 * Cancel a subscription
 * This creates a cancellation request that the Cloud Function will process
 */
export async function cancelSubscription(
  userId: string,
  subscriptionId: string
): Promise<void> {
  try {
    const subscriptionRef = doc(db, `users/${userId}/subscriptions`, subscriptionId);

    // Update the subscription to mark it for cancellation
    // The Cloud Function will handle the actual Stripe cancellation
    await updateDoc(subscriptionRef, {
      cancel_at_period_end: true,
      cancellation_requested_at: new Date(),
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

/**
 * Reactivate a canceled subscription (before period ends)
 */
export async function reactivateSubscription(
  userId: string,
  subscriptionId: string
): Promise<void> {
  try {
    const subscriptionRef = doc(db, `users/${userId}/subscriptions`, subscriptionId);

    await updateDoc(subscriptionRef, {
      cancel_at_period_end: false,
      cancellation_requested_at: null,
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw new Error('Failed to reactivate subscription');
  }
}

/**
 * Subscribe to real-time subscription updates
 */
export function subscribeToSubscription(
  userId: string,
  callback: (subscription: Subscription | null) => void
): Unsubscribe {
  const subscriptionsRef = collection(db, `users/${userId}/subscriptions`);
  const q = query(
    subscriptionsRef,
    where('status', 'in', ['active', 'trialing']),
    orderBy('created', 'desc'),
    limit(1)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }

      const subscriptionDoc = snapshot.docs[0];
      callback({
        id: subscriptionDoc.id,
        ...subscriptionDoc.data(),
      } as Subscription);
    },
    (error) => {
      console.error('Error in subscription subscription:', error);
      callback(null);
    }
  );
}

/**
 * Check if user has an active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const subscription = await getSubscriptionStatus(userId);
    return subscription !== null && subscription.status === SubscriptionStatus.ACTIVE;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

/**
 * Get subscription by ID
 */
export async function getSubscriptionById(
  userId: string,
  subscriptionId: string
): Promise<Subscription | null> {
  try {
    const subscriptionRef = doc(db, `users/${userId}/subscriptions`, subscriptionId);
    const subscriptionDoc = await getDoc(subscriptionRef);

    if (!subscriptionDoc.exists()) {
      return null;
    }

    return {
      id: subscriptionDoc.id,
      ...subscriptionDoc.data(),
    } as Subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw new Error('Failed to fetch subscription');
  }
}

/**
 * Get subscription history (completed/canceled subscriptions)
 */
export async function getSubscriptionHistory(userId: string): Promise<Subscription[]> {
  try {
    const subscriptionsRef = collection(db, `users/${userId}/subscriptions`);
    const q = query(
      subscriptionsRef,
      where('status', 'in', ['canceled', 'unpaid', 'incomplete_expired']),
      orderBy('created', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Subscription));
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    throw new Error('Failed to fetch subscription history');
  }
}
