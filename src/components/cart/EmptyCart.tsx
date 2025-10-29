// Empty cart state component

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyCartProps {
  onClose?: () => void;
}

export function EmptyCart({ onClose }: EmptyCartProps) {
  const navigate = useNavigate();

  const handleBrowseClick = () => {
    if (onClose) {
      onClose();
    }
    navigate('/shop');
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mb-4 shadow-md">
        <ShoppingCart className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start offsetting your carbon footprint by adding carbon credits to your cart.
      </p>
      <Button
        onClick={handleBrowseClick}
        className="rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
      >
        Browse Products
      </Button>
    </div>
  );
}
