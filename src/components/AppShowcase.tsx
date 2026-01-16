// components/ClimateHero.tsx
import appStoreBadge from "@/assets/app-store.svg";
import Phone from "@/assets/phone.png";

import { fetchCommunityEmissionsData } from "@/api/emissions";
import { CommunityEmissionsData } from "@/types/emissions";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Calendar, Leaf, Star } from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  {
    icon: BarChart3,
    title: "Calculate Your Footprint",
    description: "Real-time monitoring of your environmental impact.",
  },
  {
    icon: Calendar,
    title: "Track Over Time",
    description: "Detailed insights and progress analytics.",
  },
  {
    icon: Leaf,
    title: "Offset to Reach Net-Zero",
    description: "One-tap carbon credit purchases.",
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toFixed(0);
}

// Stat card that flips between value and impact
function ImpactCard({
  value,
  label,
  subtitle,
  gradient,
  impactValue,
  impactLabel,
  impactIcon,
}: {
  value: string;
  label: string;
  subtitle: string;
  gradient: string;
  impactValue: string;
  impactLabel: string;
  impactIcon: string;
}) {
  const [showImpact, setShowImpact] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowImpact((prev) => !prev);
    }, 3000); // Toggle every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={`rounded-2xl border border-border ${gradient} p-6 text-center hover:shadow-xl transition-all duration-300 relative overflow-hidden h-[180px] flex flex-col justify-center items-center`}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <AnimatePresence mode="wait">
        {!showImpact ? (
          <motion.div
            key="stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="mb-2 text-4xl md:text-5xl font-bold text-green-700">
              {value}
            </div>
            <div className="text-sm font-medium text-green-800">{label}</div>
            <div className="mt-2 text-xs text-green-600">{subtitle}</div>
          </motion.div>
        ) : (
          <motion.div
            key="impact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="text-3xl mb-2">{impactIcon}</div>
            <div className="mb-2 text-4xl md:text-5xl font-bold text-gray-800">
              {impactValue}
            </div>
            <div className="text-sm font-medium text-gray-700 px-2">
              {impactLabel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ClimateHero() {
  const [stats, setStats] = useState<CommunityEmissionsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchCommunityEmissionsData();
        setStats(data);
      } catch (error) {
        console.error("Error loading community emissions stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* LEFT: Copy + Reviews + (Mobile phone) + How it works */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              Reduce your <span className="text-primary">Carbon Footprint</span>{" "}
              On Your Phone
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Track emissions, get insights, and offset without the complexity.
            </p>

            {/* Reviews + App Store badge */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 text-foreground">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-current text-yellow-400"
                  />
                ))}
                <span className="ml-2 text-lg font-semibold">5.0</span>
                <span className="text-muted-foreground">• 25 Ratings</span>
              </div>

              <motion.a
                href="https://apps.apple.com/us/app/forevergreen-app/id6578432563"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
                aria-label="Download on the App Store"
                data-analytics-event="app-download"
                data-analytics-source="app-store-badge"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  src={appStoreBadge}
                  alt="Download on the App Store"
                  className="h-12 md:h-14 w-auto select-none transition-all duration-300 hover:shadow-lg"
                  draggable={false}
                  whileHover={{
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                />
              </motion.a>
            </div>

            {/* MOBILE-ONLY PHONE (sits above How it works) */}
            <motion.div
              className="mt-8 block lg:hidden relative flex justify-center"
              animate={{ y: [0, -8, 0], rotate: [0, 1.2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              <img
                src={Phone}
                alt=""
                className="w-full max-w-[420px] h-auto"
                draggable={false}
              />
            </motion.div>

            {/* How it works */}
            <h3 className="mt-10 mb-4 text-lg font-semibold text-foreground">
              How it works
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card/60 p-4 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="mx-auto mb-3 w-10 h-10 rounded-lg bg-accent/40 flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {f.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {f.description}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* DESKTOP PHONE (stays on the right) */}
          <motion.div
            className="relative hidden lg:flex justify-center"
            animate={{ y: [0, -10, 0], rotate: [0, 1.2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={Phone}
              alt="Forevergreen App Interface"
              className="w-full max-w-[560px] h-auto"
              draggable={false}
            />
          </motion.div>
        </div>

        {/* Emissions Stats Section - Cards that flip to show impact */}
        {stats && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-16 max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Emissions Calculated → Trees */}
              <ImpactCard
                value={formatNumber(stats.emissions_calculated)}
                label="Tons of CO₂ Calculated"
                subtitle="Community Impact"
                gradient="bg-gradient-to-br from-green-50 to-emerald-50"
                impactValue={formatNumber(
                  Math.round(stats.emissions_calculated * 16)
                )}
                impactLabel="trees worth of CO₂"
                impactIcon="🌳"
              />

              {/* Card 2: Emissions Offset → Cars off the road */}
              <ImpactCard
                value={formatNumber(stats.emissions_offset)}
                label="Tons of CO₂ Offset"
                subtitle="Carbon Credits"
                gradient="bg-gradient-to-br from-blue-50 to-cyan-50"
                impactValue={formatNumber(
                  Math.round(stats.emissions_offset * 0.22)
                )}
                impactLabel="cars off the road for 1 year"
                impactIcon="🚗"
              />

              {/* Card 3: Organic Reductions → Flights */}
              {stats.organic_reductions && stats.organic_reductions > 0 && (
                <ImpactCard
                  value={formatNumber(stats.organic_reductions)}
                  label="Tons of CO₂ Reduced"
                  subtitle="Behavior Change 🌱"
                  gradient="bg-gradient-to-br from-purple-50 to-pink-50"
                  impactValue={Math.round(stats.organic_reductions).toString()}
                  impactLabel="round-trip flights saved"
                  impactIcon="✈️"
                />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
