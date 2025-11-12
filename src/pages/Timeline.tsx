import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import {
  Calculator,
  Leaf,
  LeafIcon,
  Lightbulb,
  Sprout,
  TreeDeciduous,
  Trees,
  TreePine,
  Flower,
  Flower2,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  stage: "seed" | "sprout" | "growing" | "mature";
  icon: LucideIcon;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "2023",
    title: "Forevergreen is Born",
    description:
      "October 10, 2023 — Forevergreen was born with a mission to make sustainability simple and accessible for everyone.",
    stage: "seed",
    icon: Sprout,
  },
  {
    year: "2023",
    title: "First Funding",
    description:
      "November 2023 — Forevergreen wins the Kuzneski Cup at Pitt's Big Idea competition, marking its first major recognition.",
    stage: "sprout",
    icon: Leaf,
  },
  {
    year: "2023",
    title: "First Footprint Calculated",
    description:
      "December 2023 — Forevergreen calculates its first user's carbon footprint, taking the first step toward measurable impact.",
    stage: "sprout",
    icon: Flower,
  },
  {
    year: "2024",
    title: "First Consumer Offset",
    description:
      "July 3, 2024 — Forevergreen offsets its first customer's emissions, turning vision into real-world climate action.",
    stage: "growing",
    icon: Flower2,
  },
  {
    year: "2025",
    title: "100k on Instagram",
    description:
      "February 24, 2025 — Forevergreen hits 100,000 followers on Instagram, building one of the largest sustainability communities online.",
    stage: "growing",
    icon: TreeDeciduous,
  },
  {
    year: "2025",
    title: "IOS App Launch",
    description:
      "March 2025 — The Forevergreen app goes live on the iOS App Store, empowering users to track and reduce their footprints.",
    stage: "mature",
    icon: TreePine,
  },
  {
    year: "2025",
    title: "100K on YouTube",
    description:
      "July 2025 — Forevergreen reaches 100,000 subscribers on YouTube, expanding its educational mission globally.",
    stage: "mature",
    icon: Trees,
  },
];

const About = () => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const features = [
    {
      number: "01",
      icon: Lightbulb,
      title: "Spread Awareness",
      description:
        "We want to spread awareness about our environmental impact. We believe that the more you know, the more you care. We want to enable people to take action.",
    },
    {
      number: "02",
      icon: Calculator,
      title: "Understand Your Impact",
      description:
        "Our goal is to make it as easy as possible to understand your carbon footprint. With our calculator you can quickly and accurately understand your personal carbon emissions.",
    },
    {
      number: "03",
      icon: LeafIcon,
      title: "Take Action",
      description:
        "We are on a mission to give people actionable ways to offset their carbon footprint. We provide carbon credits and tree planting subscriptions to offset your emissions and live a net-zero life.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        {/* Our Story Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Our Story
          </h1>

          <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            <p>
              Technology has transformed the way we live, work, and interact.
              While it offers incredible benefits, it also comes with an
              environmental cost. At Forevergreen, we believe that technology
              can be a force for good.
            </p>
            <p className="font-medium text-foreground">
              That's why we created our platform. To help regular people just
              like us offset their impact and change the world for the better.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className="relative"
              >
                {/* Card */}
                <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:shadow-xl">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {feature.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Our Growth Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how Forevergreen has grown from a small seed into a thriving
            forest of environmental change
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line - Desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-200 via-green-400 to-green-600" />

          {/* Timeline Events */}
          <div className="space-y-12 md:space-y-24">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isLeft = index % 2 === 0;
              const isSelected = selectedEvent === index;

              return (
                <motion.div
                  key={`${event.year}-${index}`}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    isLeft ? "md:flex-row-reverse" : "md:flex-row"
                  } flex-col md:gap-8`}
                >
                  {/* Content Card */}
                  <div
                    className={`w-full md:w-5/12 ${
                      isLeft ? "md:text-right" : "md:text-left"
                    } text-center`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setSelectedEvent(isSelected ? null : index)
                      }
                      className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-green-500/20 to-green-600/20 shadow-xl border-2 border-green-500"
                          : "bg-card shadow-lg hover:shadow-xl border-2 border-transparent"
                      }`}
                    >
                      <div className="text-sm font-bold text-green-600 mb-2">
                        {event.year}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-foreground">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Plant Icon in Center */}
                  <motion.div
                    className="relative z-10 flex items-center justify-center my-6 md:my-0"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg ${
                        event.stage === "seed"
                          ? "bg-green-100"
                          : event.stage === "sprout"
                          ? "bg-green-200"
                          : event.stage === "growing"
                          ? "bg-green-400"
                          : "bg-green-600"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 md:w-10 md:h-10 ${
                          event.stage === "mature"
                            ? "text-white"
                            : "text-green-700"
                        }`}
                      />
                    </div>
                  </motion.div>

                  {/* Spacer for layout balance on desktop */}
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { label: "2023", value: "Established" },
            { label: "CO₂ Offset", value: "1M+ tons" },
            { label: "Global Community", value: "500K+ users" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20"
            >
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default About;
