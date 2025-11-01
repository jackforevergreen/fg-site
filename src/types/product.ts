// Product and pricing types for carbon credit shop

export enum ProductType {
  CARBON_CREDIT = 'carbon_credit',
}

export enum ProjectType {
  AFFORESTATION = 'afforestation',
  ENERGY_WASTE = 'energy_waste',
  FLIGHT_OFFSET = 'flight_offset',
  REFORESTATION = 'reforestation',
  HYDROELECTRIC = 'hydroelectric',
}

export enum PriceType {
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
}

export enum BillingInterval {
  MONTH = 'month',
  YEAR = 'year',
}

export interface ProductMetadata {
  product_type: ProductType;
  project_type: ProjectType;
  co2_offset_per_unit?: number;
}

export interface PriceRecurring {
  interval: BillingInterval;
  interval_count?: number;
}

export interface PriceMetadata {
  product_type: ProductType;
  project_name: string;
  total_offset?: number;
  emissions_range?: string; // e.g., "0-1" for subscription tiers
}

export interface Price {
  id: string;
  active: boolean;
  unit_amount: number; // Amount in cents
  currency: string;
  type: PriceType;
  recurring?: PriceRecurring;
  metadata: PriceMetadata;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  active: boolean;
  images: string[];
  metadata: ProductMetadata;
  prices?: Price[];
}

export interface CartItem {
  id: string; // Firestore document ID
  productId: string;
  priceId: string;
  name: string;
  productType: ProductType;
  projectType?: ProjectType;
  quantity: number;
  unitAmount: number; // Price in cents
  type: PriceType;
  recurring?: PriceRecurring;
}

export interface TransactionItem extends CartItem {
  price: number; // Formatted price for display
}

// For creating checkout sessions
export interface CheckoutLineItem {
  price: string; // Stripe Price ID
  quantity: number;
}

export interface CheckoutSession {
  client: 'web';
  mode: 'payment' | 'subscription';
  success_url: string;
  cancel_url: string;
  line_items: CheckoutLineItem[];
}

// Helper function to format price
export function formatPrice(amountInCents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amountInCents / 100);
}

// Helper function to get price display text
export function getPriceDisplayText(price: Price): string {
  const amount = formatPrice(price.unit_amount, price.currency);

  if (price.type === PriceType.RECURRING && price.recurring) {
    const interval = price.recurring.interval === BillingInterval.MONTH ? 'month' : 'year';
    return `${amount}/${interval}`;
  }

  return amount;
}

// Helper to calculate cart total
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.unitAmount * item.quantity), 0);
}

// Helper to get project type display name
export function getProjectTypeDisplayName(projectType: ProjectType): string {
  const names: Record<ProjectType, string> = {
    [ProjectType.AFFORESTATION]: 'Afforestation',
    [ProjectType.ENERGY_WASTE]: 'Energy Waste Reduction',
    [ProjectType.FLIGHT_OFFSET]: 'Flight Offset',
    [ProjectType.REFORESTATION]: 'Reforestation',
    [ProjectType.HYDROELECTRIC]: 'Hydroelectric',
  };
  return names[projectType] || projectType;
}
