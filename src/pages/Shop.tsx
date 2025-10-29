// Shop page - Carbon credit marketplace

import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/shop/ProductCard";
import { SubscriptionTierCard } from "@/components/shop/SubscriptionTierCard";
import {
  AnimatedCartButton,
  AnimatedCartButtonHandle,
} from "@/components/cart/AnimatedCartButton";
import Navigation from "@/components/Navigation";
import { useProducts, useSubscriptionTiers } from "@/hooks/useProducts";
import { useCart, useAddToCart, useCartCount } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Product, PriceType } from "@/types/product";
import { SubscriptionTier } from "@/types/subscription";
import { toast } from "sonner";
import { fetchEmissionsData } from "@/api/emissions";
import { EmissionsDocument } from "@/types/emissions";

const Shop = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: cartItems = [] } = useCart();
  const addToCartMutation = useAddToCart();
  const cartCount = useCartCount();
  const [activeTab, setActiveTab] = useState<"one-time" | "subscription">(
    "one-time"
  );
  const cartButtonRef = useRef<AnimatedCartButtonHandle>(null);
  const [emissionsData, setEmissionsData] = useState<EmissionsDocument | null>(
    null
  );

  // Get monthly emissions from sessionStorage (from carbon calculator)
  const [monthlyEmissions, setMonthlyEmissions] = useState<
    number | undefined
  >();

  useEffect(() => {
    if (!isAuthenticated) {
      setMonthlyEmissions(2); // Default value for non-authenticated users
      return;
    }

    const fetchAndSetEmissions = async () => {
      // Fetch user's current month emissions data
      try {
        const data = await fetchEmissionsData();
        setEmissionsData(data);

        if (data?.totalEmissions) {
          const monthlyValue = data.totalEmissions / 12;
          setMonthlyEmissions(monthlyValue);
        } else {
          console.log("No emissions data found in database");
        }
      } catch (error) {
        console.error("Error fetching emissions data:", error);
      }
    };

    fetchAndSetEmissions();
  }, [isAuthenticated, navigate]);

  const { data: subscriptionTiers = [], isLoading: tiersLoading } =
    useSubscriptionTiers(monthlyEmissions);

  // Filter products based on active tab
  const filteredProducts = products.filter((product) => {
    if (activeTab === "one-time") {
      return product.prices?.some((price) => price.type === PriceType.ONE_TIME);
    }
    if (activeTab === "subscription") {
      return product.prices?.some(
        (price) => price.type === PriceType.RECURRING
      );
    }
    return true;
  });

  // Calculate recommended subscription based on user's CO2 footprint
  const recommendedTierId = useMemo(() => {
    if (!monthlyEmissions || subscriptionTiers.length === 0) {
      return null;
    }

    // Sort tiers by emissions_min to ensure we check in order
    const sortedTiers = [...subscriptionTiers].sort(
      (a, b) => a.emissions_min - b.emissions_min
    );

    for (const tier of sortedTiers) {
      const minCheck = monthlyEmissions >= tier.emissions_min;
      const maxCheck =
        tier.emissions_max === Infinity ||
        monthlyEmissions <= tier.emissions_max;
      const inRange = minCheck && maxCheck;

      if (inRange) {
        return tier.id;
      }
    }

    return null;
  }, [monthlyEmissions, subscriptionTiers]);

  const handleAddToCart = async (
    product: Product,
    priceId: string,
    quantity: number = 1
  ) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    const price = product.prices?.find((p) => p.id === priceId);
    if (!price) {
      toast.error("Price not found");
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        priceId: price.id,
        name: product.name,
        productType: product.metadata.product_type,
        projectType: product.metadata.project_type,
        quantity: quantity,
        unitAmount: price.unit_amount,
        type: price.type,
        recurring: price.recurring,
      });

      toast.success(
        `${quantity > 1 ? `${quantity}x ` : ""}${product.name} added to cart!`
      );

      // Trigger cart button animation
      if (cartButtonRef.current) {
        cartButtonRef.current.scrollIntoView();
        cartButtonRef.current.flash();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to subscribe");
      return;
    }

    if (!tier.price_id) {
      toast.error("This subscription tier is not available yet");
      return;
    }

    // Find the product with this price
    const subscriptionProduct = products.find((p) =>
      p.prices?.some((price) => price.id === tier.price_id)
    );

    if (!subscriptionProduct) {
      toast.error("Subscription product not found");
      return;
    }

    await handleAddToCart(subscriptionProduct, tier.price_id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Animated Cart Button - Fixed position */}
      {isAuthenticated && <AnimatedCartButton ref={cartButtonRef} />}

      {/* Main content */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Carbon Credits{" "}
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                Shop
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              Offset your carbon footprint with verified carbon credits. Choose
              one-time purchases or monthly subscriptions.
            </motion.p>
          </div>

          {/* Product Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as any)}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-xl mx-auto grid-cols-2 h-12 bg-white/95 backdrop-blur-sm shadow-md">
                <TabsTrigger
                  value="one-time"
                  className="text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                  One-Time Purchase
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className="text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                  Monthly Subscription
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Products Display */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Show subscription recommendation if applicable */}
            {activeTab === "subscription" && monthlyEmissions && (
              <div className="mb-6 p-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg text-center">
                <p className="text-md text-green-700 font-italic">
                  Based on {isAuthenticated ? "your" : "the average"} carbon
                  footprint of {monthlyEmissions.toFixed(2)} tons/month, we
                  recommend:
                </p>
              </div>
            )}

            {/* Products or Subscriptions based on active tab */}
            {activeTab === "subscription" ? (
              tiersLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Loading subscription tiers...
                  </p>
                </div>
              ) : subscriptionTiers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Subscription tiers are being configured. Please check back
                    soon.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscriptionTiers.map((tier) => (
                    <SubscriptionTierCard
                      key={tier.id}
                      tier={tier}
                      onSubscribe={handleSubscribe}
                      isRecommendedForUser={tier.id === recommendedTierId}
                      loading={addToCartMutation.isPending}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    loading={addToCartMutation.isPending}
                  />
                ))}
              </div>
            )}
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
