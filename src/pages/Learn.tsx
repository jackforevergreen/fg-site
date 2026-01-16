import blogData from "@/assets/post/posts.json";
import type { BlogPost } from "@/assets/post/types";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, User } from "lucide-react";
import { Link } from "react-router-dom";

// Import images
import CalculatorImage from "@/assets/learn/calc.avif";
import heroBackground from "@/assets/learn/hero.avif";
import ResourceGuidesImage from "@/assets/learn/resource.png";

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

const Learn = () => {
  const posts: BlogPost[] = blogData.posts;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.05] animate-zoomSlow"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/20" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 container mx-auto px-4 text-center max-w-6xl"
        >
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl mb-4 sm:mb-5 text-white/90"
          >
            Read more about how to live a sustainable lifestyle
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-5xl xs:text-5xl sm:text-6xl md:text-8xl font-bold mb-8 sm:mb-10 text-white"
          >
            Forever
            <span className="font-bold text-green-600">green</span> Learn
          </motion.h1>

          {/* Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            <Button
              variant="hero"
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-3 sm:px-10 sm:py-4 transition-all duration-150 hover:scale-105 hover:shadow-lg active:scale-95"
              asChild
            >
              <motion.a
                href="#resources"
                className="inline-flex items-center gap-2"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.15, ease: "easeOut" },
                }}
                whileTap={{
                  scale: 0.95,
                  transition: { duration: 0.1 },
                }}
              >
                Resources
              </motion.a>
            </Button>
            <Button
              variant="outline-hero"
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-3 sm:px-10 sm:py-4"
              asChild
            >
              <a href="#blog" className="inline-flex items-center gap-2">
                Blog
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* The Forevergreen Guides Section */}
      <div id="resources" className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
            The Forevergreen Guides
          </h2>
          <p className="text-center text-muted-foreground max-w-4xl mx-auto mb-16">
            Explore in-depth resources on sustainable living, understand our
            carbon calculation methodology, and discover how carbon credits can
            power your journey to a greener future.
          </p>

          {/* Resource Guides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-2 gap-12 items-center mb-20"
          >
            {/* Image */}
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <img
                  src={ResourceGuidesImage}
                  alt="Resource Guides"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Resource Guides
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Delve into our comprehensive resources designed to support your
                sustainability journey. These guides cover essential actions for
                reducing household emissions, methods behind our carbon
                footprint calculations, and insights into carbon credits. Learn
                practical ways to lower your impact and discover how
                Forevergreen empowers you to make a difference every day.
              </p>
              <a
                href="https://www.forevergreen.earth/_files/ugd/40d6d3_08fec397a6cb417d8ec0a6dc17f0f14e.pdf"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Read More
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* Calculator Methodology */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Image */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <img
                  src={CalculatorImage}
                  alt="Calculator Methodology"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Calculator Methodology
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Explore the science and transparency behind Forevergreen's
                approach to carbon footprint calculations. Our methodology
                ensures accuracy, accountability, and actionable insights,
                empowering you to track, reduce, and offset emissions with
                confidence.
              </p>
              <a
                href="/methodology"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Read More
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Blog Section */}
      <div id="blog" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Forevergreen Blog
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              {blogData.description}
            </p>
          </motion.div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {post.category && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.pubDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {/* Read More Link */}
                  <Link
                    to={`/post/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold transition-colors"
                  >
                    Read More
                    <ChevronRight className="h-6 w-6 mt-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
