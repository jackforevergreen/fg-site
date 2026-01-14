// components/EmissionsAnalyzer.tsx
// Admin component to analyze emissions documents with real-time progress

import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

interface UserEmissionData {
  userId: string;
  name: string;
  email: string;
  count: number;
  months: string[];
  firstEmission: number;
  lastEmission: number;
  reduction: number;
  hasReduction: boolean;
}

interface AnalysisResults {
  totalUsers: number;
  usersWithEmissions: number;
  usersWithMultiple: number;
  usersWithReductions: number;
  totalOrganicReduction: number;
  maxDocs: number;
  topUsers: UserEmissionData[];
  topReductions: UserEmissionData[];
  distribution: Record<number, number>;
}

interface ProgressState {
  current: number;
  total: number;
  withEmissions: number;
  withMultiple: number;
  withReductions: number;
}

export default function EmissionsAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressState | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    setProgress(null);

    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      let totalUsers = 0;
      let usersWithEmissions = 0;
      let usersWithMultiple = 0;
      let usersWithReductions = 0;
      let totalOrganicReduction = 0;
      let maxDocs = 0;
      const userDetails: UserEmissionData[] = [];

      const totalToProcess = usersSnapshot.size;

      for (const userDoc of usersSnapshot.docs) {
        totalUsers++;
        const userId = userDoc.id;
        const userData = userDoc.data();

        // Get user info
        const name =
          userData.name ||
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
          "Unknown User";
        const email = userData.emailAddress || userData.email || "No email";

        // Get emissions
        const emissionsRef = collection(db, "users", userId, "emissions");
        const emissionsSnapshot = await getDocs(emissionsRef);

        const count = emissionsSnapshot.size;
        const months = emissionsSnapshot.docs.map((doc) => doc.id).sort();

        if (count > 0) {
          usersWithEmissions++;

          // Get first and last emissions
          const firstDoc = emissionsSnapshot.docs.find(
            (doc) => doc.id === months[0]
          );
          const lastDoc = emissionsSnapshot.docs.find(
            (doc) => doc.id === months[months.length - 1]
          );

          const firstEmission = firstDoc?.data()?.totalEmissions || 0;
          const lastEmission = lastDoc?.data()?.totalEmissions || 0;
          const reduction = firstEmission - lastEmission;

          // Only count as having reduction if both emissions are > 0 and there's actual reduction
          const hasReduction =
            count > 1 && reduction > 0 && firstEmission > 0 && lastEmission > 0;

          if (count > 1) {
            usersWithMultiple++;
            if (hasReduction) {
              usersWithReductions++;
              totalOrganicReduction += reduction;
            }
          }

          // Only add user to details if they have valid emissions data (not 0)
          if (firstEmission > 0 || lastEmission > 0) {
            userDetails.push({
              userId,
              name,
              email,
              count,
              months,
              firstEmission,
              lastEmission,
              reduction,
              hasReduction,
            });
          }

          if (count > maxDocs) {
            maxDocs = count;
          }
        }

        // Update progress every 5 users
        if (totalUsers % 5 === 0 || totalUsers === totalToProcess) {
          setProgress({
            current: totalUsers,
            total: totalToProcess,
            withEmissions: usersWithEmissions,
            withMultiple: usersWithMultiple,
            withReductions: usersWithReductions,
          });
        }
      }

      // Sort and get top 10 by document count
      const topUsers = [...userDetails]
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Get top 10 by reductions
      const topReductions = [...userDetails]
        .filter((u) => u.hasReduction)
        .sort((a, b) => b.reduction - a.reduction)
        .slice(0, 10);

      // Calculate distribution
      const distribution: Record<number, number> = {};
      userDetails.forEach((u) => {
        distribution[u.count] = (distribution[u.count] || 0) + 1;
      });

      setResults({
        totalUsers,
        usersWithEmissions,
        usersWithMultiple,
        usersWithReductions,
        totalOrganicReduction,
        maxDocs,
        topUsers,
        topReductions,
        distribution,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Emissions Documents Analyzer
        </h1>
        <p className="text-muted-foreground">
          Analyze user emissions tracking and calculate organic CO₂ reductions.
        </p>
      </div>

      <Button
        onClick={runAnalysis}
        disabled={loading}
        size="lg"
        className="mb-8"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Analyzing..." : "Run Analysis"}
      </Button>

      {/* Info box showing how to add to Firebase */}
      {results && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">
            📋 Add to Firebase Manually
          </h3>
          <p className="text-sm text-green-800 mb-3">
            Go to Firebase Console → Firestore → community → emissions_stats
          </p>
          <div className="bg-white rounded p-3 font-mono text-sm">
            <div className="text-green-700">
              organic_reductions:{" "}
              <span className="font-bold">
                {results.totalOrganicReduction.toFixed(2)}
              </span>
            </div>
            <div className="text-green-700 mt-1">
              users_with_reductions:{" "}
              <span className="font-bold">{results.usersWithReductions}</span>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Progress Indicator */}
      {loading && progress && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>
                Processing... {progress.current} / {progress.total}
              </span>
              <span>
                {((progress.current / progress.total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">With Emissions</div>
              <div className="text-lg font-semibold text-green-700">
                {progress.withEmissions}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Multiple Months</div>
              <div className="text-lg font-semibold text-blue-700">
                {progress.withMultiple}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">With Reductions</div>
              <div className="text-lg font-semibold text-purple-700">
                {progress.withReductions}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Progress</div>
              <div className="text-lg font-semibold text-gray-700">
                {progress.current} / {progress.total}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-6 bg-white border rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {results.totalUsers}
              </div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>

            <div className="p-6 bg-white border rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {results.usersWithEmissions}
              </div>
              <div className="text-sm text-muted-foreground">
                With Emissions Data
              </div>
            </div>

            <div className="p-6 bg-white border rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {results.usersWithMultiple}
              </div>
              <div className="text-sm text-muted-foreground">
                Tracking Over Time
              </div>
            </div>

            <div className="p-6 bg-white border rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {results.usersWithReductions}
              </div>
              <div className="text-sm text-muted-foreground">
                With Reductions
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <div className="text-3xl font-bold text-green-700">
                {results.totalOrganicReduction.toFixed(1)}
              </div>
              <div className="text-sm font-medium text-green-800">
                Tons CO₂ Reduced
              </div>
            </div>
          </div>

          {/* Top Reductions */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-green-600" />
              🌱 Top 10 Users with Biggest CO₂ Reductions
            </h2>
            <div className="space-y-3">
              {results.topReductions.length > 0 ? (
                results.topReductions.map((user, i) => (
                  <div
                    key={user.userId}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-lg">
                          {i + 1}. {user.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-700">
                          -{user.reduction.toFixed(2)} tons
                        </div>
                        <div className="text-xs text-green-600">
                          {(
                            (user.reduction / user.firstEmission) *
                            100
                          ).toFixed(1)}
                          % reduction
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">First: </span>
                        <span className="font-medium">
                          {user.firstEmission.toFixed(2)} tons ({user.months[0]}
                          )
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Latest: </span>
                        <span className="font-medium">
                          {user.lastEmission.toFixed(2)} tons (
                          {user.months[user.months.length - 1]})
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Tracking {user.count} months: {user.months.join(", ")}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No users with reductions yet. Users need at least 2 months of
                  data.
                </p>
              )}
            </div>
          </div>

          {/* Top Trackers */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              🏆 Top 10 Users by Tracking Consistency
            </h2>
            <div className="space-y-3">
              {results.topUsers.map((user, i) => (
                <div
                  key={user.userId}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">
                        {i + 1}. {user.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {user.count} months
                      </div>
                      {user.count > 1 && (
                        <div className="flex items-center gap-1 text-sm">
                          {user.hasReduction ? (
                            <>
                              <TrendingDown className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">
                                -{user.reduction.toFixed(2)} tons
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="h-4 w-4 text-orange-600" />
                              <span className="text-orange-600">
                                +{Math.abs(user.reduction).toFixed(2)} tons
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.months.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              📊 Document Count Distribution
            </h2>
            <div className="space-y-2">
              {Object.keys(results.distribution)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((count) => {
                  const numCount = parseInt(count);
                  const numUsers = results.distribution[numCount];
                  const percentage =
                    (numUsers / results.usersWithEmissions) * 100;
                  return (
                    <div key={count} className="flex items-center gap-3">
                      <div className="w-16 text-sm font-medium">
                        {count} doc{numCount > 1 ? "s" : ""}:
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                        <div
                          className="bg-primary h-6 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-3 text-xs font-semibold">
                          {numUsers} users ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
