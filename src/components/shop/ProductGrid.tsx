// Product grid component with filtering

import { useState } from 'react';
import { Product, PriceType } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, priceId: string, quantity: number) => void;
  cartItems?: string[]; // Array of product IDs in cart
  loading?: boolean;
}

export function ProductGrid({ products, onAddToCart, cartItems = [], loading = false }: ProductGridProps) {
  const [filter, setFilter] = useState<'all' | 'one-time' | 'subscription'>('all');

  // Filter products based on selected tab
  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;

    if (filter === 'one-time') {
      return product.prices?.some((price) => price.type === PriceType.ONE_TIME);
    }

    if (filter === 'subscription') {
      return product.prices?.some((price) => price.type === PriceType.RECURRING);
    }

    return true;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Products Available</h3>
        <p className="text-muted-foreground max-w-md">
          Carbon credit products are being loaded. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="one-time">One-Time</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
