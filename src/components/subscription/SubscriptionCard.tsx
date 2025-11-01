// Subscription card component displaying current subscription

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Subscription, getSubscriptionStatusDisplay, formatBillingDate } from '@/types/subscription';
import { formatPrice } from '@/types/product';
import { Calendar, CreditCard, Leaf, AlertCircle } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  onManage: () => void;
  loading?: boolean;
}

export function SubscriptionCard({ subscription, onManage, loading = false }: SubscriptionCardProps) {
  const statusInfo = getSubscriptionStatusDisplay(subscription.status);
  const price = subscription.items[0]?.price;
  const monthlyAmount = price?.unit_amount || 0;
  const nextBillingDate = formatBillingDate(subscription.current_period_end);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Carbon Credit Subscription</CardTitle>
            <CardDescription>Monthly carbon offset subscription</CardDescription>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Monthly Cost</p>
          <p className="text-3xl font-bold">{formatPrice(monthlyAmount)}</p>
          <p className="text-xs text-muted-foreground">per month</p>
        </div>

        <Separator />

        {/* Subscription Details */}
        <div className="space-y-3">
          {/* Next Billing Date */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {subscription.cancel_at_period_end ? 'Ends on' : 'Next billing date'}
              </p>
              <p className="text-sm text-muted-foreground">{nextBillingDate}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Payment Method</p>
              <p className="text-sm text-muted-foreground">On file with Stripe</p>
            </div>
          </div>

          {/* CO2 Offset */}
          {subscription.metadata?.co2_offset && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Monthly Impact</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.metadata.co2_offset} tons CO₂ offset
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cancellation Notice */}
        {subscription.cancel_at_period_end && (
          <>
            <Separator />
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-yellow-900 dark:text-yellow-100">
                  Subscription Ending
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Your subscription will end on {nextBillingDate}. You can reactivate anytime before then.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={onManage} variant="outline" className="w-full" disabled={loading}>
          Manage Subscription
        </Button>
      </CardFooter>
    </Card>
  );
}
