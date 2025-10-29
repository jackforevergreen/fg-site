// Yearly offset types for carbon credit one-time purchases

export interface YearlyOffsetTier {
  id: string;
  credits: number; // Number of carbon credits (tons CO2)
  emissions_max: number; // Maximum yearly emissions this tier covers
  price_id: string;
  original_price: number; // Regular price in cents ($10/credit)
  discounted_price: number; // Discounted price in cents ($8/credit)
  recommended?: boolean;
}

// Pricing constants
export const DISCOUNT_PERCENTAGE = 20;
export const REGULAR_RATE = 1000; // $10.00 per credit in cents
export const DISCOUNTED_RATE = 800; // $8.00 per credit in cents

// Predefined yearly offset tiers
export const YEARLY_OFFSET_TIERS: YearlyOffsetTier[] = [
  {
    id: 'yearly-12',
    credits: 12,
    emissions_max: 12,
    price_id: '', // Will be populated from Firestore
    original_price: 12 * REGULAR_RATE, // $120.00
    discounted_price: 12 * DISCOUNTED_RATE, // $96.00
  },
  {
    id: 'yearly-24',
    credits: 24,
    emissions_max: 24,
    price_id: '',
    original_price: 24 * REGULAR_RATE, // $240.00
    discounted_price: 24 * DISCOUNTED_RATE, // $192.00
  },
  {
    id: 'yearly-36',
    credits: 36,
    emissions_max: 36,
    price_id: '',
    original_price: 36 * REGULAR_RATE, // $360.00
    discounted_price: 36 * DISCOUNTED_RATE, // $288.00
  },
  {
    id: 'yearly-48',
    credits: 48,
    emissions_max: 48,
    price_id: '',
    original_price: 48 * REGULAR_RATE, // $480.00
    discounted_price: 48 * DISCOUNTED_RATE, // $384.00
  },
  {
    id: 'yearly-60',
    credits: 60,
    emissions_max: 60,
    price_id: '',
    original_price: 60 * REGULAR_RATE, // $600.00
    discounted_price: 60 * DISCOUNTED_RATE, // $480.00
  },
];

// Helper to determine recommended yearly tier based on emissions
export function getRecommendedYearlyTier(yearlyEmissions: number): YearlyOffsetTier | null {
  // Find the tier that covers the user's emissions with smallest credits
  const matchingTier = YEARLY_OFFSET_TIERS.find(
    (tier) => yearlyEmissions <= tier.emissions_max
  );

  // If emissions exceed all tiers, return the highest tier
  return matchingTier || YEARLY_OFFSET_TIERS[YEARLY_OFFSET_TIERS.length - 1];
}

// Helper to calculate savings
export function calculateSavings(tier: YearlyOffsetTier): number {
  return tier.original_price - tier.discounted_price;
}

// Helper to format savings message
export function getSavingsMessage(tier: YearlyOffsetTier): string {
  const savings = calculateSavings(tier);
  return `Save $${(savings / 100).toFixed(2)} (${DISCOUNT_PERCENTAGE}% off)`;
}
