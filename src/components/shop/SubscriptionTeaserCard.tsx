// Subscription teaser card for "All Products" view

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Leaf, Zap, ArrowRight } from 'lucide-react';

interface SubscriptionTeaserCardProps {
  onViewSubscriptions: () => void;
  tierCount: number;
}

export function SubscriptionTeaserCard({ onViewSubscriptions, tierCount }: SubscriptionTeaserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className="col-span-full"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 border-2 border-green-300 shadow-lg hover:shadow-xl transition-all">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-300/20 to-transparent rounded-full blur-3xl" />

        <div className="relative">
          <CardHeader className="text-center pb-4">
            {/* Badge */}
            <div className="flex justify-center mb-3">
              <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-1.5 text-sm font-semibold shadow-md">
                <Sparkles className="h-3 w-3 mr-1.5 inline" />
                Monthly Subscriptions Available
              </Badge>
            </div>

            {/* Icons */}
            <div className="flex justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600/20 to-green-500/10 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600/20 to-green-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
              Automate Your Carbon Offsetting
            </CardTitle>
            <CardDescription className="text-base text-gray-700 max-w-2xl mx-auto">
              Set up a monthly subscription to automatically offset your carbon footprint.
              Choose from {tierCount} tier{tierCount !== 1 ? 's' : ''} tailored to different emission levels.
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-4">
              <div className="flex items-center gap-2 text-sm text-green-800 bg-white/60 rounded-lg p-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Automatic Monthly Offsets</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800 bg-white/60 rounded-lg p-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Verified Carbon Credits</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800 bg-white/60 rounded-lg p-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Impact Reports</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <Button
              onClick={onViewSubscriptions}
              size="lg"
              className="rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold shadow-md hover:shadow-lg transition-all px-8"
            >
              View All Subscription Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
