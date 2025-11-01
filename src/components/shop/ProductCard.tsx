// Product card component for displaying carbon credit products

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, PriceType, getProjectTypeDisplayName } from '@/types/product';
import { PriceDisplay } from './PriceDisplay';
import { getEnhancedDescription } from '@/lib/productDescriptions';
import { Leaf, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, priceId: string, quantity: number) => void;
  loading?: boolean;
}

export function ProductCard({ product, onAddToCart, loading = false }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  // Get the primary price (one-time or first recurring)
  const primaryPrice = product.prices?.find(p => p.type === PriceType.ONE_TIME) || product.prices?.[0];

  if (!primaryPrice) {
    return null;
  }

  const projectType = product.metadata.project_type;
  const enhancedDescription = getEnhancedDescription(
    product.description,
    projectType,
    product.name
  );

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className="h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-0">
          {/* Product Icon - Circular */}
          {product.images && product.images.length > 0 ? (
            <div className="w-32 h-32 mx-auto mb-2 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-600/20 to-green-500/10 flex items-center justify-center">
              <Leaf className="h-16 w-16 text-green-600" />
            </div>
          )}

          {/* Project Type Badge */}
          {projectType && (
            <Badge variant="secondary" className="w-fit mx-auto mb-2">
              {getProjectTypeDisplayName(projectType)}
            </Badge>
          )}

          <CardTitle className="line-clamp-2 text-center p-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-4 text-center">{enhancedDescription}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="space-y-2">
            {/* CO2 Offset Information */}
            {product.metadata.co2_offset_per_unit && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
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
          <div className="w-full flex items-center justify-center">
            <PriceDisplay price={primaryPrice} />
          </div>

          {/* Quantity Controls */}
          <div className="w-full flex items-center gap-3">
            <div className="flex items-center gap-2 border-2 border-green-600 rounded-full px-3 py-1 bg-white">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDecrement}
                disabled={loading || quantity <= 1}
                className="h-8 w-8 rounded-full hover:bg-green-50 text-green-600"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg w-8 text-center font-bold text-gray-900">{quantity}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleIncrement}
                disabled={loading}
                className="h-8 w-8 rounded-full hover:bg-green-50 text-green-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={() => onAddToCart(product, primaryPrice.id, quantity)}
              disabled={loading}
              className="text-lg flex-1 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              Add {quantity > 1 ? `${quantity} ` : ''}to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
