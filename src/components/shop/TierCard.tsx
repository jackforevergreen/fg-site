// Reusable tier card component for both subscription and yearly offset tiers

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/types/product';
import { Leaf, Star, Zap, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TierCardConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For showing discounts
  priceLabel: string; // e.g., "per month" or "one-time"
  features: string[];
  ctaText: string;
  disabled?: boolean;
  isRecommended?: boolean;
  showDiscount?: boolean;
}

interface TierCardProps {
  config: TierCardConfig;
  onSelect: () => void;
  loading?: boolean;
  isAuthenticated?: boolean;
}

export function TierCard({
  config,
  onSelect,
  loading = false,
  isAuthenticated = false,
}: TierCardProps) {
  const {
    name,
    description,
    price,
    originalPrice,
    priceLabel,
    features,
    ctaText,
    disabled = false,
    isRecommended = false,
    showDiscount = false,
  } = config;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <motion.div
        animate={isRecommended ? {
          boxShadow: [
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '0 0 25px 2px rgba(34, 197, 94, 0.4)',
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          ],
        } : {}}
        transition={{
          duration: 2,
          repeat: isRecommended ? Infinity : 0,
          repeatType: 'reverse',
        }}
      >
        <Card
          className={`h-full flex flex-col relative shadow-md hover:shadow-xl transition-all duration-300 ${
            isRecommended
              ? 'ring-2 ring-green-600 border-green-600 bg-gradient-to-br from-green-50/50 to-white'
              : ''
          } ${disabled ? 'bg-muted/50' : ''}`}
        >
          {/* Recommended Badge */}
          {isRecommended && (
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-br from-green-600 to-green-400 text-white px-4 py-1.5 shadow-lg border-2 border-green-600">
                <Star className="h-4 w-4 mr-1.5 inline" />
                Recommended for {isAuthenticated ? 'Your' : 'the Average'} Footprint
              </Badge>
            </div>
          )}

          <CardHeader className="text-center pb-4">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 mt-2 shadow-md ${
                isRecommended
                  ? 'bg-gradient-to-br from-green-600 to-green-400'
                  : 'bg-green-600/10'
              }`}
            >
              {isRecommended ? (
                <Zap className="h-8 w-8 text-white" />
              ) : (
                <Leaf className="h-8 w-8 text-green-600" />
              )}
            </div>

            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 text-center space-y-4">
            {/* Price */}
            <div>
              {showDiscount && originalPrice && (
                <div className="text-lg text-muted-foreground line-through mb-1">
                  {formatPrice(originalPrice)}
                </div>
              )}
              <div className="text-4xl font-bold">
                {formatPrice(price)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{priceLabel}</p>
            </div>

            {/* Features */}
            <div className="space-y-2 text-sm">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={onSelect}
              disabled={loading || disabled}
              className={`text-lg w-full rounded-full font-bold shadow-md hover:shadow-lg transition-all ${
                isRecommended
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white border-0'
                  : 'bg-white border-2 border-green-600 text-green-600 hover:bg-green-50'
              }`}
              size="lg"
            >
              {ctaText}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
