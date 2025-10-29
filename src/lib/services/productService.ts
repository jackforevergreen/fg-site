// Product service for fetching carbon credit products from Firestore

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Price, PriceType, BillingInterval } from '@/types/product';
import { SubscriptionTier, SUBSCRIPTION_TIERS } from '@/types/subscription';
import { YearlyOffsetTier, YEARLY_OFFSET_TIERS } from '@/types/yearlyOffset';

/**
 * Fetch all active carbon credit products from Firestore
 */
export async function fetchCarbonCreditProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('active', '==', true));
    const querySnapshot = await getDocs(q);

    const products: Product[] = [];

    for (const productDoc of querySnapshot.docs) {
      const productData = productDoc.data() as DocumentData;

      // Fetch prices for this product
      const pricesRef = collection(db, `products/${productDoc.id}/prices`);
      const pricesQuery = query(pricesRef, where('active', '==', true));
      const pricesSnapshot = await getDocs(pricesQuery);

      const prices: Price[] = pricesSnapshot.docs.map((priceDoc) => ({
        id: priceDoc.id,
        ...priceDoc.data(),
      } as Price));

      const product: Product = {
        id: productDoc.id,
        name: productData.name,
        description: productData.description || '',
        active: productData.active,
        images: productData.images || [],
        metadata: productData.metadata || {},
        prices,
      };

      products.push(product);
    }

    return products;
  } catch (error) {
    console.error('Error fetching carbon credit products:', error);
    throw new Error('Failed to fetch products');
  }
}

/**
 * Fetch a specific carbon credit product with its pricing
 */
export async function fetchSpecificProduct(productId: string): Promise<Product | null> {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return null;
    }

    const productData = productDoc.data();

    // Fetch prices for this product
    const pricesRef = collection(db, `products/${productId}/prices`);
    const pricesQuery = query(pricesRef, where('active', '==', true));
    const pricesSnapshot = await getDocs(pricesQuery);

    const prices: Price[] = pricesSnapshot.docs.map((priceDoc) => ({
      id: priceDoc.id,
      ...priceDoc.data(),
    } as Price));

    return {
      id: productDoc.id,
      name: productData.name,
      description: productData.description || '',
      active: productData.active,
      images: productData.images || [],
      metadata: productData.metadata || {},
      prices,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}

/**
 * Fetch subscription tier products based on user's monthly emissions
 * @param monthlyEmissions - User's monthly CO2 emissions in tons (optional)
 */
export async function fetchSubscriptionTiers(
  monthlyEmissions?: number
): Promise<SubscriptionTier[]> {
  try {
    // Fetch all products
    const products = await fetchCarbonCreditProducts();

    // Filter for subscription products only
    const subscriptionProducts = products.filter((product) =>
      product.prices?.some(
        (price) =>
          price.type === PriceType.RECURRING &&
          price.recurring?.interval === BillingInterval.MONTH
      )
    );

    console.log('Subscription products found:', subscriptionProducts.length);
    subscriptionProducts.forEach(product => {
      console.log(`Product: ${product.name}`);
      product.prices?.forEach(price => {
        if (price.type === PriceType.RECURRING) {
          console.log(`  - Price ID: ${price.id}, Amount: ${price.unit_amount}`);
        }
      });
    });

    // Map to subscription tiers
    const tiers: SubscriptionTier[] = SUBSCRIPTION_TIERS.map((tier, index) => {
      // Try to find matching product based on price
      const matchingProduct = subscriptionProducts.find((product) => {
        const monthlyPrice = product.prices?.find(
          (price) =>
            price.type === PriceType.RECURRING &&
            price.recurring?.interval === BillingInterval.MONTH &&
            price.unit_amount === tier.monthly_price
        );
        return !!monthlyPrice;
      });

      // Find the specific price that matches this tier's monthly_price
      const matchingPrice = matchingProduct?.prices?.find(
        (price) =>
          price.type === PriceType.RECURRING &&
          price.recurring?.interval === BillingInterval.MONTH &&
          price.unit_amount === tier.monthly_price
      );

      const priceId = matchingPrice?.id || '';

      console.log(`Tier: ${tier.name} ($${tier.monthly_price / 100}) -> Price ID: ${priceId || 'NOT FOUND'}`);
      if (!priceId) {
        console.warn(`No matching price found for tier ${tier.name} with monthly_price ${tier.monthly_price}`);
      }

      // Determine if this tier is recommended
      const isRecommended =
        monthlyEmissions !== undefined &&
        monthlyEmissions >= tier.emissions_min &&
        monthlyEmissions < tier.emissions_max;

      return {
        ...tier,
        price_id: priceId,
        recommended: isRecommended,
      };
    });

    return tiers;
  } catch (error) {
    console.error('Error fetching subscription tiers:', error);
    throw new Error('Failed to fetch subscription tiers');
  }
}

/**
 * Fetch one-time purchase products (non-recurring)
 */
export async function fetchOneTimeProducts(): Promise<Product[]> {
  try {
    const allProducts = await fetchCarbonCreditProducts();

    // Filter for one-time purchase products
    return allProducts.filter((product) =>
      product.prices?.some((price) => price.type === PriceType.ONE_TIME)
    );
  } catch (error) {
    console.error('Error fetching one-time products:', error);
    throw new Error('Failed to fetch one-time products');
  }
}

/**
 * Fetch recurring subscription products
 */
export async function fetchSubscriptionProducts(): Promise<Product[]> {
  try {
    const allProducts = await fetchCarbonCreditProducts();

    // Filter for subscription products
    return allProducts.filter((product) =>
      product.prices?.some((price) => price.type === PriceType.RECURRING)
    );
  } catch (error) {
    console.error('Error fetching subscription products:', error);
    throw new Error('Failed to fetch subscription products');
  }
}

/**
 * Fetch yearly offset tier products based on user's yearly emissions
 * @param yearlyEmissions - User's yearly CO2 emissions in tons (optional)
 */
export async function fetchYearlyOffsetTiers(
  yearlyEmissions?: number
): Promise<YearlyOffsetTier[]> {
  try {
    // Fetch all products
    const products = await fetchCarbonCreditProducts();

    // Filter for one-time purchase products only
    const oneTimeProducts = products.filter((product) =>
      product.prices?.some((price) => price.type === PriceType.ONE_TIME)
    );

    console.log('One-time products found:', oneTimeProducts.length);
    oneTimeProducts.forEach(product => {
      console.log(`Product: ${product.name}`);
      product.prices?.forEach(price => {
        if (price.type === PriceType.ONE_TIME) {
          console.log(`  - Price ID: ${price.id}, Amount: ${price.unit_amount}`);
        }
      });
    });

    // Map to yearly offset tiers
    const tiers: YearlyOffsetTier[] = YEARLY_OFFSET_TIERS.map((tier) => {
      // Try to find matching product based on discounted price
      const matchingProduct = oneTimeProducts.find((product) => {
        const oneTimePrice = product.prices?.find(
          (price) =>
            price.type === PriceType.ONE_TIME &&
            price.unit_amount === tier.discounted_price
        );
        return !!oneTimePrice;
      });

      // Find the specific price that matches this tier's discounted_price
      const matchingPrice = matchingProduct?.prices?.find(
        (price) =>
          price.type === PriceType.ONE_TIME &&
          price.unit_amount === tier.discounted_price
      );

      const priceId = matchingPrice?.id || '';

      console.log(`Tier: ${tier.credits} credits ($${tier.discounted_price / 100}) -> Price ID: ${priceId || 'NOT FOUND'}`);
      if (!priceId) {
        console.warn(`No matching price found for tier with ${tier.credits} credits and discounted_price ${tier.discounted_price}`);
      }

      // Determine if this tier is recommended
      const isRecommended =
        yearlyEmissions !== undefined &&
        yearlyEmissions <= tier.emissions_max &&
        (tier.id === 'yearly-12' || yearlyEmissions > YEARLY_OFFSET_TIERS[YEARLY_OFFSET_TIERS.indexOf(tier) - 1]?.emissions_max || 0);

      return {
        ...tier,
        price_id: priceId,
        recommended: isRecommended,
      };
    });

    return tiers;
  } catch (error) {
    console.error('Error fetching yearly offset tiers:', error);
    throw new Error('Failed to fetch yearly offset tiers');
  }
}
