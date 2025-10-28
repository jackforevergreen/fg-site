# Development Plan: Carbon Credit Shop Implementation

## Current Status: Phase 2 - In Progress

This document tracks the implementation of the carbon credit shop for the Forevergreen website.

## Project Overview

We are porting the carbon credit shop functionality from the React Native mobile app to the web application. The implementation reuses existing Firebase Cloud Functions and integrates Stripe Checkout for payment processing.

## Architecture Decisions

### Backend
- **Reuse existing Firebase Cloud Functions** from mobile app
- Functions already support `client: "web"` parameter
- No backend modifications required

### Payment Processing
- **Stripe Checkout (Hosted)** - Redirects to Stripe's hosted checkout page
- Easier to implement, handles all payment UI
- PCI compliant out of the box
- Mobile-friendly

### State Management
- **React Query** for server state (products, cart, subscriptions)
- Optimistic updates for cart operations
- Automatic caching and refetching

### UI Framework
- **shadcn/ui components** for consistency with existing design
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### Product Types (Initial Launch)
1. **One-time carbon credit purchases** - Single purchases (plant a tree, flight offset, etc.)
2. **Monthly carbon credit subscriptions** - Recurring based on carbon footprint

### Subscription Management
- Users can view subscription status
- Users can cancel subscriptions
- Keep it simple - no upgrade/downgrade in v1

---

## Implementation Phases

### Phase 1: Foundation & Infrastructure ✅

#### 1.1 Dependencies
```bash
npm install @stripe/stripe-js
```

#### 1.2 TypeScript Types
**Files to create:**
- `src/types/product.ts`
  - Product interface
  - Price interface
  - CartItem interface
  - ProductType enum

- `src/types/subscription.ts`
  - Subscription interface
  - SubscriptionStatus enum
  - BillingInterval type

#### 1.3 Service Layer
**Files to create:**
- `src/lib/services/productService.ts`
  - `fetchCarbonCreditProducts()` - Get all active products
  - `fetchSpecificProduct(productId)` - Get single product with pricing
  - `fetchSubscriptionTiers(emissions?)` - Get subscription options

- `src/lib/services/cartService.ts`
  - `getCart(userId)` - Fetch cart from Firestore
  - `addToCart(userId, item)` - Add item with optimistic update
  - `removeFromCart(userId, itemId)` - Remove item
  - `updateQuantity(userId, itemId, quantity)` - Update quantity
  - `clearCart(userId)` - Clear cart after purchase
  - `subscribeToCart(userId, callback)` - Real-time cart listener

- `src/lib/services/checkoutService.ts`
  - `createCheckoutSession(userId, items, successUrl, cancelUrl)` - Create Stripe session
  - `pollCheckoutStatus(userId, sessionId)` - Poll for completion

- `src/lib/services/subscriptionService.ts`
  - `getSubscriptionStatus(userId)` - Fetch user's subscription
  - `cancelSubscription(userId, subscriptionId)` - Cancel subscription
  - `getSubscriptionHistory(userId)` - Get past subscriptions

#### 1.4 Stripe Initialization
**File to create:**
- `src/lib/stripe.ts`
  - Initialize Stripe with publishable key
  - Export `loadStripe()` instance

---

### Phase 2: Custom React Query Hooks 🔄

#### Files to create:
- `src/hooks/useProducts.ts`
  - `useProducts()` - Query all products with caching
  - `useProduct(productId)` - Query single product
  - `useSubscriptionTiers(emissions?)` - Query subscription options

- `src/hooks/useCart.ts`
  - `useCart()` - Get cart with real-time updates
  - `useAddToCart()` - Mutation with optimistic update
  - `useRemoveFromCart()` - Mutation with optimistic update
  - `useUpdateQuantity()` - Mutation with optimistic update
  - `useClearCart()` - Mutation

- `src/hooks/useCheckout.ts`
  - `useCreateCheckout()` - Mutation to create session
  - `useCheckoutStatus(sessionId)` - Poll checkout status

- `src/hooks/useSubscription.ts`
  - `useSubscription()` - Query subscription status
  - `useCancelSubscription()` - Mutation to cancel

---

### Phase 3: Core Components 📋

#### 3.1 Product Components
- `src/components/shop/ProductCard.tsx`
  - Product image
  - Name, description
  - Price display
  - "Add to Cart" button
  - Project badges (afforestation, energy waste, etc.)

- `src/components/shop/ProductGrid.tsx`
  - Grid layout with filters
  - Filter by product type (one-time vs subscription)
  - Loading skeletons
  - Empty state

- `src/components/shop/PriceDisplay.tsx`
  - Format currency (cents to dollars)
  - Handle one-time vs recurring pricing
  - Display billing interval

- `src/components/shop/SubscriptionTierCard.tsx`
  - Tier name (based on emissions)
  - Monthly price
  - CO2 offset amount
  - "Subscribe" CTA
  - Highlight recommended tier

#### 3.2 Cart Components
- `src/components/cart/CartDrawer.tsx`
  - Sliding drawer (shadcn Sheet)
  - Cart icon with badge count
  - List of cart items
  - Total price
  - Checkout button

- `src/components/cart/CartItem.tsx`
  - Product name and type
  - Price per item
  - Quantity controls (+/- buttons)
  - Remove button
  - Subtotal

- `src/components/cart/CartSummary.tsx`
  - Subtotal
  - Total CO2 offset
  - Total price
  - Checkout button

- `src/components/cart/EmptyCart.tsx`
  - Empty state illustration
  - "Browse Products" CTA

#### 3.3 Subscription Components
- `src/components/subscription/SubscriptionCard.tsx`
  - Subscription tier
  - Monthly price
  - Next billing date
  - Status badge (active/canceled)
  - Manage button

- `src/components/subscription/CancelDialog.tsx`
  - Confirmation dialog
  - Warning about losing benefits
  - Cancel/Keep subscription buttons

---

### Phase 4: Pages 📄

#### 4.1 Shop Page (Update Existing)
**File:** `src/pages/Shop.tsx`
- Replace "Coming Soon" placeholder
- Product grid with filters
- Cart drawer trigger
- Integration with carbon calculator results
  - If user came from calculator, recommend subscription tier
  - Persist emissions data in sessionStorage

#### 4.2 Cart Page (New)
**File:** `src/pages/Cart.tsx`
- Full-page cart view
- List all cart items
- Quantity adjustment
- Remove items
- Order summary
- Checkout button
- "Continue Shopping" link

#### 4.3 Checkout Success Page (New)
**File:** `src/pages/CheckoutSuccess.tsx`
- Order confirmation
- Thank you message
- Purchase details (items, total)
- Environmental impact summary
- "View Subscription" or "Return to Shop" buttons

#### 4.4 Subscriptions Page (New)
**File:** `src/pages/Subscriptions.tsx`
- Active subscription card
- Subscription details
- Cancel subscription button
- Purchase history (optional for v1)

#### 4.5 Update Routes
**File:** `src/App.tsx`
```tsx
<Route path="/shop" element={<Shop />} />
<Route path="/cart" element={<Cart />} />
<Route path="/checkout/success" element={<CheckoutSuccess />} />
<Route path="/subscriptions" element={<Subscriptions />} />
```

---

### Phase 5: Checkout Flow Integration 💳

#### Checkout Process:
1. User adds items to cart
2. User clicks "Checkout"
3. Frontend creates document at `users/{uid}/checkout_sessions/{sessionId}`
   ```typescript
   {
     mode: 'payment' | 'subscription',
     client: 'web',
     line_items: [...],
     success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${window.location.origin}/cart`
   }
   ```
4. Cloud Function intercepts and creates Stripe Checkout Session
5. Frontend redirects to Stripe hosted checkout
6. User completes payment
7. Stripe redirects to success URL
8. Success page polls session status
9. Display confirmation

#### Cloud Functions (No changes needed)
- `createCheckoutSession` - Already handles `client: 'web'`
- Webhook handlers - Process `checkout.session.completed` events
- Creates purchase records in Firestore

---

### Phase 6: UX Enhancements 🎨

#### 6.1 Loading States
- Skeleton loaders for product grid
- Loading spinner for cart operations
- Checkout processing overlay

#### 6.2 Error Handling
- Toast notifications (sonner)
- Retry logic for failed mutations
- Network error detection
- Friendly error messages

#### 6.3 Responsive Design
- Mobile-optimized cart drawer
- Touch-friendly quantity controls
- Grid breakpoints (1 col mobile, 2 col tablet, 3 col desktop)

#### 6.4 Animations
- Framer Motion for page transitions
- Cart item add/remove animations
- Success confetti (optional)

#### 6.5 Integration with Carbon Calculator
- Persist calculator results in sessionStorage
- Pass emissions data to shop
- Recommend subscription tier based on footprint
- "Offset Now" CTA on Breakdown page (link to shop with tier pre-selected)

---

## File Structure

```
src/
├── components/
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── PriceDisplay.tsx
│   │   └── SubscriptionTierCard.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── EmptyCart.tsx
│   └── subscription/
│       ├── SubscriptionCard.tsx
│       └── CancelDialog.tsx
├── pages/
│   ├── Shop.tsx (update existing)
│   ├── Cart.tsx
│   ├── CheckoutSuccess.tsx
│   └── Subscriptions.tsx
├── hooks/
│   ├── useProducts.ts
│   ├── useCart.ts
│   ├── useCheckout.ts
│   └── useSubscription.ts
├── lib/
│   ├── services/
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   ├── checkoutService.ts
│   │   └── subscriptionService.ts
│   ├── stripe.ts
│   └── firebase.ts (existing)
└── types/
    ├── product.ts
    └── subscription.ts
```

---

## Data Models (Firestore)

### Products Collection
```
products/
  {productId}/
    name: string
    description: string
    active: boolean
    images: string[]
    metadata: {
      product_type: 'carbon_credit'
      project_type: 'afforestation' | 'energy_waste' | 'flight_offset' | 'reforestation' | 'hydroelectric'
      co2_offset_per_unit: number
    }
    prices/
      {priceId}/
        id: string
        active: boolean
        unit_amount: number (cents)
        currency: string
        type: 'one_time' | 'recurring'
        recurring?: {
          interval: 'month' | 'year'
        }
        metadata: {
          product_type: 'carbon_credit'
          project_name: string
          total_offset: number
        }
```

### Cart Collection
```
users/
  {uid}/
    cart/
      {itemId}/
        id: string
        name: string
        productType: string
        quantity: number
        priceId: string
        unitAmount: number
```

### Checkout Sessions
```
users/
  {uid}/
    checkout_sessions/
      {sessionId}/
        client: 'web'
        mode: 'payment' | 'subscription'
        success_url: string
        cancel_url: string
        line_items: Array<{
          price: string
          quantity: number
        }>
        // Cloud Function adds:
        sessionId: string (Stripe Checkout Session ID)
        url: string (Redirect URL)
```

### Subscriptions Collection
```
users/
  {uid}/
    subscriptions/
      {subscriptionId}/
        id: string (Stripe subscription ID)
        status: 'active' | 'canceled' | 'past_due'
        current_period_end: timestamp
        current_period_start: timestamp
        items: Array<{
          id: string
          price: {
            id: string
            unit_amount: number
            product: string
          }
        }>
```

---

## Testing Checklist

- [ ] Products load correctly from Firestore
- [ ] Add to cart works with optimistic updates
- [ ] Cart persists across page refreshes
- [ ] Quantity updates work correctly
- [ ] Remove from cart works
- [ ] Checkout session creation succeeds
- [ ] Redirect to Stripe Checkout works
- [ ] Payment completion redirects to success page
- [ ] Success page displays correct purchase details
- [ ] Subscription creation works for recurring products
- [ ] Subscription status displays correctly
- [ ] Subscription cancellation works
- [ ] Error states display correctly
- [ ] Loading states appear during async operations
- [ ] Mobile responsive design works
- [ ] Cart drawer opens/closes smoothly
- [ ] Integration with carbon calculator works

---

## Environment Variables

Add to `.env` file:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Next Steps

1. ✅ Install Stripe dependency
2. Create types and service layer
3. Build custom hooks
4. Create components
5. Update pages
6. Test checkout flow
7. Polish UX
8. Deploy to production

---

## Notes

- The mobile app's Cloud Functions are well-architected and support both mobile and web clients
- No backend changes are needed - just need to set `client: 'web'` in checkout session creation
- Stripe Checkout handles all payment UI, making implementation simpler
- React Query provides excellent developer experience with caching and optimistic updates
- shadcn/ui components ensure design consistency with existing website

---

**Last Updated:** 2025-10-23
**Status:** Phase 1 Complete, Phase 2 In Progress
