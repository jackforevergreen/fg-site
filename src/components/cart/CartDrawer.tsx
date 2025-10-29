// Cart drawer component (sliding sidebar)

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart } from 'lucide-react';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { EmptyCart } from './EmptyCart';
import { useCart, useIncrementQuantity, useDecrementQuantity, useRemoveFromCart } from '@/hooks/useCart';
import { useCreateCheckout } from '@/hooks/useCheckout';
import { useState } from 'react';
import { toast } from 'sonner';

interface CartDrawerProps {
  trigger?: React.ReactNode;
}

export function CartDrawer({ trigger }: CartDrawerProps) {
  const [open, setOpen] = useState(false);
  const { data: cartItems = [], isLoading } = useCart();
  const incrementMutation = useIncrementQuantity();
  const decrementMutation = useDecrementQuantity();
  const removeMutation = useRemoveFromCart();
  const checkoutMutation = useCreateCheckout();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      await checkoutMutation.mutateAsync({ cartItems });
      // Checkout mutation will redirect to Stripe
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            size="lg"
            className="relative w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all border-0 p-0"
          >
            <ShoppingCart />
            {cartCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center p-0 text-sm font-bold bg-red-500 text-white border-2 border-white shadow-md"
              >
                {cartCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {cartCount > 0
              ? `You have ${cartCount} item${cartCount !== 1 ? 's' : ''} in your cart`
              : 'Your cart is empty'}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyCart onClose={() => setOpen(false)} />
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-1">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrement={(id) => incrementMutation.mutate(id)}
                    onDecrement={(id) => decrementMutation.mutate(id)}
                    onRemove={(id) => removeMutation.mutate(id)}
                    loading={
                      incrementMutation.isPending ||
                      decrementMutation.isPending ||
                      removeMutation.isPending
                    }
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Cart Summary */}
            <div className="border-t pt-4 mt-4">
              <CartSummary
                items={cartItems}
                onCheckout={handleCheckout}
                loading={checkoutMutation.isPending}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
