// Subscription tier card component - wrapper around shared TierCard

import { SubscriptionTier } from '@/types/subscription';
import { TierCard, TierCardConfig } from './TierCard';

interface SubscriptionTierCardProps {
  tier: SubscriptionTier;
  onSubscribe: (tier: SubscriptionTier) => void;
  isSubscribed?: boolean;
  isRecommendedForUser?: boolean;
  loading?: boolean;
  isAuthenticated?: boolean;
}

export function SubscriptionTierCard({
  tier,
  onSubscribe,
  isSubscribed = false,
  isRecommendedForUser = false,
  loading = false,
  isAuthenticated = false,
}: SubscriptionTierCardProps) {
  const config: TierCardConfig = {
    id: tier.id,
    name: tier.name,
    description: `For ${tier.emissions_min}${tier.emissions_max === Infinity ? '+' : `-${tier.emissions_max}`} tons CO₂/month`,
    price: tier.monthly_price,
    priceLabel: 'per month',
    features: [
      `Offsets ${tier.co2_offset} ton${tier.co2_offset > 1 ? 's' : ''} CO₂/month`,
    ],
    ctaText: isSubscribed ? 'Current Plan' : tier.price_id ? 'Subscribe' : 'Coming Soon',
    disabled: loading || isSubscribed || !tier.price_id,
    isRecommended: isRecommendedForUser,
    showDiscount: false,
  };

  return (
    <TierCard
      config={config}
      onSelect={() => onSubscribe(tier)}
      loading={loading}
      isAuthenticated={isAuthenticated}
    />
  );
}
