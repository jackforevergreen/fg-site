// Subscriptions management page

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { CancelDialog } from '@/components/subscription/CancelDialog';
import { useSubscription, useCancelSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { formatBillingDate } from '@/types/subscription';

const Subscriptions = () => {
  const { user, isAuthenticated } = useAuth();
  const { data: subscription, isLoading } = useSubscription();
  const cancelMutation = useCancelSubscription();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleManageSubscription = () => {
    // Open cancel dialog
    setCancelDialogOpen(true);
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      await cancelMutation.mutateAsync(subscription.id);
      setCancelDialogOpen(false);
    } catch (error) {
      console.error('Cancel subscription error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          to="/carboncredits"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Page Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Subscriptions</h1>
              <p className="text-muted-foreground">
                Manage your carbon credit subscriptions
              </p>
            </div>
          </div>

          {/* Sign-in prompt */}
          {!isAuthenticated ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Sign in to view subscriptions</h3>
              <p className="text-muted-foreground mb-4">
                You need to be signed in to view and manage your subscriptions.
              </p>
              <Button asChild>
                <Link to="/profile">Sign In</Link>
              </Button>
            </Card>
          ) : isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading subscription...</p>
            </div>
          ) : subscription ? (
            <div className="space-y-6">
              {/* Active Subscription */}
              <SubscriptionCard
                subscription={subscription}
                onManage={handleManageSubscription}
                loading={cancelMutation.isPending}
              />
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
              <p className="text-muted-foreground mb-6">
                Start offsetting your carbon footprint with a monthly subscription.
              </p>
              <Button asChild>
                <Link to="/carboncredits">
                  <Plus className="mr-2 h-4 w-4" />
                  Browse Subscriptions
                </Link>
              </Button>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Cancel Dialog */}
      <CancelDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelSubscription}
        loading={cancelMutation.isPending}
        nextBillingDate={subscription ? formatBillingDate(subscription.current_period_end) : undefined}
      />
    </div>
  );
};

export default Subscriptions;
