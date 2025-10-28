// Cart summary component showing totals

import { CartItem, formatPrice, calculateCartTotal } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Leaf } from 'lucide-react';

interface CartSummaryProps {
  items: CartItem[];
  onCheckout: () => void;
  loading?: boolean;
}

export function CartSummary({ items, onCheckout, loading = false }: CartSummaryProps) {
  const subtotal = calculateCartTotal(items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate total CO2 offset (if metadata is available)
  const totalCO2Offset = items.reduce((total, item) => {
    // This would ideally come from product metadata
    // For now, we'll estimate based on price (placeholder logic)
    return total + item.quantity;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Order Summary</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <ShoppingCart className="h-4 w-4" />
          <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <Separator />

      {/* Price Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Environmental Impact */}
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <Leaf className="h-4 w-4 text-green-600" />
          <div className="flex-1 text-sm">
            <p className="font-medium text-green-900 dark:text-green-100">
              Environmental Impact
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              ~{totalCO2Offset} ton{totalCO2Offset !== 1 ? 's' : ''} CO₂ offset
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-between items-baseline">
        <span className="font-semibold text-lg">Total</span>
        <span className="font-bold text-2xl">{formatPrice(subtotal)}</span>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        disabled={loading || items.length === 0}
        size="lg"
        className="w-full"
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </Button>

      {/* Security Note */}
      <p className="text-xs text-center text-muted-foreground">
        Secure checkout powered by Stripe
      </p>
    </div>
  );
}
