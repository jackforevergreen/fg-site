import hand from "@/assets/hand.svg";
import { motion } from "framer-motion";

const MonthlyOffset = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hand SVG only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end lg:pr-20"
            >
              <motion.img
                src={hand}
                alt="Supporting sustainable impact"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="w-[420px] max-w-full h-auto -ml-8"
              />
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                Offset your Impact on a Monthly Basis
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Every month your contribution through carbon credits helps
                restore vital ecosystems, reduce harmful emissions, and promote
                renewable energy solutions. This ongoing commitment empowers you
                to be part of global efforts driving real, measurable climate
                impact.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyOffset;
