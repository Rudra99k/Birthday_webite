import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useAchievements } from "@/hooks/useAchievements";
import { SECRET_CLICK_TARGET, SECRET_MESSAGE_LINES } from "@/data/content";

/**
 * Secret — Phase 8.
 * A big heart sits center screen. Tapping it SECRET_CLICK_TARGET (27)
 * times — once for each year of... well, just a meaningful number —
 * unlocks a hidden message that types out, and the "Secret Found" +
 * "Heart Clicked 27 Times" achievements both unlock. Reaching this
 * section at all (it's the last one before the finale) also unlocks
 * "Birthday Completed", since she's made it through the whole site.
 */
export function Secret() {
  const [clicks, setClicks] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const { unlock } = useAchievements();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          unlock("birthday-completed");
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revealed = clicks >= SECRET_CLICK_TARGET;

  const { completedLines, currentText, isDone } = useTypewriter(
    SECRET_MESSAGE_LINES,
    {
      speed: 38,
      lineDelay: 500,
      startDelay: 400,
      active: revealed,
    }
  );

  const handleClick = () => {
    if (revealed) return;
    const next = clicks + 1;
    setClicks(next);
    setPulseKey((k) => k + 1);
    if (next >= SECRET_CLICK_TARGET) {
      unlock("secret-found");
      unlock("heart-clicked-27");
    }
  };

  const progress = Math.min(1, clicks / SECRET_CLICK_TARGET);

  return (
    <section
      id="secret"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="clicker"
              className="flex flex-col items-center gap-8"
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
            >
              <motion.h2
                className="font-display text-2xl text-gradient md:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7 }}
              >
                A Hidden Secret 🤫
              </motion.h2>
              <motion.p
                className="text-sm text-white/50 md:text-base"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Tap the heart {SECRET_CLICK_TARGET} times ❤️
              </motion.p>

              <button
                onClick={handleClick}
                className="group relative flex h-40 w-40 items-center justify-center outline-none md:h-48 md:w-48"
                aria-label="Tap the heart"
              >
                {/* glow ring that fills as progress increases */}
                <svg
                  className="absolute inset-0 -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#ff5d8f"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 46}
                    style={{ filter: "drop-shadow(0 0 6px #ff5d8f)" }}
                    initial={false}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 46 * (1 - progress),
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>

                {/* the heart itself, pulses on every click */}
                <motion.span
                  key={pulseKey}
                  className="text-6xl md:text-7xl"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1.3, 1] }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  ❤️
                </motion.span>
              </button>

              <p className="font-display text-lg text-rose-soft md:text-xl">
                {clicks} / {SECRET_CLICK_TARGET}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              className="glass glow-rose flex min-h-[16rem] w-full flex-col items-center justify-center gap-2 rounded-2xl px-6 py-10 md:px-10 md:py-12"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {completedLines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    line.startsWith("—")
                      ? "font-hand mt-3 text-xl text-rose-soft md:text-2xl"
                      : "font-display text-lg text-white/90 md:text-xl"
                  }
                >
                  {line}
                </motion.p>
              ))}
              {!isDone && (
                <p className="font-display text-lg text-rose-soft md:text-xl">
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
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
