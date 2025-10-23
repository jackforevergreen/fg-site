import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import { signOut, User, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { fetchEmissionsData } from "@/api/emissions";
import { EmissionsDocument } from "@/types/emissions";
import { LogOut, User as UserIcon, Calendar, Leaf, Trash2, Edit2, Car, Utensils, Zap, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [emissionsData, setEmissionsData] = useState<EmissionsDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        navigate("/");
        return;
      }

      // Fetch user's current month emissions data
      try {
        const data = await fetchEmissionsData();
        setEmissionsData(data);
      } catch (error) {
        console.error("Error fetching emissions data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleTakeCalculator = () => {
    navigate("/carbon-calculator");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleteError("");
    setIsDeleting(true);

    try {
      // Check if user uses email/password auth
      const isEmailUser = user.providerData.some(
        (provider) => provider.providerId === "password"
      );

      if (isEmailUser) {
        // Require password for email/password users
        if (!deletePassword) {
          setDeleteError("Password is required to delete your account");
          setIsDeleting(false);
          return;
        }

        // Reauthenticate
        const credential = EmailAuthProvider.credential(
          user.email!,
          deletePassword
        );
        await reauthenticateWithCredential(user, credential);
      }

      // Delete the user
      await deleteUser(user);

      // Navigate to home
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/wrong-password") {
        setDeleteError("Incorrect password. Please try again.");
      } else if (error.code === "auth/requires-recent-login") {
        setDeleteError("Please sign out and sign in again before deleting your account.");
      } else {
        setDeleteError("Failed to delete account. Please try again.");
      }
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">

      <Navigation />

      <div className="container mx-auto px-4 py-12 relative z-10 mt-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          {/* Header with Default Avatar */}
          <motion.div variants={fadeUp} className="text-center mb-8 py-8">
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-2xl">
                <UserIcon className="h-14 w-14 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {user?.displayName || "Your Profile"}
            </h1>
            <p className="text-xl text-gray-600">
              Welcome back{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!
            </p>
          </motion.div>

          {/* Account Info Card */}
          <motion.div variants={fadeUp} className="mb-6">
            <Card className="shadow-md border-2 border-gray-200 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gray-100 text-center pb-6">
                <div className="mx-auto mb-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <UserIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 shadow-sm">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                  </div>
                </div>
                {user?.displayName && (
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Name</p>
                      <p className="text-lg font-semibold text-gray-900">{user.displayName}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 shadow-sm">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Account Created</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.metadata.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <Calendar className="h-6 w-6 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Month Emissions Card */}
          <motion.div variants={fadeUp} className="mb-6">
            <Card className="shadow-md border-2 border-gray-200 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gray-100 text-center pb-6">
                <div className="mx-auto mb-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                    <Leaf className="h-7 w-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">This Month's Carbon Footprint</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {emissionsData ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg border-2 border-green-200 shadow-sm">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingDown className="h-8 w-8 text-green-600" />
                        <p className="text-5xl font-bold text-gray-900">
                          {emissionsData.totalEmissions?.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-center text-xl text-gray-700 font-semibold">
                        tons CO₂ per year
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="h-5 w-5 text-blue-600" />
                          <p className="text-sm font-semibold text-gray-700">Transportation</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {emissionsData.surveyEmissions?.transportationEmissions?.toFixed(2) || "0.00"} <span className="text-sm font-medium text-gray-600">tons</span>
                        </p>
                      </div>
                      <div className="p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <Utensils className="h-5 w-5 text-orange-600" />
                          <p className="text-sm font-semibold text-gray-700">Diet</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {emissionsData.surveyEmissions?.dietEmissions?.toFixed(2) || "0.00"} <span className="text-sm font-medium text-gray-600">tons</span>
                        </p>
                      </div>
                      <div className="p-5 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-5 w-5 text-yellow-600" />
                          <p className="text-sm font-semibold text-gray-700">Energy</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {emissionsData.surveyEmissions?.energyEmissions?.toFixed(2) || "0.00"} <span className="text-sm font-medium text-gray-600">tons</span>
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleTakeCalculator}
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all py-6"
                    >
                      <Edit2 className="mr-2 h-5 w-5" />
                      Recalculate Carbon Footprint
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                        <Leaf className="h-10 w-10 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xl text-gray-700 mb-6 font-medium">
                      You haven't calculated your carbon footprint this month yet.
                    </p>
                    <Button
                      onClick={handleTakeCalculator}
                      variant="hero"
                      size="lg"
                      className="font-bold text-lg shadow-xl hover:shadow-2xl transition-all px-10 py-6"
                    >
                      <Leaf className="mr-2 h-5 w-5" />
                      Take Carbon Calculator
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 font-bold shadow-md hover:shadow-lg transition-all px-8 py-6 text-base"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign Out
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-bold shadow-md hover:shadow-lg transition-all px-8 py-6 text-base"
                >
                  <Trash2 className="mr-2 h-5 w-5" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl">Delete Account</AlertDialogTitle>
                  <AlertDialogDescription className="text-base">
                    Are you sure you want to delete your account? This action cannot be undone.
                    All your data, including emissions history, will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {user?.providerData.some((p) => p.providerId === "password") && (
                  <div className="space-y-2">
                    <Label htmlFor="delete-password">Confirm your password</Label>
                    <Input
                      id="delete-password"
                      type="password"
                      placeholder="Enter your password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="border-2"
                    />
                    {deleteError && (
                      <p className="text-sm text-red-600">{deleteError}</p>
                    )}
                  </div>
                )}

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
