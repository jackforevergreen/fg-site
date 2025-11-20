// components/NetZeroPromo.tsx
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Building, FileText, Leaf } from "lucide-react";

import pdf2 from "@/assets/cert.png";
import excelSheet from "@/assets/excel.png";
import pdf3 from "@/assets/footprint.png";
import pdf1 from "@/assets/tear.png";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

export default function NetZeroPromo() {
  return (
    <section className="py-24 md:py-28 bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-[-25%] h-[150%] bg-[radial-gradient(65%_60%_at_50%_0%,rgba(0,0,0,0.04),rgba(0,0,0,0)_60%)]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          {...fade}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center mb-10 md:mb-14"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Want your business to{" "}
            <span className="text-primary">reach net zero?</span>
          </h2>
          <p className="mt-4 md:mt-5 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We can help you get there! We offer{" "}
            <strong>FREE carbon footprint calculation services</strong> — just
            pay for the credits.
          </p>
        </motion.div>

        {/* Feature list */}
        <motion.div
          {...fade}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="max-w-4xl mx-auto mb-12 text-center"
        >
          <ul className="text-lg md:text-xl text-foreground font-medium space-y-4 flex flex-col items-center">
            <li className="flex items-center gap-3 justify-center">
              <FileText className="h-6 w-6 text-primary" />
              Breakdown of calculations (PDF + Excel)
            </li>
            <li className="flex items-center gap-3 justify-center">
              <Leaf className="h-6 w-6 text-primary" />
              Project tearsheets for transparency
            </li>
            <li className="flex items-center gap-3 justify-center">
              <Building className="h-6 w-6 text-primary" />
              Verified offset certificates
            </li>
          </ul>
        </motion.div>

        {/* Image previews */}
        <motion.div
          {...fade}
          transition={{ duration: 0.65 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-x-20 md:gap-y-14 max-w-6xl mx-auto items-start justify-items-center text-center px-4"
        >
          <DocumentMockup image={pdf1} label="Offset Project Tearsheets" />
          <LaptopMockup image={excelSheet} label="Calculation Model (Excel)" />

          <DocumentMockup image={pdf2} label="Net-Zero Certificates" />
          <DocumentMockup image={pdf3} label="Carbon Report (PDF)" />
        </motion.div>

        {/* CTA */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mt-0 md:mt-0"
        >
          <Button
            variant="primary-action"
            size="lg"
            className="text-lg md:text-xl px-8 md:px-10 py-6 md:py-7 inline-flex items-center gap-3 rounded-xl"
          >
            Get Started Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* --- Device Mockup Components with tilt effect --- */
function DocumentMockup({ image, label }: { image: string; label: string }) {
  return (
    <motion.div
      whileHover={{ rotate: -2, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className="flex flex-col items-center"
    >
      <div className="flex items-center justify-center">
        <img
          src={image}
          alt={label}
          className="max-h-[200px] md:max-h-[300px] w-auto object-contain mx-auto"
        />
      </div>
      <p className="mt-3 text-center text-sm font-medium text-foreground">
        {label}
      </p>
    </motion.div>
  );
}

function LaptopMockup({ image, label }: { image: string; label: string }) {
  return (
    <motion.div
      whileHover={{ rotate: 1.5, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className="flex flex-col items-center"
    >
      <div className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] max-w-full mx-auto">
        <img src={image} alt={label} className="w-full h-auto object-contain" />
      </div>
      <p className="mt-3 text-center text-sm font-medium text-foreground">
        {label}
      </p>
    </motion.div>
  );
}
