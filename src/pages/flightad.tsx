import flightOffset from "@/assets/flight-offset.png";
import FGLogo from "@/assets/logo.png";
import { motion } from "framer-motion";
import { Award, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const flightOptions = [
  {
    label: "1–8 hours | 1 Credit",
    credits: 1,
    price: 10,
    link: "https://buy.stripe.com/bJefZifbA4T10bbcylefC1u",
  },
  {
    label: "9–16 hours | 2 Credits",
    credits: 2,
    price: 20,
    link: "https://buy.stripe.com/6oE9CE0ayaivcHm7sA",
  },
  {
    label: "17–24 hours | 3 Credits",
    credits: 3,
    price: 30,
    link: "https://buy.stripe.com/dR63egg9wbmz0YE3cl",
  },
  {
    label: "25–32 hours | 4 Credits",
    credits: 4,
    price: 40,
    link: "https://buy.stripe.com/14kaGI1eC8ancHm9AK",
  },
  {
    label: "33–40 hours | 5 Credits",
    credits: 5,
    price: 50,
    link: "https://buy.stripe.com/8wMdSUbTggGT36MfZ9",
  },
  {
    label: "41–48 hours | 6 Credits",
    credits: 6,
    price: 60,
    link: "https://buy.stripe.com/fZe8yA3mKcqDePubIU",
  },
  {
    label: "49–56 hours | 7 Credits",
    credits: 7,
    price: 70,
    link: "https://buy.stripe.com/4gweWY9L862fcHm4gt",
  },
  {
    label: "57–64 hours | 8 Credits",
    credits: 8,
    price: 80,
    link: "https://buy.stripe.com/eVa5mo7D00HV8r6fZc",
  },
  {
    label: "65–72 hours | 9 Credits",
    credits: 9,
    price: 90,
    link: "https://buy.stripe.com/dR6eWY7D0fCPePu00f",
  },
  {
    label: "73–80 hours | 10 Credits",
    credits: 10,
    price: 100,
    link: "https://buy.stripe.com/5kA5mo1eCaivazedR6",
  },
  {
    label: "81–89 hours | 11 Credits",
    credits: 11,
    price: 110,
    link: "https://buy.stripe.com/bIY3eg5uSeyLcHm6oF",
  },
  {
    label: "90–96 hours | 12 Credits",
    credits: 12,
    price: 120,
    link: "https://buy.stripe.com/4gw7uw8H4cqD4aQ6oG",
  },
  {
    label: "97–100 hours | 13 Credits",
    credits: 13,
    price: 130,
    link: "https://buy.stripe.com/aEU1688H44YbbDidR9",
  },
];

const trustPills = [
  "1 credit = 1 tonne CO₂",
  "Certificate within 24 hours",
  "No account needed",
  "Secure Stripe checkout",
];

const stats = [
  { value: "$10", label: "flat per credit, no hidden fees" },
  { value: "1t", label: "CO₂ offset per credit" },
  { value: "8h", label: "of flying offset per $10" },
];

const FlightOffsetLanding = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = flightOptions[selectedIndex];

  const scrollToCalc = () => {
    document.getElementById("calc")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-center">
        <a
          href="https://forevergreen.earth"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-green-800 font-bold text-base no-underline"
        >
          <img
            src={FGLogo}
            alt="Forevergreen"
            className="h-8 w-auto object-contain select-none"
            draggable={false}
          />
          <span className="text-lg font-bold text-foreground">
            Forever<span style={{ color: "#217E38" }}>green</span>
          </span>
        </a>
      </nav>

      {/* ── HERO ── */}
      <div className="pt-24 pb-16 px-4 text-center bg-gradient-to-b from-white to-green-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green-400/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
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
            For a fraction of the price of your ticket, support impactful
            projects and fly carbon neutral.
          </span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={scrollToCalc}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold text-base shadow-lg shadow-green-200 transition-all duration-200 hover:-translate-y-0.5"
          >
            Offset My Flight — from $10
          </button>
        </motion.div>
      </div>

      {/* ── PURCHASE CARD (centred) ── */}
      <div id="calc" className="max-w-lg mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card rounded-2xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 transition-all duration-300 p-8 shadow-xl shadow-green-100/50">
            {/* Card header */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-foreground text-base">
                  Flight Offset
                </p>
                <p className="text-muted-foreground text-xs">
                  Select your total hours flown
                </p>
              </div>
            </div>

            {/* Select */}
            <h3 className="text-base font-bold mb-3 text-foreground">
              Number of Hours Flown:
            </h3>
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="w-full rounded-xl border-2 border-green-200 dark:border-green-800 bg-background text-foreground text-base py-3 px-4 mb-6 font-medium cursor-pointer focus:outline-none focus:border-green-500 transition-colors hover:border-green-400"
            >
              {flightOptions.map((opt, i) => (
                <option key={i} value={i}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Price display */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-5 text-center mb-5">
              <p className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent leading-none">
                ${selected.price}
              </p>
              <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                {selected.credits} carbon credit
                {selected.credits > 1 ? "s" : ""} · offsets{" "}
                {selected.credits * 8} hrs of flight
              </p>
            </div>

            {/* Buy button */}
            <a
              href={selected.link}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold text-lg shadow-lg shadow-green-200 transition-all duration-200 hover:-translate-y-0.5 no-underline"
            >
              Buy — ${selected.price}
            </a>

            <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
              Secure checkout via Stripe ·{" "}
              <a
                href="https://forevergreen.earth"
                target="_blank"
                rel="noreferrer"
                className="text-green-600 font-medium hover:underline"
              >
                forevergreen.earth
              </a>
              <br />
              <a
                href="https://www.forevergreen.earth/methodology"
                target="_blank"
                rel="noreferrer"
                className="italic hover:text-green-600 transition-colors"
              >
                CO₂ calculated at 0.43 lbs per passenger mile · 570 mph avg
                speed.
              </a>
              <br />
              <a
                href="https://www.forevergreen.earth/methodology"
                target="_blank"
                rel="noreferrer"
                className="text-green-600 font-medium hover:underline"
              >
                See our methodology →
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── STATS ── */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 py-16 px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-white mb-3"
        >
          Funds go directly to our projects
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <a
            href="https://www.forevergreen.earth/projects"
            target="_blank"
            rel="noreferrer"
            className="text-green-300 text-sm hover:text-green-200 underline underline-offset-2 transition-colors"
          >
            See our projects →
          </a>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto mt-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex-1 min-w-[130px] max-w-[180px] bg-white/10 border border-white/15 rounded-2xl p-5 hover:bg-white/15 hover:border-green-400/50 transition-all duration-200"
            >
              <p className="text-3xl font-bold text-green-300 leading-none">
                {s.value}
              </p>
              <p className="text-xs text-white/50 mt-2 leading-snug">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="bg-gradient-to-b from-green-50 to-white border-t border-green-100 py-20 px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 via-green-600 to-green-400 bg-clip-text text-transparent mb-4"
        >
          Ready to fly greener?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto"
        >
          It takes 60 seconds. No signup required. Start with just $10.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
          onClick={scrollToCalc}
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold text-lg shadow-xl shadow-green-200 transition-all duration-200 hover:-translate-y-0.5"
        >
          Offset My Flight — from $10
        </motion.button>
      </div>
    </div>
  );
};

export default FlightOffsetLanding;
