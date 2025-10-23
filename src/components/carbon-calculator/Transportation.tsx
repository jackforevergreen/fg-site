import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { motion } from "framer-motion";
import RadioButtonGroup from "./RadioButtonGroup";
import NumberInput from "./NumberInput";
import QuestionSlider from "./QuestionSlider";
import type { SurveyData, SurveyEmissions } from "@/pages/CarbonCalculator";
import type { Location } from "@/utils/locationHelpers";
import { kmToMiles } from "@/utils/locationHelpers";

type TransportationProps = {
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

const Transportation = ({
  surveyData,
  setSurveyData,
  surveyEmissions,
  setSurveyEmissions,
  selectedLocation,
  onNext,
}: TransportationProps) => {
  const isMetric = selectedLocation?.unitSystem === "metric";
  const distanceUnit = isMetric ? "km" : "miles";

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate emissions whenever survey data changes
  useEffect(() => {
    let flightEmissions = 0;
    let carEmissions = 0;
    let publicTransportEmissions = 0;

    // Flight emissions
    if (surveyData.longFlights) {
      flightEmissions += surveyData.longFlights * 1.35;
    }
    if (surveyData.shortFlights) {
      flightEmissions += surveyData.shortFlights * 0.9;
    }

    // Car emissions
    if (surveyData.carType && surveyData.carType !== "None" && surveyData.milesPerWeek) {
      const carEmissionRates = {
        "Gas ⛽️": 300,
        "Hybrid ⛽️&⚡": 250,
        "Electric ⚡": 200,
      }[surveyData.carType] || 300;

      // Convert km to miles for calculation if using metric
      const distanceInMiles = isMetric
        ? kmToMiles(parseFloat(surveyData.milesPerWeek))
        : parseFloat(surveyData.milesPerWeek);

      carEmissions = (carEmissionRates * distanceInMiles * 52) / 1000000;
    }

    // Public transport emissions
    if (surveyData.useTrain === "Yes" && surveyData.trainFrequency) {
      publicTransportEmissions += parseFloat(surveyData.trainFrequency) * 0.002912 * 52;
    }
    if (surveyData.useBus === "Yes" && surveyData.busFrequency) {
      publicTransportEmissions += parseFloat(surveyData.busFrequency) * 0.005824 * 52;
    }

    setSurveyEmissions({
      ...surveyEmissions,
      flightEmissions,
      carEmissions,
      publicTransportEmissions,
      transportationEmissions: flightEmissions + carEmissions + publicTransportEmissions,
    });
  }, [surveyData, isMetric]);

  const isValid =
    surveyData.longFlights !== undefined &&
    surveyData.shortFlights !== undefined &&
    surveyData.carType !== "" &&
    surveyData.milesPerWeek !== "" &&
    surveyData.useTrain !== "" &&
    surveyData.useBus !== "" &&
    surveyData.walkBike !== "";

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="max-w-4xl mx-auto pt-8"
    >
      {/* Page Header */}
      <motion.div variants={fadeUp} className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mb-2 mt-4 shadow-lg">
          <Car className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Transportation Emissions
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's calculate your transportation emissions! Answer these questions about how you get around.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="shadow-md border-2 border-blue-300">
          <CardContent className="space-y-6">
          <QuestionSlider
            question="In the last year, how many long round-trip flights have you been on? (more than 10 hours round trip) ✈️"
            value={surveyData.longFlights || 0}
            onChange={(value) => setSurveyData({ ...surveyData, longFlights: value })}
            minimumValue={0}
            maximumValue={7}
            useColoredSlider={true}
          />

          <QuestionSlider
            question="In the last year, how many short round-trip flights have you been on? (less than 10 hours round trip) ✈️"
            value={surveyData.shortFlights || 0}
            onChange={(value) => setSurveyData({ ...surveyData, shortFlights: value })}
            minimumValue={0}
            maximumValue={7}
            useColoredSlider={true}
          />

          <RadioButtonGroup
            question="What type of car do you drive? 🚗"
            options={["Gas ⛽️", "Hybrid ⛽️&⚡", "Electric ⚡", "None"]}
            value={surveyData.carType || "None"}
            onChange={(value) =>
              setSurveyData({
                ...surveyData,
                carType: value,
                milesPerWeek: value === "None" ? "0" : surveyData.milesPerWeek,
              })
            }
          />

          {surveyData.carType && surveyData.carType !== "None" && (
            <NumberInput
              question={`How many ${distanceUnit} do you drive per week? 🛞`}
              value={surveyData.milesPerWeek || ""}
              onChange={(value) => setSurveyData({ ...surveyData, milesPerWeek: value })}
              label={`${distanceUnit} per week`}
              maxValue={isMetric ? 10000 : 6000}
            />
          )}

          <RadioButtonGroup
            question="Do you use the train/metro? 🚉"
            options={["Yes", "No"]}
            value={surveyData.useTrain || "No"}
            onChange={(value) => setSurveyData({ ...surveyData, useTrain: value })}
          />

          {surveyData.useTrain === "Yes" && (
            <NumberInput
              question={`How many ${distanceUnit} per week on train/metro?`}
              value={surveyData.trainFrequency || ""}
              onChange={(value) => setSurveyData({ ...surveyData, trainFrequency: value })}
              label={`${distanceUnit} per week`}
              maxValue={isMetric ? 800 : 500}
            />
          )}

          <RadioButtonGroup
            question="Do you use the bus? 🚌"
            options={["Yes", "No"]}
            value={surveyData.useBus || "No"}
            onChange={(value) => setSurveyData({ ...surveyData, useBus: value })}
          />

          {surveyData.useBus === "Yes" && (
            <NumberInput
              question={`How many ${distanceUnit} per week on bus?`}
              value={surveyData.busFrequency || ""}
              onChange={(value) => setSurveyData({ ...surveyData, busFrequency: value })}
              label={`${distanceUnit} per week`}
              maxValue={isMetric ? 800 : 500}
            />
          )}

          <RadioButtonGroup
            question="Do you walk/bike as a form of transportation? 🚲"
            options={["Yes", "No"]}
            value={surveyData.walkBike || "No"}
            onChange={(value) => setSurveyData({ ...surveyData, walkBike: value })}
          />

          <div className="border-t pt-6 mt-6">
            <h3 className="text-2xl font-bold text-center mb-4">Your Transportation Breakdown:</h3>
            <div className="space-y-3 bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-lg border border-blue-300">
              <div className="flex justify-between text-base">
                <span>Flight Emissions:</span>
                <span className="font-semibold">{surveyEmissions.flightEmissions?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Car Emissions:</span>
                <span className="font-semibold">{surveyEmissions.carEmissions?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Public Transport:</span>
                <span className="font-semibold">{surveyEmissions.publicTransportEmissions?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-blue-300 pt-3 mt-3">
                <span>Total:</span>
                <span>{surveyEmissions.transportationEmissions?.toFixed(2)} tons of CO₂ per year</span>
              </div>
            </div>
          </div>

          <Button onClick={onNext} disabled={!isValid} variant="hero" className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all" size="lg">
            Continue to Diet →
          </Button>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
};

export default Transportation;
