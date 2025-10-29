// Subscription tier card component

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionTier } from '@/types/subscription';
import { formatPrice } from '@/types/product';
import { Leaf, Star, Zap, Check } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const isRecommended = tier.recommended;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <motion.div
        animate={isRecommendedForUser ? {
          boxShadow: [
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '0 0 25px 2px rgba(34, 197, 94, 0.4)',
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          ],
        } : {}}
        transition={{
          duration: 2,
          repeat: isRecommendedForUser ? Infinity : 0,
          repeatType: 'reverse',
        }}
      >
        <Card
          className={`h-full flex flex-col relative shadow-md hover:shadow-xl transition-all duration-300 ${
            isRecommendedForUser
              ? 'ring-2 ring-green-600 border-green-600 bg-gradient-to-br from-green-50/50 to-white'
              : ''
          } ${isSubscribed ? 'bg-muted/50' : ''}`}
        >
          {/* Recommended for User Badge - Top Priority */}
          {isRecommendedForUser && (
            <div className="absolute -top-4 left-1/3 transform -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-br from-green-600 to-green-400 text-white px-4 py-1.5 shadow-lg border-2 border-green-600">
                <Star className="h-4 w-4 mr-1.5 inline" />
                Recommended for {isAuthenticated ? 'Your' : 'the Average'} Footprint
              </Badge>
            </div>
          )}

        <CardHeader className="text-center pb-4">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md ${
              isRecommendedForUser
                ? 'bg-gradient-to-br from-green-600 to-green-400'
                : 'bg-green-600/10'
            }`}
          >
            {isRecommendedForUser ? (
              <Zap className="h-8 w-8 text-white" />
            ) : (
              <Leaf className="h-8 w-8 text-green-600" />
            )}
          </div>

          <CardTitle className="text-xl">{tier.name}</CardTitle>
          <CardDescription>
            For {tier.emissions_min}{tier.emissions_max === Infinity ? '+' : `-${tier.emissions_max}`} tons CO₂/month
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
              <Check className="h-4 w-4 text-green-600" />
              <span>Offsets {tier.co2_offset} ton{tier.co2_offset > 1 ? 's' : ''} CO₂/month</span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => onSubscribe(tier)}
            disabled={loading || isSubscribed || !tier.price_id}
            className={`text-lg w-full rounded-full font-bold shadow-md hover:shadow-lg transition-all ${
              isRecommendedForUser
                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white border-0'
                : 'bg-white border-2 border-green-600 text-green-600 hover:bg-green-50'
            }`}
            size="lg"
          >
            {isSubscribed ? 'Current Plan' : tier.price_id ? 'Subscribe' : 'Coming Soon'}
          </Button>
        </CardFooter>
      </Card>
      </motion.div>
    </motion.div>
  );
}
