// components/CommunityStatsLocked.tsx
import {
  motion,
  useReducedMotion,
  useScroll,
  useTime,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Leaf, Mail, Trees, Youtube } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscriberCount } from "@/lib/youtube/youtube-context";

/* ===========================
   Types
=========================== */
type XY = { x: number; y: number };

type Stat = {
  label: string;
  icon?: React.ReactNode;
  rotate?: number; // base rotation (deg)
  coords?: XY; // desktop coordinates (px, relative to center)
  coordsSm?: XY; // mobile coordinates (px, relative to center)
  link?: string; // URL or path to navigate to
  linkType?: "internal" | "external" | "scroll"; // type of navigation
};

/* ===========================
   Small screen detector
=========================== */
function useIsSmall(query = "(max-width: 768px)") {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsSmall(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);
  return isSmall;
}

/* ===========================
   Viewport scale (tiny clamp)
   Scales from 0.96 @ 360px up to 1.00 @ 1280px+
=========================== */
function useViewportScale({
  minW = 360,
  maxW = 1280,
  minScale = 0.96,
  maxScale = 1,
} = {}) {
  const [w, setW] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : maxW
  );
  useEffect(() => {
    const onR = () => setW(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  const t = Math.min(1, Math.max(0, (w - minW) / (maxW - minW)));
  return minScale + (maxScale - minScale) * t;
}

/* ===========================
   Defaults with explicit coordinates
   (tweak these numbers)
=========================== */
const statsDefault: Stat[] = [
  {
    label: "1.2M+ lbs Offset",
    icon: <Trees className="w-[2em] h-[2em]" />,
    rotate: -8,
    coords: { x: 340, y: -210 },
    coordsSm: { x: 130, y: -70 },
    link: "/carboncredits",
    linkType: "internal",
  },
  {
    label: "250K+ Subscribers",
    icon: <Youtube className="w-[2em] h-[2em] text-red-500" />,
    rotate: 8,
    coords: { x: -340, y: -210 },
    coordsSm: { x: -130, y: -70 },
    link: "https://www.youtube.com/@Forevergreenapp",
    linkType: "external",
  },
  {
    label: "10K+ tons Calculated",
    icon: <Leaf className="w-[2em] h-[2em] text-green-600" />,
    rotate: -8,
    coords: { x: -300, y: 210 },
    coordsSm: { x: -120, y: 95 },
    link: "https://apps.apple.com/us/app/forevergreen-app/id6578432563",
    linkType: "external",
  },
  {
    label: "3K+ Newsletter Subs",
    icon: <Mail className="w-[2em] h-[2em]" />,
    rotate: 10,
    coords: { x: 300, y: 210 },
    coordsSm: { x: 120, y: 95 },
    link: "#newsletter",
    linkType: "scroll",
  },
];

/* ===========================
   Helpers
=========================== */
function useBand(
  p: MotionValue<number>,
  from: [number, number],
  to: [number, number]
) {
  return useTransform(p, from, to, { clamp: true });
}

/* ===========================
   Stat Bubble
=========================== */
function StatBubble({
  s,
  i,
  fadeProgress,
  baseRotate = 0,
  baseXY,
}: {
  s: Stat;
  i: number;
  fadeProgress: MotionValue<number>;
  baseRotate?: number;
  baseXY: XY;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!s.link) return;

    switch (s.linkType) {
      case "internal":
        navigate(s.link);
        break;
      case "external":
        window.open(s.link, "_blank", "noopener,noreferrer");
        break;
      case "scroll":
        if (s.link.startsWith("#")) {
          const element = document.querySelector(s.link);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
        break;
      default:
        if (s.link.startsWith("http")) {
          window.open(s.link, "_blank", "noopener,noreferrer");
        } else {
          navigate(s.link);
        }
    }
  };
  const prefersReduced = useReducedMotion();
  const time = useTime();

  // idle micro-motion
  const t = useTransform(time, (ms) => ms / 1000);
  const phase = i * 3;
  const ampY = 5;
  const ampX = 4;
  const ampR = 2;
  const ampS = 0.05;

  const yIdle = useTransform(t, (v) =>
    prefersReduced ? 0 : Math.sin(v * 0.9 + phase) * ampY
  );
  const xIdle = useTransform(t, (v) =>
    prefersReduced
      ? 0
      : Math.cos(v * 0.7 + phase) * ampX * (i % 2 === 0 ? 1 : -1)
  );
  const rIdle = useTransform(t, (v) =>
    prefersReduced ? baseRotate : baseRotate + Math.sin(v * 0.7 + phase) * ampR
  );
  const sIdle = useTransform(t, (v) =>
    prefersReduced ? 1 : 1 + Math.sin(v * 0.8 + phase) * ampS
  );

  // enter animation
  const fadeOpacity = useBand(fadeProgress, [0, 1], [0, 1]);
  const yEnter = useBand(fadeProgress, [0, 1], [50, 0]);
  const scaleEnter = useBand(fadeProgress, [0, 1], [0.85, 1]);

  // combine base XY with idle/enter
  const y = useTransform(
    [yEnter, yIdle],
    ([a, b]) => (a as number) + (b as number) + baseXY.y
  );
  const x = useTransform(xIdle, (b) => (b as number) + baseXY.x);

  return (
    <motion.div
      className="absolute flex flex-col items-center text-center text-foreground whitespace-nowrap pointer-events-auto cursor-pointer will-change-transform group"
      style={{
        x,
        y,
        rotate: rIdle,
        opacity: fadeOpacity,
        scale: scaleEnter,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ ease: "easeOut", duration: 0.6 }}
      onClick={handleClick}
    >
      <motion.span
        style={{
          scale: sIdle,
          filter: "drop-shadow(0 12px 36px rgba(0,0,0,0.18))",
        }}
        className="mb-1 group-hover:scale-110 transition-transform duration-200"
      >
        {s.icon}
      </motion.span>
      <span
        className="font-medium select-none group-hover:font-semibold group-hover:text-primary transition-all duration-200"
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.08))" }}
      >
        {s.label}
      </span>
    </motion.div>
  );
}

/* ===========================
   Section
=========================== */
export default function CommunityStatsLocked({
  stats,
}: {
  stats?: Stat[];
}) {
  const subscriberCount = useSubscriberCount();

  // Create dynamic stats with real subscriber count
  const dynamicStats = stats || [
    {
      label: "1.2M+ lbs Offset",
      icon: <Trees className="w-[2em] h-[2em]" />,
      rotate: -8,
      coords: { x: 340, y: -210 },
      coordsSm: { x: 130, y: -70 },
      link: "/carboncredits",
      linkType: "internal" as const,
    },
    {
      label: `${subscriberCount} Subscribers`,
      icon: <Youtube className="w-[2em] h-[2em] text-red-500" />,
      rotate: 8,
      coords: { x: -340, y: -210 },
      coordsSm: { x: -130, y: -70 },
      link: "https://www.youtube.com/@Forevergreenapp",
      linkType: "external" as const,
    },
    {
      label: "12K+ tons Calculated",
      icon: <Leaf className="w-[2em] h-[2em] text-green-600" />,
      rotate: -8,
      coords: { x: -300, y: 210 },
      coordsSm: { x: -120, y: 95 },
      link: "https://apps.apple.com/us/app/forevergreen-app/id6578432563",
      linkType: "external" as const,
    },
    {
      label: "3K+ Newsletter Subs",
      icon: <Mail className="w-[2em] h-[2em]" />,
      rotate: 10,
      coords: { x: 300, y: 210 },
      coordsSm: { x: 120, y: 95 },
      link: "#newsletter",
      linkType: "scroll" as const,
    },
  ];
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isSmall = useIsSmall();
  const vScale = useViewportScale({
    minW: 360,
    maxW: 1280,
    minScale: 0.96, // << shrink a touch on phones
    maxScale: 1,
  });

  // entrance progress (short band)
  const { scrollYProgress: fadeProgressRaw } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "start 40%"],
  });
  const fadeProgress = useTransform(fadeProgressRaw, (v) =>
    prefersReduced ? 1 : v
  );

  // headline motion
  const time = useTime();
  const t = useTransform(time, (ms) => ms / 1000);
  const headEnterY = useBand(fadeProgress, [0, 1], [30, 0]);
  const headOpacity = useBand(fadeProgress, [0, 1], [0, 1]);
  const headScaleEnter = useBand(fadeProgress, [0, 1], [0.9, 1]);
  const headBreath = useTransform(t, (v) =>
    prefersReduced ? 1 : 1 + Math.sin(v * 0.5) * 0.006
  );
  const headScale = useTransform(
    [headScaleEnter, headBreath],
    ([a, b]) => (a as number) * (b as number)
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-white relative overflow-hidden"
    >
      {/* soft radial glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-[-25%] h-[150%] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(34,197,94,0.10),rgba(34,197,94,0)_65%)]" />
      </div>

      <div className="container mx-auto px-4">
        {/* 👇 Add scale here — super subtle, based on viewport width */}
        <motion.div
          className="relative mx-auto w-full max-w-6xl aspect-[16/9] flex items-center justify-center overflow-visible"
          style={
            {
              scale: vScale, // <= tiny responsive scale
              fontSize: "clamp(14px, 2.1vw, 28px)",
            } as React.CSSProperties
          }
        >
          {/* Headline */}
          <motion.h2
            className="text-center font-bold leading-[0.95] text-foreground select-none pointer-events-none will-change-transform"
            style={{
              y: headEnterY,
              scale: headScale as MotionValue<number>,
              opacity: headOpacity,
              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.10))",
            }}
            transition={{ ease: "easeOut", duration: 0.6 }}
          >
            <div className="text-[2.5em]">Join</div>
            <div className="text-[2.5em]">Our</div>
            <div className="text-[2.5em]">Community</div>
          </motion.h2>

          {/* Stat bubbles with explicit coordinates */}
          {dynamicStats.slice(0, 4).map((s, i) => {
            const baseXY = isSmall
              ? s.coordsSm ?? s.coords ?? { x: 0, y: 0 }
              : s.coords ?? s.coordsSm ?? { x: 0, y: 0 };

            return (
              <StatBubble
                key={i}
                s={s}
                i={i}
                fadeProgress={fadeProgress}
                baseRotate={s.rotate ?? 0}
                baseXY={baseXY}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
