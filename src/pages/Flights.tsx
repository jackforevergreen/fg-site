import F1 from "@/assets/f1.png";
import F2 from "@/assets/f2.jpg";
import F3 from "@/assets/f3.png";
import Navigation from "@/components/Navigation";
import LoginModal from "@/components/auth/LoginModal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { useState } from "react";

const FlightOffset = () => {
  const { isAuthenticated } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedFlightOption, setSelectedFlightOption] =
    useState<string>("10");

  // Manual flight options with payment links
  const flightOptions = [
    {
      value: "10",
      label: "1-8 hours | 1 Credit",
      credits: 1,
      price: 10,
      link: "https://shop.forevergreen.earth/b/9AQ3ege1o2Q34aQ7sz",
    },
    {
      value: "20",
      label: "9-16 hours | 2 Credits",
      credits: 2,
      price: 20,
      link: "https://shop.forevergreen.earth/b/6oE9CE0ayaivcHm7sA",
    },
    {
      value: "30",
      label: "17-24 hours | 3 Credits",
      credits: 3,
      price: 30,
      link: "https://shop.forevergreen.earth/b/dR63egg9wbmz0YE3cl",
    },
    {
      value: "40",
      label: "25-32 hours | 4 Credits",
      credits: 4,
      price: 40,
      link: "https://shop.forevergreen.earth/b/14kaGI1eC8ancHm9AK",
    },
    {
      value: "50",
      label: "33-40 hours | 5 Credits",
      credits: 5,
      price: 50,
      link: "https://shop.forevergreen.earth/b/8wMdSUbTggGT36MfZ9",
    },
    {
      value: "60",
      label: "41-48 hours | 6 Credits",
      credits: 6,
      price: 60,
      link: "https://shop.forevergreen.earth/b/fZe8yA3mKcqDePubIU",
    },
    {
      value: "70",
      label: "49-56 hours | 7 Credits",
      credits: 7,
      price: 70,
      link: "https://shop.forevergreen.earth/b/4gweWY9L862fcHm4gt",
    },
    {
      value: "80",
      label: "57-64 hours | 8 Credits",
      credits: 8,
      price: 80,
      link: "https://shop.forevergreen.earth/b/eVa5mo7D00HV8r6fZc",
    },
    {
      value: "90",
      label: "65-72 hours | 9 Credits",
      credits: 9,
      price: 90,
      link: "https://shop.forevergreen.earth/b/dR6eWY7D0fCPePu00f",
    },
    {
      value: "100",
      label: "73-80 hours | 10 Credits",
      credits: 10,
      price: 100,
      link: "https://shop.forevergreen.earth/b/5kA5mo1eCaivazedR6",
    },
    {
      value: "110",
      label: "81-89 hours | 11 Credits",
      credits: 11,
      price: 110,
      link: "https://shop.forevergreen.earth/b/bIY3eg5uSeyLcHm6oF",
    },
    {
      value: "120",
      label: "90-96 hours | 12 Credits",
      credits: 12,
      price: 120,
      link: "https://shop.forevergreen.earth/b/4gw7uw8H4cqD4aQ6oG",
    },
    {
      value: "130",
      label: "97-100 hours | 13 Credits",
      credits: 13,
      price: 130,
      link: "https://shop.forevergreen.earth/b/aEU1688H44YbbDidR9",
    },
  ];

  const selectedOption = flightOptions.find(
    (opt) => opt.value === selectedFlightOption
  );

  const handleBuyClick = () => {
    if (selectedOption) {
      window.location.href = selectedOption.link;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Plane className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-foreground"
          >
            Flying Can Be Green
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
          >
            When you buy carbon offsets from Forevergreen, you're not just
            balancing your carbon footprint. You're also supporting projects
            that actively reduce emissions while creating jobs in local
            communities.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => {
              const offsetSection =
                document.getElementById("flight-calculator");
              offsetSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 rounded-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 font-medium"
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Hero Images - Three images in a row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16"
        >
          <div className="rounded-2xl overflow-hidden shadow-lg group h-64">
            <img
              src={F1}
              alt="Traveler overlooking nature after flying"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg group h-64">
            <img
              src={F2}
              alt="Travelers walking through airport terminal"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg group h-64">
            <img
              src={F3}
              alt="Traveler with luggage in lush destination"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </motion.div>

        {/* Flight Calculator Section */}
        <motion.div
          id="flight-calculator"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Info */}
            <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
              <Plane className="w-12 h-12 text-blue-500 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Travel knowing you are doing your part.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Taking a flight and want to offset it with certified carbon
                offsets? Simply select the length of your most recent flight to
                make an impact and receive a certificate of Carbon Offset!
              </p>
            </div>

            {/* Right: Calculator/Product */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  Number of Hours Flown:
                </h3>
                <Select
                  value={selectedFlightOption}
                  onValueChange={setSelectedFlightOption}
                >
                  <SelectTrigger className="w-full text-lg py-6 mb-6">
                    <SelectValue placeholder="Select flight duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {flightOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-lg py-3"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-center">
                  <div className="inline-block mb-6">
                    <img
                      src="/src/assets/flight-offset.png"
                      alt="Flight Offset"
                      className="w-48 h-48 mx-auto object-contain"
                    />
                  </div>

                  <h4 className="text-xl font-bold mb-2 text-foreground">
                    Flight Offset
                  </h4>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    ${selectedOption?.price || 0}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {selectedOption?.credits || 0} carbon credit
                    {(selectedOption?.credits || 0) > 1 ? "s" : ""}
                  </p>

                  <button
                    onClick={handleBuyClick}
                    className="w-full px-8 py-4 bg-black text-white rounded-lg hover:bg-black/90 transition-colors duration-300 font-bold text-lg"
                  >
                    Buy
                  </button>

                  <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                    We calculate the CO2 of 1 flight based on the average flight
                    emitting 0.43 lbs of CO2e per passenger mile and the average
                    plane flying 570 mph.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign-in prompt for non-authenticated users */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 p-6 bg-gradient-to-r from-blue-50 to-green-50 border border-green-200 rounded-lg text-center max-w-4xl mx-auto"
          >
            <p className="text-gray-700 mb-2 font-semibold">
              Want to track your carbon offset journey?
            </p>
            <p className="text-muted-foreground mb-4">
              Sign in to save your purchases, track your impact, and access
              exclusive features. Or continue as a guest!
            </p>
            <button
              onClick={() => setLoginModalOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg font-bold transition-all duration-300"
            >
              Sign In
            </button>
          </motion.div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export default FlightOffset;
