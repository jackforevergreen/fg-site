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
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebase';
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
 * Calls the Cloud Function to immediately cancel in Stripe
 */
export async function cancelSubscription(
  userId: string,
  subscriptionId: string
): Promise<void> {
  try {
    // Call the Cloud Function to cancel the subscription in Stripe
    const cancelFn = httpsCallable(functions, 'cancelSubscription');
    const result = await cancelFn({ subscriptionId });

    console.log('Subscription canceled:', result.data);
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    const errorMessage = error?.message || 'Failed to cancel subscription';
    throw new Error(errorMessage);
  }
}

/**
 * Reactivate a canceled subscription
 * Note: Since cancellation is immediate, users must create a new subscription
 */
export async function reactivateSubscription(
  userId: string,
  subscriptionId: string
): Promise<void> {
  throw new Error('Canceled subscriptions cannot be reactivated. Please create a new subscription from the Shop page.');
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
