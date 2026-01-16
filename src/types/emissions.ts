import { Timestamp } from "firebase/firestore";

export interface SurveyData {
  // Location
  country?: string;
  state?: string;

  // Transportation Data
  longFlights?: number;
  shortFlights?: number;
  carType?: string;
  milesPerWeek?: string;
  useTrain?: string;
  trainFrequency?: string;
  useBus?: string;
  busFrequency?: string;
  walkBike?: string;
  walkBikeFrequency?: string;

  // Diet Data
  diet?: string;

  // Energy Data
  electricBill?: string;
  waterBill?: string;
  propaneBill?: string;
  gasBill?: string;
  useWoodStove?: string;
  peopleInHome?: number;
}

export interface SurveyEmissions {
  // Transportation Emissions
  flightEmissions?: number;
  carEmissions?: number;
  publicTransportEmissions?: number;
  transportationEmissions?: number;

  // Diet Emissions
  dietEmissions?: number;

  // Energy Emissions
  electricEmissions?: number;
  waterEmissions?: number;
  otherEnergyEmissions?: number;
  energyEmissions?: number;

  // Total
  totalEmissions?: number;
  monthlyEmissions?: number;
}

export interface EmissionsDocument {
  surveyData: SurveyData;
  surveyEmissions: SurveyEmissions;
  totalEmissions: number;
  monthlyEmissions: number;
  totalOffset?: number;
  lastUpdated: Timestamp;
}

export interface CommunityEmissionsData {
  emissions_calculated: number;
  emissions_offset: number;
  organic_reductions?: number;  // ← ADD THIS LINE
  last_updated: Date;
}

export type EmissionGroup = "Transportation" | "Diet" | "Energy";
