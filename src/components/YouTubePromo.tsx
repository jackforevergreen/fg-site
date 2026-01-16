// components/YouTubePromo.tsx
import YTLogo from "@/assets/ytlogo.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Play, Users, Youtube } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useYouTube, useLatestVideos, useSubscriberCount } from "@/lib/youtube/youtube-context";
import { formatNumber } from "@/lib/youtube/youtube-api";

// Fallback video data for when API is not available or loading
const fallbackVideos = [
  {
    id: "lk0dazA7emY",
    title: "How the Soviets Destroyed an Entire Sea",
    meta: "",
  },
  {
    id: "d71zmpEng28",
    title: "How China Is Turning Coral Reefs Into Military Bases",
    meta: "",
  },
  {
    id: "YjIRg0Pt-PY",
    title: "Why Haven’t Monkeys Made It Everywhere?",
    meta: "",
  },
];

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

export default function YouTubePromo() {
  // Get dynamic YouTube data
  const { data, formattedSubscriberCount, formattedViewCount } = useYouTube();
  const latestVideos = useLatestVideos();
  const isLoading = data.loading;

  // Use dynamic videos if available, otherwise fallback
  const videos = latestVideos.length > 0 ? latestVideos : fallbackVideos;

  // Choose middle as hero, sides as supporting (ensure we have at least 3 videos)
  const videosToShow = videos.length >= 3 ? videos.slice(0, 3) : [...videos, ...fallbackVideos].slice(0, 3);
  const [left, center, right] = [videosToShow[0], videosToShow[2], videosToShow[1]];

  // Show skeletons during loading to prevent flickering
  const showSkeletons = isLoading;

  // Dynamic subscriber and view counts
  const subscriberCount = `${formattedSubscriberCount} subscribers`;
  const totalViews = `${formattedViewCount} total views`;
  return (
    <section className="py-24 md:py-28 bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-[-25%] h-[150%] bg-[radial-gradient(65%_60%_at_50%_0%,rgba(0,0,0,0.06),rgba(0,0,0,0)_60%)]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          {...fade}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-5xl mx-auto text-center mb-10 md:mb-14"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Subscribe to our <span className="text-primary">YouTube</span>
          </h2>
          <p className="mt-4 md:mt-5 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We create and share videos about nature, animals, climate change,
            sustainability, and much more.
          </p>
        </motion.div>

        {/* Channel header */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="max-w-6xl mx-auto mb-10 md:mb-14"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <img
              src={YTLogo}
              alt="Forevergreen"
              className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white object-contain shadow-sm"
            />
            <div className="text-center sm:text-left">
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                Forevergreen
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                @Forevergreenapp • {subscriberCount}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Videos row */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
            {/* Left (tilted only on md+) */}
            <motion.div
              {...fade}
              transition={{ duration: 0.55 }}
              className="md:mt-10"
            >
              {showSkeletons ? (
                <VideoCardSkeleton />
              ) : (
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <TiltedVideoCard v={left} rotate="-6" />
                </motion.div>
              )}
            </motion.div>

            {/* Center */}
            <motion.div
              {...fade}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="md:mt-0"
            >
              {showSkeletons ? (
                <VideoCardSkeleton featured />
              ) : (
                <FeaturedVideoCard v={center} />
              )}
            </motion.div>

            {/* Right (tilted only on md+) */}
            <motion.div
              {...fade}
              transition={{ duration: 0.55 }}
              className="md:mt-10"
            >
              {showSkeletons ? (
                <VideoCardSkeleton />
              ) : (
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.35,
                  }}
                >
                  <TiltedVideoCard v={right} rotate="6" />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Stats + CTA */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mt-14 md:mt-16 space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg md:text-xl text-foreground font-medium">
            <div className="inline-flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{subscriberCount}</span>
            </div>
            <span className="hidden sm:block text-muted-foreground">•</span>
            <div className="inline-flex items-center gap-2">
              <Play className="h-5 w-5" />
              <span>{totalViews}</span>
            </div>
          </div>

            <Button
            size="lg"
            className="bg-[#FF0000] hover:bg-[#E60000] text-white text-lg md:text-xl font-bold px-8 md:px-10 py-6 md:py-7 inline-flex items-center gap-3 rounded-full shadow-lg transition-all duration-300"
            asChild
            >
            <a
              href="https://www.youtube.com/@Forevergreenapp?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="youtube-subscribe"
              data-analytics-source="main-cta"
            >
              <Youtube className="!h-8 !w-8" />
              Subscribe on YouTube
            </a>
            </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ——— Lazy YouTube Embed ——— */

function LazyYouTubeEmbed({ videoId, title, className = "" }: { videoId: string; title: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {!isInView ? (
        // YouTube thumbnail placeholder
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <Play className="h-6 w-6 text-white ml-1" />
          </div>
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                <Play className="h-6 w-6 text-white ml-1" />
              </div>
            </div>
          )}
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={handleLoad}
          />
        </>
      )}
    </div>
  );
}

/* ——— Loading Skeleton ——— */

function VideoCardSkeleton({ featured = false }: { featured?: boolean }) {
  const cardClass = featured
    ? "overflow-hidden bg-white border-0 shadow-[0_16px_60px_rgba(0,0,0,0.20)] rounded-2xl"
    : "overflow-hidden bg-white border-0 shadow-[0_14px_44px_rgba(0,0,0,0.16)] rounded-2xl";

  return (
    <Card className={cardClass}>
      <div className="aspect-video relative bg-gray-200 animate-pulse" />
      <div className={featured ? "p-5 md:p-6" : "p-4 md:p-5"}>
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-1" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
    </Card>
  );
}

/* ——— Cards ——— */

function FeaturedVideoCard({ v }: { v: any }) {
  const thumbnailUrl = v.thumbnail?.url || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  const videoUrl = v.url || `https://www.youtube.com/watch?v=${v.id}`;

  return (
    <Card className="overflow-hidden bg-white border-0 shadow-[0_16px_60px_rgba(0,0,0,0.20)] rounded-2xl cursor-pointer group hover:shadow-[0_20px_70px_rgba(0,0,0,0.25)] transition-all duration-300">
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={v.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Play className="h-8 w-8 text-white ml-1" />
            </div>
          </div>
        </div>
        <div className="p-5 md:p-6">
          <h3 className="font-semibold text-lg md:text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {v.title}
          </h3>
          {(v.meta || v.viewCount || v.relativeTime) && (
            <div className="mt-1.5 text-sm md:text-base text-muted-foreground">
              {v.meta || (
                <>
                  {v.viewCount && `${formatNumber(v.viewCount).formatted} views`}
                  {v.viewCount && v.relativeTime && ' • '}
                  {v.relativeTime}
                </>
              )}
            </div>
          )}
        </div>
      </a>
    </Card>
  );
}

function TiltedVideoCard({
  v,
  rotate = "-6",
}: {
  v: any;
  rotate?: "-6" | "6" | "0";
}) {
  // Apply rotation ONLY on md+ screens
  const tiltClass =
    rotate === "-6" ? "md:-rotate-6" : rotate === "6" ? "md:rotate-6" : "";

  const thumbnailUrl = v.thumbnail?.url || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  const videoUrl = v.url || `https://www.youtube.com/watch?v=${v.id}`;

  return (
    <Card
      className={`overflow-hidden bg-white border-0 shadow-[0_14px_44px_rgba(0,0,0,0.16)] rounded-2xl transition-transform hover:scale-[1.02] cursor-pointer group ${tiltClass}`}
    >
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={v.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Play className="h-6 w-6 text-white ml-1" />
            </div>
          </div>
        </div>
        <div className="p-4 md:p-5">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {v.title}
          </h3>
          {(v.meta || v.viewCount || v.relativeTime) && (
            <div className="mt-1 text-sm text-muted-foreground">
              {v.meta || (
                <>
                  {v.viewCount && `${formatNumber(v.viewCount).formatted} views`}
                  {v.viewCount && v.relativeTime && ' • '}
                  {v.relativeTime}
                </>
              )}
            </div>
          )}
        </div>
      </a>
    </Card>
  );
}
