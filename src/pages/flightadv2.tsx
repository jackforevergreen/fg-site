import flightOffset from "@/assets/flight-offset.png";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const trustPills = [
  "1 credit = 1 tonne CO₂",
  "Certificate within 24 hours",
  "No account needed",
  "Secure Stripe checkout",
];

const FlightOffsetHero = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-green-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green-400/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
      >
        ✈️ Flight Carbon Offset
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-6xl font-bold leading-tight mb-5 bg-gradient-to-r from-green-800 via-green-600 to-green-400 bg-clip-text text-transparent max-w-2xl mx-auto"
      >
        Offset your flight emissions
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex justify-center mb-6"
      >
        <img
          src={flightOffset}
          alt="Flight offset credit"
          className="h-24 w-24 object-contain animate-float drop-shadow-lg"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-8"
      >
        <span className="text-xl font-medium block mb-2">
          Flying is one of the largest impacts a person can make.
        </span>
        <span className="text-base italic block">
          For a fraction of the price of your ticket, support impactful projects
          and fly carbon neutral.
        </span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {trustPills.map((pill) => (
          <span
            key={pill}
            className="flex items-center gap-1.5 bg-white border border-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm"
          >
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            {pill}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default FlightOffsetHero;
