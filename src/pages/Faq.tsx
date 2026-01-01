import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const Faq = () => {
  const transactionSteps = [
    {
      id: 1,
      type: "customer",
      icon: "👤",
      title: "Customer",
      description:
        "A customer browses our platform and selects and purchases a carbon credit.",
      isLeft: true,
    },
    {
      id: 2,
      type: "forevergreen",
      icon: "🌲",
      title: "Forevergreen",
      description:
        "With the proceeds from the purchase, we source the credit from reputable, verified developers. In exchange, we take a small fee.",
      isLeft: false,
    },
    {
      id: 3,
      type: "developer",
      icon: "👷",
      title: "Developer",
      description:
        "The developer sells carbon credits to Forevergreen to fund the carbon offset or sequestration project they are working on. These projects are only feasible with the revenue from the sale of carbon credits.",
      isLeft: true,
    },
    {
      id: 4,
      type: "forevergreen",
      icon: "🌲",
      title: "Forevergreen",
      description:
        "We receive and retire the carbon credits from the developer on behalf of our customers.",
      isLeft: false,
    },
    {
      id: 5,
      type: "customer",
      icon: "👤",
      title: "Customer",
      description:
        "The customer receives a voluntary certificate of retirement (offset) for the carbon credits purchased.",
      isLeft: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions about Forevergreen
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What is a Carbon Credit?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                A carbon credit is a tradable certificate representing the
                reduction or removal of one metric ton of carbon dioxide
                equivalent (CO2e) from the atmosphere. These credits are
                generated through verified projects that reduce, avoid, or
                sequester emissions, such as reforestation, renewable energy, or
                energy efficiency projects. By purchasing a carbon credit, you
                can offset your own carbon emissions and contribute to global
                efforts to combat climate change.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Why Should I Buy a Carbon Credit?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Purchasing carbon credits allows you to take responsibility for
                your carbon footprint by supporting projects that reduce or
                remove CO2 from the atmosphere. It's a way to mitigate the
                environmental impact of your activities, contribute to
                sustainability efforts, and support the transition to a
                low-carbon economy. Buying carbon credits also helps fund
                crucial environmental projects that might not otherwise be
                financially viable.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How Do You Track The Projects?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Forevergreen partners with projects that are verified by
                independent third-party organizations like Verra and Gold
                Standard. These organizations conduct regular audits and monitor
                the projects to ensure they meet their emissions reduction
                goals. We provide transparency by sharing detailed information
                about each project, including its location, impact, and
                verification status, so you can see exactly how your carbon
                credits are making a difference.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Why Do You Retire the Carbon Credit?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                We retire carbon credits to ensure they are used only once and
                cannot be resold. Retirement of a carbon credit means it is
                permanently removed from circulation, guaranteeing that the
                offset has been claimed and the associated emissions have been
                compensated. This process ensures the integrity of the carbon
                offset market and assures that your contribution is having the
                intended environmental impact.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Why Did You Pick These Projects?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Forevergreen selects projects based on their environmental
                impact, additionality, and co-benefits to local communities and
                ecosystems. We prioritize projects that are rigorously verified,
                have a proven track record, and align with our mission of
                promoting sustainability and reducing global carbon emissions.
                Each project is carefully vetted to ensure it contributes
                meaningfully to combating climate change and supports the
                broader goals of environmental stewardship.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What Do I Get When I Buy a Carbon Credit?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                When you buy a carbon credit from Forevergreen, you're directly
                contributing to the reduction of greenhouse gasses, with each
                credit representing one metric ton of carbon dioxide (CO2) or
                its equivalent that has been removed or avoided through our
                projects. Your purchase also supports additional benefits like
                protecting biodiversity, enhancing ecosystems, and helping local
                communities. Forevergreen takes care of retiring the carbon
                credit on your behalf, ensuring it is permanently taken out of
                circulation, so you can be confident that your contribution is
                making a lasting difference.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Why is Forevergreen Selling Carbon Credits? How Does
                Forevergreen Benefit From This?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Forevergreen sells carbon credits to provide individuals and
                organizations with a practical way to offset their carbon
                emissions and contribute to global sustainability efforts. By
                facilitating the purchase of high-quality, verified carbon
                credits, we help fund essential environmental projects.
                Forevergreen benefits by taking a small fee from the sale of
                these credits, which allows us to continue our mission of
                promoting sustainability, expanding our impact, and supporting
                more projects that align with our values. This approach helps us
                create a sustainable business model while contributing
                positively to the environment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How Does Our Calculator Work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p className="mb-3">
                  Click the link below for our app's calculator methodology.
                </p>
                <a
                  href="/methodology"
                  className="inline-block w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-6 rounded transition-colors text-center"
                >
                  See Methodology
                </a>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Where Does My Money Go?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p className="mb-3">
                  Click the link below to see how we facilitate transactions.
                </p>
                <a
                  href="#transactions"
                  className="inline-block w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-6 rounded transition-colors text-center"
                >
                  See More
                </a>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* Transaction Flow Section */}
        <motion.div
          id="transactions"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center">
            How We Facilitate Transactions:
          </h2>

          <div className="max-w-3xl mx-auto space-y-0">
            {transactionSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Content Card */}
                <motion.div
                  className="bg-green-700 text-white rounded-3xl p-8 shadow-xl mb-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl flex-shrink-0"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-bold">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-white/95 text-lg leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>

                {/* Arrow pointing straight down - directly below each card */}
                {index < transactionSteps.length - 1 && (
                  <motion.div
                    className="flex justify-center mb-4"
                    initial={{ opacity: 0.6 }}
                    whileInView={{ opacity: 1 }}
                    animate={{
                      y: [0, 5, 0],
                    }}
                    transition={{
                      y: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      className="text-gray-400"
                    >
                      {/* Straight down arrow */}
                      <line
                        x1="30"
                        y1="5"
                        x2="30"
                        y2="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      {/* Arrow head */}
                      <polyline
                        points="20,35 30,45 40,35"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Faq;
