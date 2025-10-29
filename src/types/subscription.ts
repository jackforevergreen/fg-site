// Subscription types for carbon credit subscriptions

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
  UNPAID = 'unpaid',
}

export interface SubscriptionPrice {
  id: string;
  unit_amount: number;
  product: string;
  recurring?: {
    interval: 'month' | 'year';
  };
}

export interface SubscriptionItem {
  id: string;
  price: SubscriptionPrice;
  quantity?: number;
}

export interface Subscription {
  id: string; // Stripe subscription ID
  status: SubscriptionStatus;
  current_period_end: number; // Unix timestamp
  current_period_start: number; // Unix timestamp
  created: number; // Unix timestamp
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  items: SubscriptionItem[];
  metadata?: {
    emissions_tier?: string;
    co2_offset?: string;
  };
}

// Subscription tier based on monthly emissions
export interface SubscriptionTier {
  id: string;
  name: string;
  emissions_min: number; // Tons of CO2 per month
  emissions_max: number; // Tons of CO2 per month
  price_id: string;
  monthly_price: number; // In cents
  co2_offset: number; // Tons of CO2 offset per month
  recommended?: boolean;
}

// Predefined subscription tiers (matching mobile app)
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'tier-1',
    name: 'Small Footprint',
    emissions_min: 0,
    emissions_max: 1,
    price_id: '', // Will be populated from Firestore
    monthly_price: 1000, // $10.00
    co2_offset: 1,
  },
  {
    id: 'tier-2',
    name: 'Moderate Footprint',
    emissions_min: 1,
    emissions_max: 2,
    price_id: '',
    monthly_price: 2000, // $20.00
    co2_offset: 2,
  },
  {
    id: 'tier-3',
    name: 'Large Footprint',
    emissions_min: 2,
    emissions_max: 3,
    price_id: '',
    monthly_price: 3000, // $30.00
    co2_offset: 3,
  },
  {
    id: 'tier-4',
    name: 'Very Large Footprint',
    emissions_min: 3,
    emissions_max: 4,
    price_id: '',
    monthly_price: 4000, // $40.00
    co2_offset: 4,
  },
  {
    id: 'tier-5',
    name: 'Extreme Footprint',
    emissions_min: 4,
    emissions_max: Infinity,
    price_id: '',
    monthly_price: 5000, // $50.00
    co2_offset: 5,
  },
];

// Helper to determine recommended tier based on emissions
export function getRecommendedTier(monthlyEmissions: number): SubscriptionTier | null {
  return SUBSCRIPTION_TIERS.find(
    (tier) => monthlyEmissions >= tier.emissions_min && monthlyEmissions < tier.emissions_max
  ) || SUBSCRIPTION_TIERS[SUBSCRIPTION_TIERS.length - 1];
}

// Helper to get subscription status display text
export function getSubscriptionStatusDisplay(status: SubscriptionStatus): {
  text: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
} {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return { text: 'Active', variant: 'default' };
    case SubscriptionStatus.TRIALING:
      return { text: 'Trial', variant: 'secondary' };
    case SubscriptionStatus.CANCELED:
      return { text: 'Canceled', variant: 'outline' };
    case SubscriptionStatus.PAST_DUE:
      return { text: 'Past Due', variant: 'destructive' };
    case SubscriptionStatus.UNPAID:
      return { text: 'Unpaid', variant: 'destructive' };
    default:
      return { text: 'Incomplete', variant: 'outline' };
  }
}

// Helper to format next billing date
export function formatBillingDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
