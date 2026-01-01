import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
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
            {/* Placeholder FAQ items - user can fill in */}
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What are carbon credits?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                [Add content here]
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How do subscriptions work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                [Add content here]
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Can I cancel my subscription?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                [Add content here]
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How are carbon credits verified?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                [Add content here]
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                [Add content here]
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How do flight offsets work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                [Add content here]
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Faq;
