// Full cart page

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { useCart, useIncrementQuantity, useDecrementQuantity, useRemoveFromCart } from '@/hooks/useCart';
import { useCreateCheckout } from '@/hooks/useCheckout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Cart = () => {
  const { user, isAuthenticated } = useAuth();
  const { data: cartItems = [], isLoading } = useCart();
  const incrementMutation = useIncrementQuantity();
  const decrementMutation = useDecrementQuantity();
  const removeMutation = useRemoveFromCart();
  const checkoutMutation = useCreateCheckout();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to checkout');
      return;
    }

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Page Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {/* Sign-in prompt */}
          {!isAuthenticated ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Sign in to view your cart</h3>
              <p className="text-muted-foreground mb-4">
                You need to be signed in to add items to your cart and make purchases.
              </p>
              <Button asChild>
                <Link to="/profile">Sign In</Link>
              </Button>
            </Card>
          ) : isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <Card className="p-8">
              <EmptyCart />
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
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
                </Card>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <Card className="p-6">
                    <CartSummary
                      items={cartItems}
                      onCheckout={handleCheckout}
                      loading={checkoutMutation.isPending}
                    />
                  </Card>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
