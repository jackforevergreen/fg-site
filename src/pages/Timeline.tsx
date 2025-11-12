import { motion } from "framer-motion";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Sprout, Leaf, TreeDeciduous, Trees } from "lucide-react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  stage: "seed" | "sprout" | "growing" | "mature";
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "2020",
    title: "The Seed",
    description: "Forevergreen was founded with a vision to make carbon offsetting accessible and transparent for everyone.",
    stage: "seed"
  },
  {
    year: "2021",
    title: "First Sprout",
    description: "Launched our first carbon credit marketplace, partnering with verified environmental projects worldwide.",
    stage: "sprout"
  },
  {
    year: "2022",
    title: "Growing Strong",
    description: "Reached 10,000+ active users and offset over 100,000 tons of CO₂. Expanded to 15 countries.",
    stage: "growing"
  },
  {
    year: "2023",
    title: "Flourishing Forest",
    description: "Launched subscription service and mobile app. Community offsets surpass 500,000 tons of CO₂.",
    stage: "mature"
  },
  {
    year: "2024",
    title: "Global Impact",
    description: "Partnership with major corporations, carbon calculator launched, 1 million tons CO₂ offset milestone.",
    stage: "mature"
  }
];

const plantIcons = {
  seed: Sprout,
  sprout: Leaf,
  growing: TreeDeciduous,
  mature: Trees
};

const Timeline = () => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Our Growth Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how Forevergreen has grown from a small seed into a thriving forest of environmental change
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line - Desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-200 via-green-400 to-green-600" />

          {/* Timeline Events */}
          <div className="space-y-12 md:space-y-24">
            {timelineEvents.map((event, index) => {
              const Icon = plantIcons[event.stage];
              const isLeft = index % 2 === 0;
              const isSelected = selectedEvent === index;

              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    isLeft ? "md:flex-row-reverse" : "md:flex-row"
                  } flex-col md:gap-8`}
                >
                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ${isLeft ? "md:text-right" : "md:text-left"} text-center`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedEvent(isSelected ? null : index)}
                      className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-green-500/20 to-green-600/20 shadow-xl border-2 border-green-500"
                          : "bg-card shadow-lg hover:shadow-xl border-2 border-transparent"
                      }`}
                    >
                      <div className="text-sm font-bold text-green-600 mb-2">{event.year}</div>
                      <h3 className="text-2xl font-bold mb-3 text-foreground">{event.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{event.description}</p>
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
                        event.stage === "seed" ? "bg-green-100" :
                        event.stage === "sprout" ? "bg-green-200" :
                        event.stage === "growing" ? "bg-green-400" :
                        "bg-green-600"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 md:w-10 md:h-10 ${
                          event.stage === "mature" ? "text-white" : "text-green-700"
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
            { label: "Years of Impact", value: "5+" },
            { label: "CO₂ Offset", value: "1M+ tons" },
            { label: "Global Community", value: "50K+ users" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20"
            >
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Timeline;
