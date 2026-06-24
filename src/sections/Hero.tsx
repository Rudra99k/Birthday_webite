import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { useTypewriter } from "@/hooks/useTypewriter";
import { HERO_TYPEWRITER_LINES, HERO_SUBTITLE } from "@/data/content";

/**
 * Hero — Phase 3.
 * Sequence:
 *  1. Three intro lines type out one by one, centered, alone on screen.
 *  2. Once done, intro fades out and the big "Happy Birthday Estuti ❤️"
 *     title reveals with a glass card, glow, and a scroll-down hint.
 *  Background: aurora + floating hearts/sparkles + floating flowers,
 *  present throughout both stages.
 */
export function Hero() {
  const [introDone, setIntroDone] = useState(false);

  const { completedLines, currentText, isDone } = useTypewriter(
    HERO_TYPEWRITER_LINES,
    {
      speed: 42,
      lineDelay: 650,
      startDelay: 400,
      onDone: () => {
        setTimeout(() => setIntroDone(true), 900);
      },
    }
  );

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />
      <FloatingParticles count={10} glyphs={["❤️", "✨"]} />
      <FloatingParticles count={6} variant="flower" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {!introDone ? (
            <motion.div
              key="intro"
              className="flex min-h-[10rem] flex-col items-center justify-center gap-3"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.6 } }}
            >
              {completedLines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  className="font-display text-base text-white/55 md:text-xl"
                >
                  {line}
                </motion.p>
              ))}
              {!isDone && (
                <p className="font-display text-lg text-gradient md:text-2xl">
                  {currentText}
                  <motion.span
                    className="ml-0.5 inline-block w-[2px] bg-rose-soft"
                    style={{ height: "1.1em" }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <motion.div
                className="glass glow-rose rounded-3xl px-8 py-10 md:px-14 md:py-14"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8 }}
              >
                <motion.h1
                  className="font-display text-3xl font-bold text-gradient md:text-6xl"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  Happy Birthday
                  <br />
                  Estuti <span className="not-italic">❤️</span>
                </motion.h1>

                <motion.p
                  className="mx-auto mt-6 max-w-md text-sm text-white/70 md:text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.7 }}
                >
                  {HERO_SUBTITLE}
                </motion.p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-2 text-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <span className="text-xs uppercase tracking-[0.2em]">
                  Scroll to continue
                </span>
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="text-lg"
                >
                  ↓
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
