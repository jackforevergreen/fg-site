// Dialog for subscription cancellation confirmation

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';

interface CancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  nextBillingDate?: string;
}

export function CancelDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  nextBillingDate,
}: CancelDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-950 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              Are you sure you want to cancel your carbon credit subscription? This will stop your monthly carbon offset contributions.
            </p>

            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="font-medium text-foreground mb-1">What happens next:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• You'll keep your benefits until {nextBillingDate || 'the end of your billing period'}</li>
                <li>• No future charges will be made</li>
                <li>• You can reactivate anytime before {nextBillingDate || 'the period ends'}</li>
                <li>• Your carbon offset history will be preserved</li>
              </ul>
            </div>

            <p className="text-sm">
              You can always resubscribe later to continue offsetting your carbon footprint.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Keep Subscription</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Canceling...' : 'Cancel Subscription'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
