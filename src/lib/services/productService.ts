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

      const priceId =
        matchingProduct?.prices?.find(
          (price) =>
            price.type === PriceType.RECURRING &&
            price.recurring?.interval === BillingInterval.MONTH
        )?.id || '';

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
