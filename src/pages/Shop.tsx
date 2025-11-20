// Shop page - Carbon credit marketplace

import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/shop/ProductCard";
import { SubscriptionTierCard } from "@/components/shop/SubscriptionTierCard";
import { TierCard, TierCardConfig } from "@/components/shop/TierCard";
import {
  AnimatedCartButton,
  AnimatedCartButtonHandle,
} from "@/components/cart/AnimatedCartButton";
import Navigation from "@/components/Navigation";
import LoginModal from "@/components/auth/LoginModal";
import { useProducts, useSubscriptionTiers, useYearlyOffsetTiers } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useEmissionsData } from "@/hooks/useEmissionsData";
import { Product, PriceType } from "@/types/product";
import { SubscriptionTier } from "@/types/subscription";
import { YearlyOffsetTier, DISCOUNT_PERCENTAGE, getSavingsMessage } from "@/types/yearlyOffset";
import { toast } from "sonner";

const Shop = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: products = [] } = useProducts();
  const addToCartMutation = useAddToCart();
  const [activeTab, setActiveTab] = useState<"one-time" | "subscription" | "yearly-offset">(
    "one-time"
  );
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const cartButtonRef = useRef<AnimatedCartButtonHandle>(null);

  // Fetch emissions data using shared hook
  const { yearlyEmissions, monthlyEmissions } = useEmissionsData({
    isAuthenticated,
    defaultYearlyEmissions: 24,
    defaultMonthlyEmissions: 2,
  });

  const { data: subscriptionTiers = [], isLoading: tiersLoading } =
    useSubscriptionTiers(monthlyEmissions);

  const { data: yearlyOffsetTiers = [], isLoading: yearlyTiersLoading } =
    useYearlyOffsetTiers(yearlyEmissions);

  // Get yearly offset price IDs to filter them out from one-time products
  const yearlyOffsetPriceIds = useMemo(() => {
    return new Set(yearlyOffsetTiers.map(tier => tier.price_id).filter(Boolean));
  }, [yearlyOffsetTiers]);

  // Filter products based on active tab
  const filteredProducts = products.filter((product) => {
    if (activeTab === "one-time") {
      // Show one-time products but exclude yearly offset products
      const hasOneTimePrice = product.prices?.some((price) => price.type === PriceType.ONE_TIME);
      const isYearlyOffset = product.prices?.some((price) => yearlyOffsetPriceIds.has(price.id));
      return hasOneTimePrice && !isYearlyOffset;
    }
    if (activeTab === "subscription") {
      return product.prices?.some(
        (price) => price.type === PriceType.RECURRING
      );
    }
    return true;
  });

  // Calculate recommended tier IDs
  const recommendedSubscriptionTierId = useMemo(() => {
    return subscriptionTiers.find((tier) => tier.recommended)?.id || null;
  }, [subscriptionTiers]);

  const recommendedYearlyTierId = useMemo(() => {
    return yearlyOffsetTiers.find((tier) => tier.recommended)?.id || null;
  }, [yearlyOffsetTiers]);

  // Maintain backward compatibility
  const recommendedTierId = recommendedSubscriptionTierId;

  const handleAddToCart = async (
    product: Product,
    priceId: string,
    quantity: number = 1
  ) => {
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
    // Require authentication for subscriptions
    if (!isAuthenticated) {
      toast.error("Please sign in to subscribe", {
        description: "Subscriptions require an account to manage billing and renewals",
        action: {
          label: "Sign In",
          onClick: () => setLoginModalOpen(true),
        },
      });
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

    // Verify the price matches the tier's monthly_price
    const price = subscriptionProduct.prices?.find((p) => p.id === tier.price_id);
    if (price && price.unit_amount !== tier.monthly_price) {
      console.warn(
        `Price mismatch for tier ${tier.name}: expected ${tier.monthly_price}, got ${price.unit_amount}`
      );
    }

    await handleAddToCart(subscriptionProduct, tier.price_id);
  };

  const handleAddYearlyOffset = async (tier: YearlyOffsetTier) => {
    if (!tier.price_id) {
      toast.error("This tier is not available yet");
      return;
    }

    // Find the product with this price
    const offsetProduct = products.find((p) =>
      p.prices?.some((price) => price.id === tier.price_id)
    );

    if (!offsetProduct) {
      toast.error("Product not found");
      return;
    }

    // Verify the price matches the tier's discounted_price
    const price = offsetProduct.prices?.find((p) => p.id === tier.price_id);
    if (price && price.unit_amount !== tier.discounted_price) {
      console.warn(
        `Price mismatch for tier ${tier.credits} credits: expected ${tier.discounted_price}, got ${price.unit_amount}`
      );
    }

    try {
      await addToCartMutation.mutateAsync({
        productId: offsetProduct.id,
        priceId: tier.price_id,
        name: `${tier.credits} Carbon Credits - Yearly Offset`,
        productType: offsetProduct.metadata.product_type,
        projectType: offsetProduct.metadata.project_type,
        quantity: 1,
        unitAmount: tier.discounted_price,
        type: price?.type || PriceType.ONE_TIME,
        recurring: price?.recurring,
      });

      toast.success(`${tier.credits} carbon credits added to cart!`);

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

  // Convert yearly offset tiers to TierCardConfig
  const yearlyTierCardConfigs: TierCardConfig[] = yearlyOffsetTiers.map((tier) => ({
    id: tier.id,
    name: `${tier.credits} Credits`,
    description: `For up to ${tier.emissions_max} tons CO₂/year`,
    price: tier.discounted_price,
    originalPrice: tier.original_price,
    priceLabel: "one-time payment",
    features: [
      `Offsets ${tier.credits} ton${tier.credits > 1 ? 's' : ''} CO₂/year`,
      "Distributed across 12 months",
      getSavingsMessage(tier),
    ],
    ctaText: tier.price_id ? "Add to Cart" : "Coming Soon",
    disabled: !tier.price_id || addToCartMutation.isPending,
    isRecommended: tier.id === recommendedYearlyTierId,
    showDiscount: true,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Animated Cart Button - Fixed position (for all users) */}
      <AnimatedCartButton ref={cartButtonRef} />

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
              <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-3 h-auto min-h-12 bg-white/95 backdrop-blur-sm shadow-md">
                <TabsTrigger
                  value="one-time"
                  className="text-xs sm:text-sm md:text-base font-semibold whitespace-normal py-2 px-1 sm:px-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                  One-Time Purchase
                </TabsTrigger>
                <TabsTrigger
                  value="yearly-offset"
                  className="text-xs sm:text-sm md:text-base font-semibold whitespace-normal py-2 px-1 sm:px-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                  Yearly Offset
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className="text-xs sm:text-sm md:text-base font-semibold whitespace-normal py-2 px-1 sm:px-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
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
            {/* Show yearly offset discount banner */}
            {activeTab === "yearly-offset" && (
              <div className="mb-6 p-6 bg-gradient-to-br from-yellow-400 via-green-500 to-blue-400 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  LIMITED TIME OFFER
                </h2>
                <p className="text-lg md:text-xl text-white/90">
                  Save {DISCOUNT_PERCENTAGE}% on yearly carbon offsets - One payment covers the whole year!
                </p>
              </div>
            )}

            {/* Show subscription recommendation if applicable */}
            {activeTab === "subscription" && monthlyEmissions && (
              <div className="mb-6 p-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg text-center">
                <p className="text-md text-green-700 font-italic">
                  Based on {isAuthenticated ? "your" : "the average"} carbon
                  footprint of <span className="font-bold">{monthlyEmissions.toFixed(1)} tons/month</span>, we
                  recommend:
                </p>
              </div>
            )}

            {/* Show yearly offset recommendation if applicable */}
            {activeTab === "yearly-offset" && yearlyEmissions && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg text-center">
                <p className="text-md text-green-700 font-italic">
                  Based on {isAuthenticated ? "your" : "the average"} yearly carbon footprint of{" "}
                  <span className="font-bold">{yearlyEmissions.toFixed(1)} tons</span>, we recommend:
                </p>
              </div>
            )}

            {/* Products, Yearly Offsets, or Subscriptions based on active tab */}
            {activeTab === "yearly-offset" ? (
              yearlyTiersLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Loading yearly offset options...
                  </p>
                </div>
              ) : yearlyOffsetTiers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Yearly offset options are being configured. Please check back soon.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {yearlyTierCardConfigs.map((config, index) => (
                    <TierCard
                      key={config.id}
                      config={config}
                      onSelect={() => handleAddYearlyOffset(yearlyOffsetTiers[index])}
                      loading={addToCartMutation.isPending}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              )
            ) : activeTab === "subscription" ? (
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
              className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-green-50 border border-green-200 rounded-lg text-center"
            >
              <p className="text-gray-700 mb-2 font-semibold">
                Want to track your carbon offset journey?
              </p>
              <p className="text-muted-foreground mb-4">
                Sign in to save your purchases, track your impact, and access exclusive features. Or continue as a guest!
              </p>
              <Button
                onClick={() => setLoginModalOpen(true)}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 font-bold"
              >
                Sign In
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export default Shop;
