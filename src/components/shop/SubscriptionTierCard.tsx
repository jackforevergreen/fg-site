// Subscription tier card component

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionTier } from '@/types/subscription';
import { formatPrice } from '@/types/product';
import { Leaf, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionTierCardProps {
  tier: SubscriptionTier;
  onSubscribe: (tier: SubscriptionTier) => void;
  isSubscribed?: boolean;
  loading?: boolean;
}

export function SubscriptionTierCard({
  tier,
  onSubscribe,
  isSubscribed = false,
  loading = false,
}: SubscriptionTierCardProps) {
  const isRecommended = tier.recommended;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card
        className={`h-full flex flex-col relative ${
          isRecommended ? 'border-primary border-2 shadow-lg' : ''
        } ${isSubscribed ? 'bg-muted/50' : ''}`}
      >
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground px-3 py-1">
              <Star className="h-3 w-3 mr-1 inline" />
              Recommended
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-4">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              isRecommended
                ? 'bg-primary/20'
                : 'bg-muted'
            }`}
          >
            {isRecommended ? (
              <Zap className={`h-6 w-6 ${isRecommended ? 'text-primary' : 'text-muted-foreground'}`} />
            ) : (
              <Leaf className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <CardTitle className="text-xl">{tier.name}</CardTitle>
          <CardDescription>
            For {tier.emissions_min}-{tier.emissions_max === Infinity ? '+' : tier.emissions_max} tons CO₂/month
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 text-center space-y-4">
          {/* Price */}
          <div>
            <div className="text-4xl font-bold">
              {formatPrice(tier.monthly_price)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">per month</p>
          </div>

          {/* Features */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              <span>Offsets {tier.co2_offset} ton{tier.co2_offset > 1 ? 's' : ''} CO₂/month</span>
            </div>
            <p className="text-muted-foreground">
              Verified carbon credits
            </p>
            <p className="text-muted-foreground">
              Monthly impact reports
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => onSubscribe(tier)}
            disabled={loading || isSubscribed || !tier.price_id}
            className="w-full"
            size="lg"
            variant={isRecommended ? 'default' : 'outline'}
          >
            {isSubscribed ? 'Current Plan' : tier.price_id ? 'Subscribe' : 'Coming Soon'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
