// Stripe initialization for web checkout

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn(
    'Stripe publishable key not found. Please set VITE_STRIPE_PUBLISHABLE_KEY in your .env file.'
  );
}

// Initialize Stripe (singleton pattern)
let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey || '');
  }
  return stripePromise;
};

export default getStripe;
