// Shop page - Carbon credit marketplace

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { SubscriptionTierCard } from '@/components/shop/SubscriptionTierCard';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useProducts, useSubscriptionTiers } from '@/hooks/useProducts';
import { useCart, useAddToCart, useCartCount } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Product, PriceType, ProductType, ProjectType } from '@/types/product';
import { SubscriptionTier } from '@/types/subscription';
import { toast } from 'sonner';

const Shop = () => {
  const { user, isAuthenticated } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: cartItems = [] } = useCart();
  const addToCartMutation = useAddToCart();
  const cartCount = useCartCount();

  // Get monthly emissions from sessionStorage (from carbon calculator)
  const [monthlyEmissions, setMonthlyEmissions] = useState<number | undefined>();

  useEffect(() => {
    const stored = sessionStorage.getItem('monthlyEmissions');
    if (stored) {
      setMonthlyEmissions(parseFloat(stored));
    }
  }, []);

  const { data: subscriptionTiers = [], isLoading: tiersLoading } = useSubscriptionTiers(monthlyEmissions);

  // Get cart product IDs for "In Cart" check
  const cartProductIds = cartItems.map((item) => item.productId);

  const handleAddToCart = async (product: Product, priceId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    const price = product.prices?.find((p) => p.id === priceId);
    if (!price) {
      toast.error('Price not found');
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        priceId: price.id,
        name: product.name,
        productType: product.metadata.product_type,
        projectType: product.metadata.project_type,
        quantity: 1,
        unitAmount: price.unit_amount,
        type: price.type,
        recurring: price.recurring,
      });

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe');
      return;
    }

    if (!tier.price_id) {
      toast.error('This subscription tier is not available yet');
      return;
    }

    // Find the product with this price
    const subscriptionProduct = products.find((p) =>
      p.prices?.some((price) => price.id === tier.price_id)
    );

    if (!subscriptionProduct) {
      toast.error('Subscription product not found');
      return;
    }

    await handleAddToCart(subscriptionProduct, tier.price_id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button and cart */}
      <div className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Cart Drawer */}
          {isAuthenticated && <CartDrawer />}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              Now Live!
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Carbon Credits <span className="text-primary">Shop</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              Offset your carbon footprint with verified carbon credits. Choose one-time purchases or monthly subscriptions.
            </motion.p>
          </div>

          {/* Products and Subscriptions Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="products">Carbon Credits</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products">
                <ProductGrid
                  products={products}
                  onAddToCart={handleAddToCart}
                  cartItems={cartProductIds}
                  loading={productsLoading}
                />
              </TabsContent>

              {/* Subscriptions Tab */}
              <TabsContent value="subscriptions">
                {monthlyEmissions && (
                  <div className="mb-6 p-4 bg-primary/10 rounded-lg text-center">
                    <p className="text-sm text-primary font-medium">
                      Based on your carbon footprint of {monthlyEmissions.toFixed(2)} tons/month, we recommend:
                    </p>
                  </div>
                )}

                {tiersLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading subscription tiers...</p>
                  </div>
                ) : subscriptionTiers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Subscription tiers are being configured. Please check back soon.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subscriptionTiers.map((tier) => (
                      <SubscriptionTierCard
                        key={tier.id}
                        tier={tier}
                        onSubscribe={handleSubscribe}
                        loading={addToCartMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Sign-in prompt for non-authenticated users */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 p-6 bg-muted/50 rounded-lg text-center"
            >
              <p className="text-muted-foreground mb-4">
                Sign in to add products to your cart and complete your purchase.
              </p>
              <Button asChild>
                <Link to="/profile">Sign In</Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Shop;
