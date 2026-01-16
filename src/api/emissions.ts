import { auth, db } from "@/lib/firebase";
import { CommunityEmissionsData, EmissionsDocument } from "@/types/emissions";
import dayjs from "dayjs";
import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export const saveEmissionsData = async (
  data: Partial<EmissionsDocument>,
): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error("No user logged in");
  }

  const userId = auth.currentUser.uid;
  const formattedMonth = dayjs().format("YYYY-MM");
  const userDocRef = doc(
    collection(db, "users", userId, "emissions"),
    formattedMonth,
  );

  try {
    await setDoc(
      userDocRef,
      { ...data, lastUpdated: serverTimestamp() },
      { merge: true },
    );
  } catch (error) {
    console.error("Error saving emissions data:", error);
    throw error;
  }
};

// Fetch emissions data for a specific month
export const fetchEmissionsData = async (month?: string, userId?: string) => {
  if (!auth.currentUser && !userId) {
    console.error("No user logged in and no userId provided");
    return null;
  }

  userId = userId || auth.currentUser!.uid;

  let formattedMonth = month || dayjs().format("YYYY-MM");

  const DocRef = doc(
    collection(db, "users", userId, "emissions"),
    formattedMonth,
  );

  try {
    const Doc = await getDoc(DocRef);
    return Doc.exists() ? (Doc.data() as EmissionsDocument) : null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const saveCommunityEmissionsData = async (amount: number): Promise<void> => {
  const communityDocRef = doc(db, "community", "emissions_stats");

  try {
    await runTransaction(db, async (transaction) => {
      const communityDoc = await transaction.get(communityDocRef);

      if (!communityDoc.exists()) {
        transaction.set(communityDocRef, {
          emissions_calculated: amount,
          last_updated: serverTimestamp(),
        });
      } else {
        const currentEmissions = communityDoc.data().emissions_calculated || 0;
        transaction.update(communityDocRef, {
          emissions_calculated: currentEmissions + amount,
          last_updated: serverTimestamp(),
        });
      }
    });
  } catch (error) {
    console.error("Error updating community emissions data:", error);
    throw error;
  }
};

export const fetchCommunityEmissionsData =
  async (): Promise<CommunityEmissionsData | null> => {
    const communityDocRef = doc(db, "community", "emissions_stats");

    try {
      const communityDoc = await getDoc(communityDocRef);

      if (communityDoc.exists()) {
        const data = communityDoc.data();
        return {
          emissions_calculated: data.emissions_calculated || 0,
          emissions_offset: data.emissions_offset || 0,
          organic_reductions: data.organic_reductions || 0,
          last_updated: data.last_updated
            ? data.last_updated.toDate()
            : new Date(),
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching community emissions data:", error);
      throw error;
    }
  };
