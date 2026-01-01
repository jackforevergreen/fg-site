import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Cert from "@/assets/course/cert.png";
import Forms from "@/assets/course/forms.png";
import Logo from "@/assets/course/logo.png";
import Notion from "@/assets/course/notion.png";
import YT from "@/assets/course/yt.png";

const steps = [
  {
    number: "01",
    label: "Press play\non YouTube",
    title: "Watch the course on YouTube",
    image: YT,
    body: "Open the YouTube playlist and watch the videos. These videos give you the big picture of how the course works and what you can change in your daily life.",
    link: "https://youtube.com/playlist?list=PLBrL74i7fHKAm0UE0fX3XGDxgBQrskKGn&si=QC7CuNMJ4-GIGBU8",
  },
  {
    number: "02",
    label: "Work through\nthe lessons",
    title: "Follow along in Notion",
    image: Notion,
    body: "Move through the Transport, Diet, and Energy modules at your own pace. Each episode focuses on practical changes you can actually make.",
    link: "https://fg-tja.notion.site/",
  },
  {
    number: "03",
    label: "Test what\nyou've learned",
    title: "Complete the final quiz",
    image: Forms,
    body: "Keep the Notion workspace open while you go. All of the questions, notes, and tools you need are already there to guide you through the quiz.",
  },
  {
    number: "04",
    label: "Lock in your\nimpact",
    title: "Get certified + offset",
    image: Cert,
    body: "Once you've finished will get a certificate of completion and the option to offset one year of CO2 for 50% off!",
  },
  {
    number: "05",
    label: "Keep using\nthe hub",
    title: "Live your life",
    image: Logo,
    body: "Revisit the Notion dashboard whenever you need a refresh. It's your home base for tools, reflection prompts, and future updates.",
    link: "https://fg-tja.notion.site/",
  },
];

const HowToGetStarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <Navigation />

      <div className="container mx-auto px-4 py-20 md:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            How to Get Started
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Follow this simple path to watch the lessons, complete the quiz,
            lock in your offset at half price, and get certified, with every
            question and tool waiting for you inside Notion.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto mt-16 space-y-10">
          {steps.map((step, index) => {
            const CardContent = (
              <div className="h-full rounded-3xl bg-card border border-border shadow-md hover:shadow-xl transition-all duration-300 px-6 py-5 md:px-8 md:py-6">
                <div className="flex items-center gap-4 md:gap-5">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 shrink-0">
                    <img
                      src={
                        (step.image as any).src
                          ? (step.image as any).src
                          : (step.image as any)
                      }
                      alt={step.title}
                      className="w-9 h-9 md:w-10 md:h-10 object-contain"
                    />
                  </div>

                  {/* Text */}
                  <div className="space-y-2">
                    <h2 className="text-lg md:text-xl font-semibold text-foreground">
                      {step.title}
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            );

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                  delay: index * 0.05,
                }}
                className="flex items-stretch gap-6 md:gap-8"
              >
                {/* Number + label */}
                <div className="flex flex-col items-center w-24 shrink-0 pt-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg text-white text-base font-semibold">
                    {step.number}
                  </div>
                  <div className="mt-3 text-[0.7rem] font-semibold tracking-wide text-green-700 text-center whitespace-pre-line leading-tight">
                    {step.label}
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1">
                  {step.link ? (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block cursor-pointer"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    CardContent
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 24,
            delay: 0.2,
          }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl">
            When you&apos;re ready, open the Notion workspace and keep it beside
            you as you watch. Every checklist, quiz question, and action step is
            waiting there for you.
          </p>

          <a
            href="https://fg-tja.notion.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium text-lg transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Open Course &amp; Notion Hub
            <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default HowToGetStarted;
