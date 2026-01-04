// Newsletter service for managing email subscriptions
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Save newsletter subscription to Firestore
 * Creates a permanent, timestamped log that admins can view in Firebase Console
 */
export async function saveNewsletterSubscription(email: string): Promise<void> {
  await addDoc(collection(db, 'newsletter-subscriptions'), {
    email: email.toLowerCase().trim(),
    subscribedAt: serverTimestamp(),
    source: 'website',
  });
}
