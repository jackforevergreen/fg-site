import TJA from "@/assets/course/10.png";
import Forevergreen from "@/assets/course/9.png";
import Course from "@/assets/course/course.gif";
import GetStarted from "@/assets/course/getstarted";
import Notion from "@/assets/course/notion.gif";
import PDF from "@/assets/course/pdf.gif";

import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Car,
  CheckCircle,
  ExternalLink,
  FileText,
  Lightbulb,
  UtensilsCrossed,
} from "lucide-react";

const Courses = () => {
  const courseModules = [
    {
      icon: Car,
      title: "Transport",
      description: "Explore smarter travel habits.",
    },
    {
      icon: UtensilsCrossed,
      title: "Diet",
      description: "Make lower-impact food choices.",
    },
    {
      icon: Lightbulb,
      title: "Energy",
      description: "Reduce waste and save on your bills.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            Everyday Tips
          </div>
          <div className="flex items-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Actionable Strategies
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-full text-sm font-medium">
            <FileText className="h-4 w-4" />
            In-Depth Resources
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-left">
              <p className="text-primary font-medium mb-4">
                Learn to Live Sustainably
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
                The Practical Guide to Sustainable Living
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                A free, hands-on course to help you cut emissions in your daily
                life—without sacrificing your lifestyle.
              </p>

              <a
                href="https://forevergreen.notion.site/A-Practical-Guide-to-Sustainable-Living-16b5ac92fa0280bfb29fc9e6f2e92ee8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Learning Free
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            {/* Right Video Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl"
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/rnh9Z_B-nzs?autoplay=1&mute=1&loop=1&playlist=rnh9Z_B-nzs"
                title="The Practical Guide to Sustainable Living - Introduction"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </motion.div>
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {courseModules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <module.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {module.title}
                </h3>
                <p className="text-muted-foreground">{module.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sustainability in Every Part of Life Section */}
      <div className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Sustainability in Every Part of Life
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Build lasting habits across the areas that matter most — with
              bite-sized lessons, action tools, and real impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Transport Module Detail */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/K7b_pdE7-go"
                  title="Episode 1: The Carbon Footprint of Transportation"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  Smarter Transportation Choices
                </h3>
                <p className="text-muted-foreground">
                  Learn how your travel habits affect the planet and discover
                  practical ways to reduce emissions — from carpooling to public
                  transit and active travel. Complete your own audit and leave
                  with a custom transportation plan.
                </p>
              </div>
            </motion.div>

            {/* Diet Module Detail */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/eDs6xMVb7Ls"
                  title="Episode 1: The Carbon Footprint of Diet"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  Sustainable Eating Made Simple
                </h3>
                <p className="text-muted-foreground">
                  Understand the carbon impact of your diet and explore how
                  small shifts in food choices, sourcing, and waste can improve
                  your health and reduce your footprint. Use our interactive
                  tools to map out your own dietary changes.
                </p>
              </div>
            </motion.div>

            {/* Energy Module Detail */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/z75d7FIb7jM"
                  title="Episode 1: Basics of Energy Consumption and Emissions"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  Build Better Energy Habits
                </h3>
                <p className="text-muted-foreground">
                  Get clear on how energy use impacts the environment and what
                  you can do at home to save money and reduce emissions. Our
                  audit and action plan help you make meaningful upgrades, no
                  matter your living situation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Presented By Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Presented By
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
              This course was created by{" "}
              <span className="font-semibold">TJA Distributors</span> and{" "}
              <span className="font-semibold">Forevergreen</span> to provide
              free, accessible education that empowers individuals to take
              meaningful climate action.
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              We believe that when people are equipped with the right tools and
              knowledge, they can make everyday decisions that lead to a more
              sustainable future.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Forevergreen Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-36 h-36 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg overflow-hidden">
                  <img
                    src={Forevergreen}
                    alt="Forevergreen Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  FOREVERGREEN
                </h3>
                <a
                  href="https://www.forevergreen.earth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 mb-4 hover:text-primary transition-colors"
                >
                  WWW.FOREVERGREEN.EARTH
                </a>
                <p className="text-sm text-gray-500">
                  Empowering individual climate action
                </p>
              </div>
            </motion.div>

            {/* TJA Distributors Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg overflow-hidden">
                  <img
                    src={TJA}
                    alt="TJA Distributors Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  TJA DISTRIBUTORS
                </h3>
                <a
                  href="https://tjadistributors.com/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 mb-4 hover:text-primary transition-colors"
                >
                  TJADISTRIBUTORS.COM/HOME
                </a>
                <p className="text-sm text-gray-500">
                  Sustainable solutions for business
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Free Value Section */}
      <div className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              A BUNCH OF FREE RESOURCES
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              We created this course to deliver real value — and most of it is
              totally free. You'll get full video lessons with quizzes, plus a
              robust Notion dashboard with a dedicated page for each episode,
              packed with tools, links and action steps. For those who want more
              structure, we offer an optional PDF bundle to help you plan, stay
              consistent, and support the project.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Notion Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <div className="aspect-video rounded-lg mb-4 overflow-hidden shadow-lg">
                  <img
                    src={Notion}
                    alt="Notion Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  Notion Dashboard
                </h3>
                <p className="text-muted-foreground mb-4">
                  Interactive course platform with episode guides, tools, and
                  action steps
                </p>
                <a
                  href="https://forevergreen.notion.site/A-Practical-Guide-to-Sustainable-Living-16b5ac92fa0280bfb29fc9e6f2e92ee8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Access Dashboard
                  <ExternalLink className="h-4 w-4" />
                </a>
              </motion.div>

              {/* Online Course */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <div className="aspect-video rounded-lg mb-4 overflow-hidden shadow-lg">
                  <img
                    src={Course}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  Online Course
                </h3>
                <p className="text-muted-foreground mb-4">
                  Full video lessons with quizzes and comprehensive learning
                  materials
                </p>
                <a
                  href="https://forevergreen.notion.site/A-Practical-Guide-to-Sustainable-Living-16b5ac92fa0280bfb29fc9e6f2e92ee8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Watch the Course
                  <ExternalLink className="h-4 w-4" />
                </a>
              </motion.div>

              {/* Additional PDFs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <div className="aspect-video rounded-lg mb-4 overflow-hidden shadow-lg">
                  <img
                    src={PDF}
                    alt="PDF"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  Additional PDFs
                </h3>
                <p className="text-muted-foreground mb-4">
                  Optional downloadable workbooks and planning templates
                </p>
                <a
                  href="https://forevergreen.notion.site/A-Practical-Guide-to-Sustainable-Living-16b5ac92fa0280bfb29fc9e6f2e92ee8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Download PDFs
                  <ExternalLink className="h-4 w-4" />
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12"
            >
              <a
                href="https://forevergreen.notion.site/A-Practical-Guide-to-Sustainable-Living-16b5ac92fa0280bfb29fc9e6f2e92ee8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <GetStarted />
    </div>
  );
};

export default Courses;
