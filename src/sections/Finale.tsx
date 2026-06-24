import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { useTypewriter } from "@/hooks/useTypewriter";
import { FINALE_LINES, FINALE_SIGNOFF } from "@/data/content";

/**
 * Finale — Phase 12, "Final Cinematic Ending".
 * The very last section. Slow-motion flowers fall, soft fireworks pop in
 * the background, FINALE_LINES type out one by one, and Rudra's signoff
 * fades in last. This is the emotional closing beat of the whole site.
 *
 * Note: the music story flow's "finale" stage is now driven by
 * useScrollMusicStages (mounted once in App.tsx), not by this
 * component's observer — an earlier per-section-observer approach
 * could re-trigger unpredictably if the visitor scrolled back and
 * forth between sections.
 */
export function Finale() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  // only start the typewriter + fireworks once this section is actually
  // scrolled into view, so it lands with intent rather than firing the
  // moment the page mounts.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { completedLines, currentText, isDone } = useTypewriter(
    FINALE_LINES,
    {
      speed: 45,
      lineDelay: 900,
      startDelay: 500,
      active,
    }
  );

  return (
    <section
      id="finale"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />
      <FloatingParticles count={14} variant="flower" />
      <FloatingParticles count={10} glyphs={["✨", "❤️"]} />
      {active && <Fireworks />}

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-10 text-center">
        <div className="flex min-h-[10rem] flex-col items-center justify-center gap-3">
          {completedLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-xl text-gradient md:text-3xl"
            >
              {line}
            </motion.p>
          ))}
          {!isDone && active && (
            <p className="font-display text-xl text-gradient md:text-3xl">
              {currentText}
              <motion.span
                className="ml-0.5 inline-block w-[2px] bg-rose-soft"
                style={{ height: "1.1em" }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </p>
          )}
        </div>

        {isDone && (
          <motion.p
            className="font-hand text-2xl text-rose-soft md:text-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {FINALE_SIGNOFF}
          </motion.p>
        )}
      </div>
    </section>
  );
}

/**
 * Fireworks — a handful of soft expanding-ring bursts at randomized
 * positions in the upper portion of the screen, looping gently. Pure
 * CSS/SVG, no canvas needed for this scale.
 */
function Fireworks() {
  const bursts = [
    { left: "18%", top: "22%", delay: 0, color: "#ff5d8f" },
    { left: "75%", top: "18%", delay: 0.8, color: "#a06bff" },
    { left: "45%", top: "30%", delay: 1.6, color: "#ffd166" },
    { left: "85%", top: "40%", delay: 2.4, color: "#ff9bb8" },
    { left: "10%", top: "45%", delay: 3.2, color: "#7dd3fc" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {bursts.map((b, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{ left: b.left, top: b.top, background: b.color }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 10, 14], opacity: [1, 0.5, 0] }}
          transition={{
            duration: 2.4,
            delay: b.delay,
            repeat: Infinity,
            repeatDelay: 3.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
