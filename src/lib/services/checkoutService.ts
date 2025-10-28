// Checkout service for creating Stripe Checkout sessions

import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckoutSession, CheckoutLineItem, CartItem } from '@/types/product';

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
  error?: string;
}

/**
 * Create a Stripe Checkout Session
 * The Cloud Function will intercept this and create the actual Stripe session
 */
export async function createCheckoutSession(
  userId: string,
  cartItems: CartItem[],
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  try {
    console.log('Creating checkout session for user:', userId);
    console.log('Cart items:', cartItems);

    // Determine if this is a subscription or one-time payment
    const hasSubscription = cartItems.some((item) => item.type === 'recurring');
    const mode = hasSubscription ? 'subscription' : 'payment';

    // Convert cart items to checkout line items
    const line_items: CheckoutLineItem[] = cartItems.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

    // Create checkout session document
    const checkoutSessionId = `session_${Date.now()}`;
    const checkoutSessionRef = doc(
      db,
      `users/${userId}/checkout_sessions`,
      checkoutSessionId
    );

    const sessionData: CheckoutSession & { createdAt: any } = {
      client: 'web',
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items,
      createdAt: serverTimestamp(),
    };

    console.log('Writing checkout session:', sessionData);
    await setDoc(checkoutSessionRef, sessionData);
    console.log('Checkout session created successfully:', checkoutSessionId);

    // Return the session ID so the caller can poll for the URL
    return checkoutSessionId;
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    throw new Error(`Failed to create checkout session: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Poll for checkout session URL from Cloud Function
 * The Cloud Function updates the document with the Stripe session details
 */
export async function pollCheckoutStatus(
  userId: string,
  sessionId: string,
  maxAttempts: number = 10,
  interval: number = 1000
): Promise<CheckoutSessionResponse> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkoutSessionRef = doc(db, `users/${userId}/checkout_sessions`, sessionId);

    const unsubscribe = onSnapshot(
      checkoutSessionRef,
      (snapshot) => {
        attempts++;
        console.log(`Poll attempt ${attempts}/${maxAttempts}`);

        if (!snapshot.exists()) {
          console.log('Checkout session document does not exist');
          if (attempts >= maxAttempts) {
            unsubscribe();
            reject(new Error('Checkout session not found'));
          }
          return;
        }

        const data = snapshot.data();
        console.log('Checkout session data:', data);

        // Check if Cloud Function has populated the session
        if (data.url && data.sessionId) {
          console.log('Checkout session ready!', data);
          unsubscribe();
          resolve({
            sessionId: data.sessionId,
            url: data.url,
          });
          return;
        }

        // Check for errors
        if (data.error) {
          console.error('Checkout session error from Cloud Function:', data.error);
          unsubscribe();
          const errorMessage = typeof data.error === 'object' ? data.error.message || JSON.stringify(data.error) : data.error;
          reject(new Error(errorMessage));
          return;
        }

        // Max attempts reached
        if (attempts >= maxAttempts) {
          console.error('Checkout session timed out. Final data:', data);
          unsubscribe();
          reject(new Error('Checkout session creation timed out. The Cloud Function may not be deployed or configured correctly. Check Firebase Functions logs.'));
        }
      },
      (error) => {
        console.error('Firestore snapshot error:', error);
        unsubscribe();
        reject(new Error(`Failed to watch checkout session: ${error.message || 'Unknown error'}`));
      }
    );

    // Also poll manually in case snapshot doesn't fire
    const pollInterval = setInterval(async () => {
      try {
        const snapshot = await getDoc(checkoutSessionRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          if (data.url && data.sessionId) {
            clearInterval(pollInterval);
            resolve({
              sessionId: data.sessionId,
              url: data.url,
            });
          }
        }
      } catch (error) {
        // Continue polling
      }
    }, interval);

    // Cleanup after max attempts
    setTimeout(() => {
      clearInterval(pollInterval);
    }, maxAttempts * interval);
  });
}

/**
 * Subscribe to checkout session updates
 */
export function subscribeToCheckoutSession(
  userId: string,
  sessionId: string,
  callback: (data: any) => void
): Unsubscribe {
  const checkoutSessionRef = doc(db, `users/${userId}/checkout_sessions`, sessionId);

  return onSnapshot(
    checkoutSessionRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      }
    },
    (error) => {
      console.error('Error subscribing to checkout session:', error);
      callback({ error: error.message });
    }
  );
}

/**
 * Get checkout session details
 */
export async function getCheckoutSession(
  userId: string,
  sessionId: string
): Promise<any | null> {
  try {
    const checkoutSessionRef = doc(db, `users/${userId}/checkout_sessions`, sessionId);
    const snapshot = await getDoc(checkoutSessionRef);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data();
  } catch (error) {
    console.error('Error getting checkout session:', error);
    throw new Error('Failed to get checkout session');
  }
}

/**
 * Get purchase details from a completed session
 */
export async function getPurchaseDetails(userId: string, sessionId: string): Promise<any | null> {
  try {
    // Check if payment was created
    const paymentsRef = collection(db, `users/${userId}/payments`);
    const sessionData = await getCheckoutSession(userId, sessionId);

    if (!sessionData) {
      return null;
    }

    // For now, return the session data
    // In production, you'd fetch the actual payment record
    return sessionData;
  } catch (error) {
    console.error('Error getting purchase details:', error);
    return null;
  }
}
