// Empty cart state component

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start offsetting your carbon footprint by adding carbon credits to your cart.
      </p>
      <Button asChild>
        <Link to="/shop">Browse Products</Link>
      </Button>
    </div>
  );
}
