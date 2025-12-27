import Sub from "@/assets/sub.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CreditCard, Plane, Repeat } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import afforestCredit from "@/assets/afforestation-credit.png";
import energyCredit from "@/assets/energy-waste-credit.png";
import flightOffset from "@/assets/flight-offset.png";
import hydroCredit from "@/assets/hydroelectric.png";
import reforestCredit from "@/assets/reforest-credit.png";

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: EASE, delay },
  }),
};

const projects = [
  {
    icon: energyCredit,
    title: "Energy & Waste Credit",
    description:
      "Boosting efficiency and reducing emissions across 10,000+ facilities in Quebec through data-driven sustainability practices.",
  },
  {
    icon: hydroCredit,
    title: "Hydroelectric Power Credit",
    description:
      "Delivering 195MW of zero-emission hydropower to Sulawesi, replacing fossil fuel plants and improving local livelihoods.",
  },
  {
    icon: afforestCredit,
    title: "Afforestation & Reforestation",
    description:
      "Restoring native forests in Colombia’s Eastern Plains to promote biodiversity and sustainable land use.",
  },
  {
    icon: reforestCredit,
    title: "REDD Reforestation Credit",
    description:
      "Protecting tropical forests in Acre, Brazil through REDD+ strategies and community-driven conservation.",
  },
] as const;

export default function OffsetOptionsShowcase() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(
      () => setIdx((i) => (i + 1) % projects.length),
      3500
    );
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused]);

  const current = projects[idx];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Title + Subtitle */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
          >
            Reduce your impact today
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={0.15}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Choose the offset option that fits your lifestyle — subscribe
            monthly, make a one-time purchase, or balance a specific flight.
          </motion.p>
        </motion.div>

        {/* Cards with stagger */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* LEFT */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            custom={0.3}
          >
            <Card className="flex flex-col justify-between p-8 rounded-2xl bg-gradient-to-br from-card to-accent/20 shadow-[var(--shadow-card)] border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 h-[540px]">
              {/* Card Content */}
              <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-forest flex items-center justify-center shadow-[var(--shadow-button)]">
                    <Repeat className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Subscription
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Subscribe monthly to maintain net zero.
                </p>

                <div className="mb-2">
                  <img
                    src={Sub}
                    alt="Subscription icon"
                    className="mx-auto h-24 w-24 md:h-24 md:w-24 object-contain animate-float"
                  />
                </div>

                <h4 className="text-lg font-semibold mb-3 text-center text-foreground">
                  Reach Net Zero
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed text-center mb-6">
                  Offset your remaining emissions through verified carbon credit
                  projects and achieve carbon neutrality.
                </p>
              </div>

              <div className="mt-auto space-y-3">
                <Button
                  variant="primary-action"
                  size="lg"
                  className="w-full rounded-xl py-3 text-lg"
                >
                  Start Subscription
                </Button>
                <div className="h-5 flex items-center justify-center text-xs text-muted-foreground">
                  Billed monthly • Cancel anytime
                </div>
              </div>
            </Card>
          </motion.div>

          {/* MIDDLE */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            custom={0.45}
          >
            <Card
              className="flex flex-col justify-between p-8 text-center rounded-2xl bg-gradient-to-br from-card to-accent/20 shadow-[var(--shadow-card)] border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 h-[540px]"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-forest flex items-center justify-center shadow-[var(--shadow-button)]">
                    <CreditCard className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    One-Time
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Subscribe monthly to maintain net zero.
                </p>

                <div className="mb-2">
                  <img
                    key={idx}
                    src={current.icon}
                    alt={current.title}
                    className="mx-auto h-24 w-24 md:h-24 md:w-24 object-contain animate-float"
                  />
                </div>

                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  {current.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {current.description}
                </p>
              </div>

              <div className="mt-auto space-y-3">
                <Button
                  variant="primary-action"
                  size="lg"
                  className="w-full rounded-xl py-3 text-lg"
                >
                  Offset Now
                </Button>
                <div className="h-5 flex items-center justify-center">
                  <div className="flex justify-center gap-1.5">
                    {projects.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-6 rounded-full ${
                          i === idx ? "bg-foreground" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            custom={0.6}
          >
            <Card className="flex flex-col justify-between p-8 text-center rounded-2xl bg-gradient-to-br from-card to-accent/20 shadow-[var(--shadow-card)] border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 h-[540px]">
              <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-forest flex items-center justify-center shadow-[var(--shadow-button)]">
                    <Plane className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Flight Offsets
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Offset your flight's carbon footprint.
                </p>

                <div className="mb-2">
                  <img
                    src={flightOffset}
                    alt="Flight offsets icon"
                    className="mx-auto h-24 w-24 md:h-24 md:w-24 object-contain animate-float"
                  />
                </div>

                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Fly Green
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Offset your remaining emissions through verified carbon credit
                  projects and achieve carbon neutrality.
                </p>
              </div>

              <div className="mt-auto space-y-3">
                <Button
                  variant="primary-action"
                  size="lg"
                  className="w-full rounded-xl py-3 text-lg"
                  onClick={() => navigate("/flights")}
                >
                  Offset This Flight
                </Button>
                {/* Same fixed height as others */}
                <div className="h-5 flex items-center justify-center text-xs text-muted-foreground">
                  Includes long-haul & short flights
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
