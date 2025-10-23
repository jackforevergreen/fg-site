import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import RadioButtonGroup from "./RadioButtonGroup";
import NumberInput from "./NumberInput";
import QuestionSlider from "./QuestionSlider";
import type { SurveyData, SurveyEmissions } from "@/pages/CarbonCalculator";
import type { Location } from "@/utils/locationHelpers";
import { getCurrencySymbol } from "@/utils/locationHelpers";

type EnergyProps = {
  surveyData: SurveyData;
  setSurveyData: (data: SurveyData) => void;
  surveyEmissions: SurveyEmissions;
  setSurveyEmissions: (emissions: SurveyEmissions) => void;
  selectedLocation: Location | null;
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

const Energy = ({
  surveyData,
  setSurveyData,
  surveyEmissions,
  setSurveyEmissions,
  selectedLocation,
  onNext,
}: EnergyProps) => {
  const currencySymbol = selectedLocation ? getCurrencySymbol(selectedLocation.currency) : "$";

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Update bills when location changes
  useEffect(() => {
    if (selectedLocation) {
      setSurveyData({
        ...surveyData,
        electricBill: selectedLocation.averageMonthlyElectricityBill.toFixed(2),
        waterBill: selectedLocation.averageMonthlyWaterBill.toFixed(2),
        propaneBill: selectedLocation.averageMonthlyPropaneBill.toFixed(2),
        gasBill: selectedLocation.averageMonthlyGasBill.toFixed(2),
      });
    }
  }, [selectedLocation, setSurveyData]);

  // Calculate energy emissions
  useEffect(() => {
    if (!selectedLocation) return;
    const bills = {
      electric: parseFloat(surveyData.electricBill || "0"),
      water: parseFloat(surveyData.waterBill || "0"),
      propane: parseFloat(surveyData.propaneBill || "0"),
      gas: parseFloat(surveyData.gasBill || "0"),
    };

    const peopleInHome = surveyData.peopleInHome || 1;

    // Simplified calculations using location-specific data
    const electricityEmissions =
      ((((selectedLocation.stateEGridValue * 0.000453592) / 1000) * 900 * 12 * (bills.electric / selectedLocation.averageMonthlyElectricityBill)) / peopleInHome);
    const waterEmissions =
      ((bills.water / selectedLocation.averageMonthlyWaterBill) * 0.0052) / peopleInHome;
    const propaneEmissions =
      ((bills.propane / selectedLocation.averageMonthlyPropaneBill) * 0.24) / peopleInHome;
    const gasEmissions =
      ((bills.gas / selectedLocation.averageMonthlyGasBill) * 2.12) / peopleInHome;

    const totalEnergyEmissions =
      electricityEmissions + waterEmissions + propaneEmissions + gasEmissions;

    const totalEmissions =
      totalEnergyEmissions +
      (surveyEmissions.dietEmissions || 0) +
      (surveyEmissions.transportationEmissions || 0);

    setSurveyEmissions({
      ...surveyEmissions,
      electricEmissions: electricityEmissions,
      waterEmissions: waterEmissions,
      otherEnergyEmissions: propaneEmissions + gasEmissions,
      energyEmissions: totalEnergyEmissions,
      totalEmissions,
      monthlyEmissions: totalEmissions / 12,
    });
  }, [surveyData, surveyEmissions.dietEmissions, surveyEmissions.transportationEmissions, selectedLocation]);

  const isValid =
    surveyData.electricBill !== "" &&
    surveyData.waterBill !== "" &&
    surveyData.propaneBill !== "" &&
    surveyData.gasBill !== "" &&
    surveyData.useWoodStove !== "";

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="max-w-4xl mx-auto pt-8"
    >
      {/* Page Header */}
      <motion.div variants={fadeUp} className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 mb-2 mt-4 shadow-lg">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Energy Emissions
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          This last section is all about your energy emissions! Please give us some estimates on your home utilities and energy usage.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="shadow-md border-2 border-yellow-400">
          <CardContent className="space-y-6">
          <NumberInput
            question="How much was your electric bill last month? ⚡"
            value={surveyData.electricBill || "0"}
            onChange={(value) => setSurveyData({ ...surveyData, electricBill: value })}
            unit={currencySymbol}
            label="per month"
            maxValue={1000}
          />

          <NumberInput
            question="How much was your water bill last month? 🚰"
            value={surveyData.waterBill || "0"}
            onChange={(value) => setSurveyData({ ...surveyData, waterBill: value })}
            unit={currencySymbol}
            label="per month"
            maxValue={500}
          />

          <NumberInput
            question="How much was spent on propane last month? 🛢"
            value={surveyData.propaneBill || "0"}
            onChange={(value) => setSurveyData({ ...surveyData, propaneBill: value })}
            unit={currencySymbol}
            label="per month"
            maxValue={500}
          />

          <NumberInput
            question="How much was spent on natural gas last month? ⛽"
            value={surveyData.gasBill || "0"}
            onChange={(value) => setSurveyData({ ...surveyData, gasBill: value })}
            unit={currencySymbol}
            label="per month"
            maxValue={500}
          />

          <RadioButtonGroup
            question="Do you use a wood stove? 🪵"
            options={["Yes", "No"]}
            value={surveyData.useWoodStove || "No"}
            onChange={(value) => setSurveyData({ ...surveyData, useWoodStove: value })}
          />

          <QuestionSlider
            question="How many people live in your household?"
            value={surveyData.peopleInHome || 1}
            onChange={(value) => setSurveyData({ ...surveyData, peopleInHome: value })}
            minimumValue={1}
            maximumValue={7}
          />

          <div className="border-t pt-6 mt-6">
            <h3 className="text-2xl font-bold text-center mb-4">Your Energy Breakdown:</h3>
            <div className="space-y-3 bg-yellow-50 p-6 rounded-lg border border-yellow-400">
              <div className="flex justify-between text-base">
                <span>Electric Emissions:</span>
                <span className="font-semibold">{surveyEmissions.electricEmissions?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Water Emissions:</span>
                <span className="font-semibold">{surveyEmissions.waterEmissions?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Other Energy:</span>
                <span className="font-semibold">{surveyEmissions.otherEnergyEmissions?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Transportation + Diet:</span>
                <span className="font-semibold">
                  {(
                    (surveyEmissions.dietEmissions || 0) +
                    (surveyEmissions.transportationEmissions || 0)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-yellow-400 pt-3 mt-3">
                <span>Total:</span>
                <span>{surveyEmissions.totalEmissions?.toFixed(2)} tons of CO₂ per year</span>
              </div>
            </div>
          </div>

          <Button onClick={onNext} disabled={!isValid} variant="hero" className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all" size="lg">
            See My Results →
          </Button>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
};

export default Energy;
