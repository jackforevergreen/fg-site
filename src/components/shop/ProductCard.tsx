// Product card component for displaying carbon credit products

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, PriceType, getProjectTypeDisplayName } from '@/types/product';
import { PriceDisplay } from './PriceDisplay';
import { Leaf, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, priceId: string) => void;
  isInCart?: boolean;
  loading?: boolean;
}

export function ProductCard({ product, onAddToCart, isInCart = false, loading = false }: ProductCardProps) {
  // Get the primary price (one-time or first recurring)
  const primaryPrice = product.prices?.find(p => p.type === PriceType.ONE_TIME) || product.prices?.[0];

  if (!primaryPrice) {
    return null;
  }

  const projectType = product.metadata.project_type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader>
          {/* Product Image */}
          {product.images && product.images.length > 0 ? (
            <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 mb-4 rounded-lg bg-gradient-to-br from-primary/10 to-green-100 flex items-center justify-center">
              <Leaf className="h-16 w-16 text-primary" />
            </div>
          )}

          {/* Project Type Badge */}
          {projectType && (
            <Badge variant="secondary" className="w-fit mb-2">
              {getProjectTypeDisplayName(projectType)}
            </Badge>
          )}

          <CardTitle className="line-clamp-2">{product.name}</CardTitle>
          <CardDescription className="line-clamp-3">{product.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="space-y-2">
            {/* CO2 Offset Information */}
            {product.metadata.co2_offset_per_unit && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="h-4 w-4 text-green-600" />
                <span>
                  Offsets {product.metadata.co2_offset_per_unit} ton{product.metadata.co2_offset_per_unit > 1 ? 's' : ''} CO₂
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {/* Price */}
          <div className="w-full flex items-center justify-between">
            <PriceDisplay price={primaryPrice} />
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={() => onAddToCart(product, primaryPrice.id)}
            disabled={loading || isInCart}
            className="w-full"
            size="lg"
          >
            {isInCart ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                In Cart
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
