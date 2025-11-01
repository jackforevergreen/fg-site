import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const createUserProfile = async (userData: {
  uid: string;
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
}): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userData.uid);

    // Check if user profile already exists
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // User already exists, don't update createdAt
      //console.log("User profile already exists:", userData.uid);
      return;
    }

    // New user - create profile with createdAt
    const userProfile = {
      isAnonymous: false,
      name: userData.name || "",
      photoURL: userData.photoURL || "",
      emailAddress: userData.email || "",
      firstName: userData.name?.split(" ")[0] || "",
      lastName: userData.name?.split(" ").slice(1).join(" ") || "",
      isSubscribed: true,
      createdAt: serverTimestamp(),
    };

    await setDoc(userDocRef, userProfile);
    //console.log("User profile created successfully:", userData.uid);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const deleteUserAccount = async (password?: string) => {
  // This is handled in the Profile component directly
  // Kept here for consistency with mobile app structure
};
