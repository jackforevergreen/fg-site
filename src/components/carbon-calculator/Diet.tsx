import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import RadioButtonGroup from "./RadioButtonGroup";
import type { SurveyData, SurveyEmissions } from "@/pages/CarbonCalculator";

type DietProps = {
  surveyData: SurveyData;
  setSurveyData: (data: SurveyData) => void;
  surveyEmissions: SurveyEmissions;
  setSurveyEmissions: (emissions: SurveyEmissions) => void;
  onNext: () => void;
};

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

const Diet = ({
  surveyData,
  setSurveyData,
  surveyEmissions,
  setSurveyEmissions,
  onNext,
}: DietProps) => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate diet emissions
  useEffect(() => {
    const emissionRates = {
      "Meat Lover 🍖 ": 3.3,
      "Average 🍗 ": 2.5,
      "No Beef Or Lamb 🐟🥗 ": 1.9,
      "Vegetarian 🥕🥦 ": 1.7,
      "Vegan 🌱🥑 ": 1.5,
    };

    const emissions = emissionRates[surveyData.diet as keyof typeof emissionRates] || 2.5;
    setSurveyEmissions({ ...surveyEmissions, dietEmissions: emissions });
  }, [surveyData.diet]);

  const isValid = surveyData.diet !== "" && surveyData.diet !== undefined;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="max-w-4xl mx-auto pt-8"
    >
      {/* Page Header */}
      <motion.div variants={fadeUp} className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mb-2 mt-4 shadow-lg">
          <UtensilsCrossed className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Diet Emissions
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Next up is your dietary emissions! These are all the emissions related to what you eat.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="shadow-md border-2 border-orange-300">
          <CardContent className="space-y-6">
          <RadioButtonGroup
            question="Select your Diet:"
            options={[
              "Meat Lover 🍖 ",
              "Average 🍗 ",
              "No Beef Or Lamb 🐟🥗 ",
              "Vegetarian 🥕🥦 ",
              "Vegan 🌱🥑 ",
            ]}
            value={surveyData.diet || "Average 🍗 "}
            onChange={(value) => setSurveyData({ ...surveyData, diet: value })}
          />

          <div className="border-t pt-6 mt-6">
            <h3 className="text-2xl font-bold text-center mb-4">Your Emissions Breakdown:</h3>
            <div className="space-y-3 bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-lg border border-orange-300">
              <div className="flex justify-between text-base">
                <span>Transportation Emissions:</span>
                <span className="font-semibold">{surveyEmissions.transportationEmissions?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Diet Emissions:</span>
                <span className="font-semibold">{surveyEmissions.dietEmissions?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-orange-300 pt-3 mt-3">
                <span>Total:</span>
                <span>
                  {(
                    (surveyEmissions.transportationEmissions || 0) +
                    (surveyEmissions.dietEmissions || 0)
                  ).toFixed(2)}{" "}
                  tons of CO₂ per year
                </span>
              </div>
            </div>
          </div>

          <Button onClick={onNext} disabled={!isValid} variant="hero" className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all" size="lg">
            Continue to Energy →
          </Button>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
};

export default Diet;
