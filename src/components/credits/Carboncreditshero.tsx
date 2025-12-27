import { motion } from "framer-motion";
import { Bird, Flower, Leaf, Mountain, Trees } from "lucide-react";

const CarbonCreditsHero = () => {
  const natureIcons = [
    // Top
    {
      Icon: Bird,
      className: "top-[6%] left-1/2 -translate-x-1/2",
      delay: 0.15,
    },

    // Upper left / right
    { Icon: Leaf, className: "top-[18%] left-[6%] md:left-[10%]", delay: 0.25 },
    {
      Icon: Mountain,
      className: "top-[18%] right-[6%] md:right-[10%]",
      delay: 0.35,
    },

    // Lower left / right
    {
      Icon: Flower,
      className: "bottom-[18%] left-[8%] md:left-[12%]",
      delay: 0.45,
    },
    {
      Icon: Trees,
      className: "bottom-[18%] right-[8%] md:right-[12%]",
      delay: 0.55,
    },
  ];

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Give the hero real height + breathing room under a sticky nav */}
      <div className="relative mx-auto max-w-6xl px-4 pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="relative min-h-[420px] md:min-h-[520px] lg:min-h-[580px] flex items-center justify-center">
          {/* Icons orbiting around content */}
          {natureIcons.map(({ Icon, className, delay }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.7,
                delay,
                type: "spring",
                stiffness: 120,
              }}
              className={`absolute ${className} pointer-events-none opacity-90`}
            >
              <Icon className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-green-600" />
            </motion.div>
          ))}

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 text-center max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-gray-900">
              Carbon Credits offer a simple way to combat climate change
            </h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CarbonCreditsHero;
