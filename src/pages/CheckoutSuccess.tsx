// Checkout success page

import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Leaf, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCheckoutSession } from '@/hooks/useCheckout';
import { useClearCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const clearCartMutation = useClearCart();

  const { data: sessionData, isLoading } = useCheckoutSession(sessionId || undefined);

  // Clear cart on successful purchase
  useEffect(() => {
    if (sessionData && user) {
      clearCartMutation.mutate();
    }
  }, [sessionData, user]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8 md:p-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </motion.div>
          </div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Thank You for Your Purchase!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your order has been confirmed and you're now contributing to a greener planet.
            </p>
          </motion.div>

          <Separator className="my-8" />

          {/* Environmental Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <Leaf className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                Environmental Impact
              </h3>
            </div>
            <p className="text-green-700 dark:text-green-300">
              You're making a positive impact on the environment! Your carbon credits are being processed and will be applied to verified offset projects.
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-4 mb-8"
          >
            <h3 className="font-semibold">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>You'll receive a confirmation email with your purchase details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Your carbon credits are being applied to verified environmental projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Track your environmental impact in your profile</span>
              </li>
              {sessionData?.mode === 'subscription' && (
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Manage your subscription anytime from your account</span>
                </li>
              )}
            </ul>
          </motion.div>

          <Separator className="my-8" />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {sessionData?.mode === 'subscription' ? (
              <Button asChild className="flex-1">
                <Link to="/subscriptions">
                  View Subscription
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="flex-1">
                <Link to="/profile">
                  View Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}

            <Button variant="outline" asChild className="flex-1">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          {/* Session ID (for reference) */}
          {sessionId && (
            <p className="text-xs text-center text-muted-foreground mt-6">
              Order reference: {sessionId.substring(0, 12)}...
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
