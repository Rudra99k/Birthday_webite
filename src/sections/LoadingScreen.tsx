import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { useTypewriter } from "@/hooks/useTypewriter";
import { LOADER_LINES } from "@/data/content";

interface LoadingScreenProps {
  /** called once the loader has fully finished and faded out */
  onComplete: () => void;
}

/**
 * LoadingScreen — Phase 2.
 * Sequence:
 *  1. Percentage counter climbs 0 → 100 over ~3.4s
 *  2. In parallel, LOADER_LINES type out one by one
 *  3. Once both are done, hold briefly, then fade out and call onComplete
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  const { completedLines, currentText, isDone } = useTypewriter(
    LOADER_LINES,
    {
      speed: 40,
      lineDelay: 550,
      startDelay: 400,
    }
  );

  // Percentage counter — ticks up to 100 independently of typing speed,
  // tuned to roughly finish around the same time as the last line.
  useEffect(() => {
    const totalDuration = 3400; // ms
    const tickEvery = 30; // ms
    const steps = totalDuration / tickEvery;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      // ease-out curve so it feels like it's "settling" at 100
      const t = step / steps;
      const eased = 1 - Math.pow(1 - t, 2);
      setProgress(Math.min(100, Math.round(eased * 100)));
      if (step >= steps) clearInterval(interval);
    }, tickEvery);

    return () => clearInterval(interval);
  }, []);

  // Once typing is done AND progress has hit 100, hold then exit.
  useEffect(() => {
    if (isDone && progress >= 100) {
      const holdTimeout = setTimeout(() => {
        setExiting(true);
        // give the exit animation time to play before unmounting
        setTimeout(onComplete, 700);
      }, 500);
      return () => clearTimeout(holdTimeout);
    }
  }, [isDone, progress, onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <AuroraBackground />
          <FloatingParticles count={14} glyphs={["❤️", "✨"]} />

          <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-10 text-center">
            {/* Typing lines */}
            <div className="flex min-h-[7rem] flex-col items-center justify-center gap-2">
              {completedLines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.45, y: 0 }}
                  className="font-display text-sm text-white/50 md:text-base"
                >
                  {line}
                </motion.p>
              ))}
              {!isDone && (
                <p className="font-display text-base text-gradient md:text-xl">
                  {currentText}
                  <motion.span
                    className="ml-0.5 inline-block w-[2px] bg-rose-soft"
                    style={{ height: "1em" }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </p>
              )}
            </div>

            {/* Percentage bar */}
            <div className="flex w-full flex-col items-center gap-3">
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose to-violet"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <span className="font-display text-2xl tabular-nums text-gradient">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
