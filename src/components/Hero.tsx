import heroBackground from "@/assets/hero-background.jpg";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Users, ShoppingCart } from "lucide-react";
import { useSubscriberCount } from "@/lib/youtube/youtube-context";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};
const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const Hero = () => {
  const subscriberCount = useSubscriberCount();
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.05] animate-zoomSlow"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/20" />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10 container mx-auto px-4 text-center max-w-6xl"
      >
        <motion.h1
          variants={fadeUp}
          className="text-5xl xs:text-5xl sm:text-6xl md:text-8xl font-bold mb-5 sm:mb-6 text-white"
        >
          Forever
          <span className="font-bold text-primary">
            green
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl sm:text-xl md:text-3xl mb-8 sm:mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed"
        >
          Join the movement. Download our app, watch nature content, and take
          climate action today.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <Button
            variant="hero"
            size="lg"
            className="w-full sm:w-auto text-base sm:text-lg px-5 py-3 sm:px-6 sm:py-4 transition-all duration-150 hover:scale-105 hover:shadow-lg active:scale-95"
            asChild
          >
            <motion.a
              href="https://apps.apple.com/us/app/forevergreen-app/id6578432563"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
              data-analytics-event="app-download"
              data-analytics-source="hero-section"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              whileTap={{
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Download className="h-5 w-5" />
              </motion.div>
              Download the App
            </motion.a>
          </Button>
          <Button
            variant="outline-hero"
            size="lg"
            className="w-full sm:w-auto text-base sm:text-lg px-5 py-3 sm:px-6 sm:py-4"
            asChild
          >
            <a href="/shop" className="inline-flex items-center gap-2">
              Offset Now
            </a>
          </Button>
        </motion.div>

        {/* Dynamic Counters - Placeholders for future real-time data */}
        <motion.div
          variants={fadeUp}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center text-white/80"
        >
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">
              <span className="text-white font-bold">{subscriberCount}</span> Subscribers
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">
              <span className="text-white font-bold">1.2M+</span> lbs CO₂ Offset
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
