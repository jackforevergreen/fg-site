// Price display component for products

import { Price, formatPrice, getPriceDisplayText } from '@/types/product';

interface PriceDisplayProps {
  price: Price;
  className?: string;
}

export function PriceDisplay({ price, className = '' }: PriceDisplayProps) {
  return (
    <div className={`font-semibold ${className}`}>
      <span className="text-2xl">{getPriceDisplayText(price)}</span>
    </div>
  );
}

interface MultiplePricesDisplayProps {
  prices: Price[];
  className?: string;
}

export function MultiplePricesDisplay({ prices, className = '' }: MultiplePricesDisplayProps) {
  if (prices.length === 0) {
    return <div className={className}>Price not available</div>;
  }

  if (prices.length === 1) {
    return <PriceDisplay price={prices[0]} className={className} />;
  }

  // Find the lowest price
  const lowestPrice = prices.reduce((min, price) =>
    price.unit_amount < min.unit_amount ? price : min
  );

  return (
    <div className={className}>
      <span className="text-sm text-muted-foreground">From </span>
      <PriceDisplay price={lowestPrice} />
    </div>
  );
}
