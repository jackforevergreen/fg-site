import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Zap,
  Car,
  Utensils,
  Home,
  TrendingDown,
  BarChart3,
  LogIn,
  Lightbulb,
  TreePine,
  Wind,
  Globe,
  Earth,
  HeartPulse,
  Trees,
  Sprout,
  SproutIcon,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import type { SurveyData, SurveyEmissions } from "@/pages/CarbonCalculator";
import { auth } from "@/lib/firebase";
import { saveEmissionsData, saveCommunityEmissionsData } from "@/api/emissions";
import LoginModal from "@/components/auth/LoginModal";

type BreakdownProps = {
  surveyData: SurveyData;
  surveyEmissions: SurveyEmissions;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const Breakdown = ({ surveyData, surveyEmissions }: BreakdownProps) => {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Check auth status and save data if logged in
  useEffect(() => {
    const saveData = async () => {
      const user = auth.currentUser;
      setIsLoggedIn(!!user);

      if (user && !dataSaved) {
        try {
          // Save emissions data
          await saveEmissionsData({
            surveyData,
            surveyEmissions,
            totalEmissions: surveyEmissions.totalEmissions || 0,
            monthlyEmissions: surveyEmissions.monthlyEmissions || 0,
          });

          // Update community stats
          await saveCommunityEmissionsData(surveyEmissions.totalEmissions || 0);

          setDataSaved(true);
          console.log("Data saved successfully!");
        } catch (error) {
          console.error("Error saving data:", error);
        }
      }
    };

    saveData();
  }, [surveyData, surveyEmissions, dataSaved]);

  const totalEmissions = surveyEmissions.totalEmissions || 0;
  const avgAmericanEmissions = 16; // Average American carbon footprint

  const percentageOfAverage = (
    (totalEmissions / avgAmericanEmissions) *
    100
  ).toFixed(0);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="max-w-6xl mx-auto space-y-6 pt-8"
    >
      {/* Page Header */}
      <motion.div variants={fadeUp} className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 mt-4">
          Your Carbon Footprint Results
        </h1>
        <p className="text-xl text-gray-600">
          Here's your environmental impact breakdown
        </p>
      </motion.div>

      {/* Login Prompt Banner (if not logged in) */}
      {!isLoggedIn && (
        <motion.div variants={fadeUp}>
          <Card className="shadow-xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-100 to-gray-100">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <div className="p-2 bg-yellow-400 rounded-full">
                      <LogIn className="h-6 w-6 text-gray-900" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Save Your Progress!
                    </h3>
                  </div>
                  <p className="text-lg text-gray-800 font-medium">
                    Create an account to track your carbon footprint over time
                    and see your progress.
                  </p>
                </div>
                <Button
                  onClick={() => setLoginModalOpen(true)}
                  size="lg"
                  className="flex-shrink-0 gap-2 bg-primary text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
                >
                  <LogIn className="h-6 w-6" />
                  Sign Up / Log In
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Results Card */}
      <motion.div variants={fadeUp}>
        <Card className="shadow-md border-2 border-gray-200 hover:shadow-2xl transition-shadow">
          <CardHeader className="text-center bg-gray-100 pb-6 pt-6">
            <div className="mx-auto">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <Leaf className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-6xl font-bold text-gray-900">
              {totalEmissions.toFixed(2)}
            </CardTitle>
            <p className="text-2xl font-semibold text-gray-700">
              tons CO₂ per year
            </p>
            <div className="flex items-center justify-center">
              <div className="mt-3 px-6 py-2 bg-white border-2 border-primary rounded-full shadow-sm">
                <span className="text-lg font-bold text-primary">
                  {surveyEmissions.monthlyEmissions?.toFixed(2)} tons/month
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            {/* Emissions Breakdown */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <TrendingDown className="h-6 w-6 text-green-600" />
                Your Footprint
              </h3>
              <div className="space-y-4 max-w-2xl mx-auto">
                <motion.div
                  className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 shadow-sm"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Car className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-900">
                        Transportation
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {surveyEmissions.transportationEmissions?.toFixed(2)} tons
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-300 to-blue-600 h-3 rounded-full shadow-inner"
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${
                          ((surveyEmissions.transportationEmissions || 0) /
                            totalEmissions) *
                          100
                        }%`,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200 shadow-sm"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Utensils className="h-6 w-6 text-orange-600" />
                      <span className="text-lg font-semibold text-gray-900">
                        Diet
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {surveyEmissions.dietEmissions?.toFixed(2)} tons
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full shadow-inner"
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${
                          ((surveyEmissions.dietEmissions || 0) /
                            totalEmissions) *
                          100
                        }%`,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-200 shadow-sm"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Zap className="h-6 w-6 text-yellow-400" />
                      <span className="text-lg font-semibold text-gray-900">
                        Energy
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {surveyEmissions.energyEmissions?.toFixed(2)} tons
                    </span>
                  </div>
                  <div className="w-full bg-yellow-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-3 rounded-full shadow-inner"
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${
                          ((surveyEmissions.energyEmissions || 0) /
                            totalEmissions) *
                          100
                        }%`,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Comparison Bar Graph */}
            <div className="border-t-2 border-gray-200 pt-8">
              <h3 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <BarChart3 className="h-6 w-6 text-green-600" />
                How You Compare
              </h3>
              <div className="max-w-3xl mx-auto">
                <p className="text-center text-lg text-gray-700 mb-6 font-medium">
                  Your footprint vs. Average American ({avgAmericanEmissions}{" "}
                  tons CO₂/year)
                </p>

                {/* Bar Graph */}
                <div className="space-y-4 mb-6">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Average American
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {avgAmericanEmissions} tons
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8 shadow-inner overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-gray-400 to-gray-500 h-8 rounded-full flex items-center justify-end pr-3"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                          duration: 1,
                          delay: 0.4,
                          ease: "easeOut",
                        }}
                      >
                        <span className="text-xs font-semibold text-white">
                          100%
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Your Footprint
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {totalEmissions.toFixed(2)} tons
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8 shadow-inner overflow-hidden">
                      <motion.div
                        className={`h-8 rounded-full flex items-center justify-end pr-3 ${
                          totalEmissions < avgAmericanEmissions
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : "bg-gradient-to-r from-red-500 to-red-600"
                        }`}
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${Math.min(
                            (totalEmissions / avgAmericanEmissions) * 100,
                            100
                          )}%`,
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                          duration: 1.2,
                          delay: 0.6,
                          ease: "easeOut",
                        }}
                      >
                        <span className="text-xs font-semibold text-white">
                          {percentageOfAverage}%
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Comparison Message */}
                <div
                  className={`p-6 rounded-lg text-center border-2 shadow-md ${
                    totalEmissions < avgAmericanEmissions
                      ? "bg-gradient-to-r from-green-50 to-green-100 border-green-300"
                      : "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300"
                  }`}
                >
                  <p
                    className={`text-xl font-bold mb-2 ${
                      totalEmissions < avgAmericanEmissions
                        ? "text-green-900"
                        : "text-orange-900"
                    }`}
                  >
                    {totalEmissions < avgAmericanEmissions
                      ? `🎉 You're ${(
                          100 - parseFloat(percentageOfAverage)
                        ).toFixed(0)}% below average!`
                      : `You're ${(
                          parseFloat(percentageOfAverage) - 100
                        ).toFixed(0)}% above average`}
                  </p>
                  <p
                    className={`text-sm ${
                      totalEmissions < avgAmericanEmissions
                        ? "text-green-700"
                        : "text-orange-700"
                    }`}
                  >
                    {totalEmissions < avgAmericanEmissions
                      ? "Great job! You're doing better than most Americans."
                      : "There's room for improvement. Check out the tips below to reduce your impact."}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile App Promo */}
            <div className="border-t-2 border-gray-200 pt-8 mt-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="p-5 rounded-lg bg-gradient-to-br from-yellow-300 via-primary to-blue-400 shadow-sm">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Info className="h-8 w-8 text-white" />
                    <p className="text-2xl font-bold text-white">
                      Want More Statistics?
                    </p>
                  </div>
                  <p className="text-center text-xl text-white">
                    Download the Forevergreen mobile app to track your carbon
                    footprint over time, get personalized insights, and discover
                    new ways to reduce your environmental impact.
                  </p>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations Card */}
      <motion.div variants={fadeUp}>
        <Card className="shadow-md border-2 border-gray-200 hover:shadow-2xl transition-shadow">
          <CardHeader className="text-center bg-gray-100 pb-6">
            <div className="mx-auto mb-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Reduce Your Impact
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Small changes can make a big difference
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-blue-900">
                    Transportation
                  </h4>
                </div>
                <ul className="text-sm text-blue-900 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>
                      Consider carpooling or using public transportation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Switch to an electric or hybrid vehicle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Reduce air travel when possible</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <Utensils className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-orange-900">Diet</h4>
                </div>
                <ul className="text-sm text-orange-900 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Try reducing meat consumption, especially beef</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Choose local and seasonal produce</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Minimize food waste</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-400 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-yellow-900">Energy</h4>
                </div>
                <ul className="text-sm text-yellow-900 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Switch to energy-efficient appliances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Improve home insulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Consider renewable energy sources</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* CTA Card */}
      <motion.div
        variants={fadeUp}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="shadow-md bg-gradient-to-br from-yellow-300 via-green-600 to-blue-400 hover:shadow-3xl transition-all border-0 overflow-hidden">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl animate-bounce">
                <Sprout className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-5xl font-extrabold mb-4 text-white">
              Take Action Today!
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-white">
              Build your legacy and leave a lasting impact by offsetting your
              carbon footprint.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="text-2xl font-bold text-primary bg-white hover:bg-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 py-7 px-10"
              >
                Offset Your Carbon
              </Button>
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="text-xl font-bold bg-white hover:bg-white text-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 py-7 px-10"
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Back to Home */}
      <motion.div variants={fadeUp} className="text-center pb-8">
        <Button
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          variant="ghost"
          size="lg"
          className="text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-white-0 transition-all"
        >
          <Home className="h-4 w-4 mr-2" />
          Return to Home
        </Button>
      </motion.div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={async () => {
          // After successful login, save the data
          try {
            await saveEmissionsData({
              surveyData,
              surveyEmissions,
              totalEmissions: surveyEmissions.totalEmissions || 0,
              monthlyEmissions: surveyEmissions.monthlyEmissions || 0,
            });
            await saveCommunityEmissionsData(
              surveyEmissions.totalEmissions || 0
            );
            setDataSaved(true);
            setIsLoggedIn(true);
            console.log("Data saved after login!");
          } catch (error) {
            console.error("Error saving data after login:", error);
          }
        }}
      />
    </motion.div>
  );
};

export default Breakdown;
