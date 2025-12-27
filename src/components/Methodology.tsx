import Diet from "@/assets/d1.png";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";

const Methodology = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      {/* Hero Section (About-style) */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Carbon Calculator Methodology
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            A transparent breakdown of how Forevergreen estimates emissions
            across transportation, diet, and utilities using published
            coefficients and conservative assumptions.
          </p>
        </motion.div>
      </div>

      {/* Content Sections */}
      <div className="bg-white">
        {/* Transportation Calculations */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                  Transportation Calculations
                </h2>

                <div className="mb-12 p-6 bg-muted/30 rounded-xl">
                  <p className="text-lg italic text-center">
                    Transportation Emissions = Flight Emissions + Car Emissions
                    + Public Transport Emissions
                  </p>
                </div>

                {/* Flight Emissions */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">✈️</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-green-700">
                      Flight Emissions
                    </h3>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Forevergreen uses the amount of long and short flights as
                    the two inputs for calculating the emissions attributed to a
                    passenger on a typical commercial flight. Short flights are
                    classified as less than 10 hours, whereas long flights are
                    more than 10 hours. The calculator multiplies the number of
                    short flights by a coefficient of .9 and long flights by
                    1.35, as provided by C Level Carbon Consultancy.
                  </p>

                  <div className="p-6 bg-muted/30 rounded-xl">
                    <p className="text-lg italic text-center">
                      Flight Emissions = (1.35 * # of Long Flight) + (0.9 * # of
                      Short Flights)
                    </p>
                  </div>
                </div>

                {/* Car Emissions */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">🚗</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-green-700">
                      Car Emissions
                    </h3>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Forevergreen uses car type and the distance driven in miles
                    each week to calculate the emissions attributed to a
                    person's car. The calculator multiplies the miles driven per
                    week by a coefficient based on the emissions of the selected
                    car type. Gas car's coefficient is 300 (signifying 300g of
                    Co2 emissions per mile), while hybrids are 250 and electric
                    vehicles are 200, as provided by MITClimatePortal. The
                    user's weekly input is annualized and converted from grams
                    of Co2 to Tons.
                  </p>

                  <div className="p-6 bg-muted/30 rounded-xl">
                    <p className="text-lg italic text-center">
                      Car Emissions = ((Car Type * Miles Per Week) * 52) * 1e^6
                    </p>
                  </div>
                </div>

                {/* Public Transport Emissions */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">🚆</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-green-700">
                      Public Transport Emissions
                    </h3>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Forevergreen uses the amount of weekly bus and train rides
                    as the two inputs to calculate the emissions attributed to
                    public transit use. The calculator multiplies the average
                    distance of a public transit ride, 5.6 miles, by the kg
                    CO2/passenger mile each emits. For rail travel, this
                    coefficient is 0.02912. For bus rides, this is 0.05824 as
                    provided by the ATPA and US Department of Transportation
                    F.R.A The sum of these two numbers is a user's total public
                    transportation emissions.
                  </p>

                  <div className="p-6 bg-muted/30 rounded-xl">
                    <p className="text-lg italic text-center">
                      Public Transport Emissions = ((Train Rides Per Week *
                      0.02912) + (Bus Rides Per Wek * 0.05824)
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Diet Calculations (image-only, styled like the others) */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Header matches other sections */}
                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                  Diet Calculations
                </h2>

                {/* Diet Explanation */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">🍖</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-green-700">
                      Meat Consumption
                    </h3>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Forevergreen uses the input of diet type to calculate the
                    user’s diet emissions. The largest source of dietary
                    emissions comes from meat consumption. The average diet is
                    responsible for 2.5 tons of Co2 per year, with it fluctuates
                    depending on the amount of meat consumed, with numbers
                    provided by Shrink That Footprint
                  </p>
                </div>

                {/* Smaller, centered image card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden mx-auto max-w-3xl"
                >
                  <img
                    src={Diet}
                    alt="Diet calculations"
                    className="w-full h-auto block"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Utility Calculations */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                  Utility Calculations
                </h2>

                <div className="mb-12 p-6 bg-muted/30 rounded-xl">
                  <p className="text-lg italic text-center">
                    Utility Emissions = (Energy Emissions + Water Emissions +
                    Propane + Natural Gas Emissions) / Household Members
                  </p>
                </div>

                {/* Energy Emissions */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">⚡</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-green-700">
                      Energy Emissions
                    </h3>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Forevergreen uses the state of residence and energy bill
                    cost as the two inputs for calculating the emissions
                    attributed to energy usage. The state of residence
                    GRIDValue, provided by the EPA, is then divided by 2000 to
                    convert this number from lb/MWh to tons/MWh. This is then
                    multiplied by the Energy usage factor, calculated by
                    dividing the user's electric bill cost by the average cost
                    in the state provided by Save on Energy.
                  </p>

                  <div className="p-6 bg-muted/30 rounded-xl">
                    <p className="text-lg italic text-center">
                      Electricity Emissions = State eGRID Value * Energy Usage
                      Factor
                    </p>
                  </div>
                </div>

                {/* Water Emissions */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">💧</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-green-700">
                      Water Emissions
                    </h3>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Forevergreen uses the state of residence and the water bill
                    cost as the two inputs for calculating the emissions
                    attributed to energy usage. The user's water bill is divided
                    by their state average to find their water usage factor. The
                    usage factor is multiplied by a coefficient of .0052, the
                    emissions attributed to the average water bill. Forbes
                    provides the information on the average bill, and emissions
                    data is available on Brightest.io.
                  </p>

                  <div className="p-6 bg-muted/30 rounded-xl">
                    <p className="text-lg italic text-center">
                      Water Emissions = (Water Bill / Average State Bill) *
                      0.0052
                    </p>
                  </div>
                </div>

                {/* Propane & CNG Emissions */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">🛢️</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-green-700">
                      Propane & CNG Emissions
                    </h3>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Forevergreen uses the state of residence and cost of propane
                    & CNG bills as the three inputs for calculating the
                    emissions attributed to gas usage. To find their usage
                    factor, the user's Propane & CNG bills are divided by their
                    state average. The usage factor for Propane is multiplied by
                    a coefficient of .24, as provided by Forbes, and CNG is
                    multiplied by a coefficient of 2.12, as provided by Forbes.
                    These coefficients are determined as the emissions
                    attributed to the average state bill.
                  </p>

                  <div className="p-6 bg-muted/30 rounded-xl">
                    <p className="text-lg italic text-center mb-2">
                      Propane & CNG Emissions =
                    </p>
                    <p className="text-lg italic text-center">
                      (Propane Bill / Average State Bill * .24) + (CNG Bill /
                      Average State Bill *2.12)
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Methodology;
