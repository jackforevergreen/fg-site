// Cart item component with quantity controls

import { CartItem as CartItemType, formatPrice } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  loading?: boolean;
}

export function CartItem({ item, onIncrement, onDecrement, onRemove, loading = false }: CartItemProps) {
  const subtotal = item.unitAmount * item.quantity;

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{item.name}</h4>
        <p className="text-sm text-muted-foreground">
          {formatPrice(item.unitAmount)}
          {item.type === 'recurring' && item.recurring && ` / ${item.recurring.interval}`}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-green-600 text-green-600 hover:bg-green-50 transition-all"
          onClick={() => onDecrement(item.id)}
          disabled={loading || item.quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="w-8 text-center font-bold">{item.quantity}</span>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-green-600 text-green-600 hover:bg-green-50 transition-all"
          onClick={() => onIncrement(item.id)}
          disabled={loading}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Subtotal */}
      <div className="w-24 text-right font-bold">
        {formatPrice(subtotal)}
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
        onClick={() => onRemove(item.id)}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
