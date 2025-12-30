import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fetchEmissionsData, saveEmissionsData, saveCommunityEmissionsData } from "@/api/emissions";
import { loadCalculatorCache, clearCalculatorCache } from "@/pages/CarbonCalculator";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const prevUserRef = useRef<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const wasLoggedOut = !prevUserRef.current && currentUser; // Detect login event
      prevUserRef.current = currentUser;
      setUser(currentUser);
      setLoading(false);

      // Sync cache with Firebase when user logs in (from any page)
      if (wasLoggedOut && currentUser) {
        try {
          const cached = loadCalculatorCache();
          if (cached && cached.surveyEmissions.totalEmissions) {
            // We have cached calculator data

            // Fetch existing Firebase data for this month
            const firebaseData = await fetchEmissionsData();

            // Compare timestamps to determine which is newer
            const cacheTimestamp = cached.lastUpdated;
            const firebaseTimestamp = firebaseData?.lastUpdated?.toMillis?.() || 0;

            // Also check if totalEmissions are different (data changed)
            const cacheTotalEmissions = cached.surveyEmissions.totalEmissions || 0;
            const firebaseTotalEmissions = firebaseData?.totalEmissions || 0;

            if (!firebaseData || (cacheTimestamp > firebaseTimestamp && cacheTotalEmissions !== firebaseTotalEmissions)) {
              // Cache is newer and different → save cache to Firebase
              console.log('Syncing cached data to Firebase (cache is newer)');
              await saveEmissionsData({
                surveyData: cached.surveyData,
                surveyEmissions: cached.surveyEmissions,
                totalEmissions: cached.surveyEmissions.totalEmissions || 0,
                monthlyEmissions: cached.surveyEmissions.monthlyEmissions || 0,
              });
              await saveCommunityEmissionsData(cached.surveyEmissions.totalEmissions || 0);
              clearCalculatorCache(); // Clear after successful sync
            } else if (firebaseTimestamp > cacheTimestamp || cacheTotalEmissions === firebaseTotalEmissions) {
              // Firebase is newer or data is the same → clear cache
              console.log('Firebase data is newer or same, clearing cache');
              clearCalculatorCache();
            }
          }
        } catch (error) {
          console.error('Error syncing calculator data:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []); // Empty deps: onAuthStateChanged handles changes, ref tracks previous state

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
