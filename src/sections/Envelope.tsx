import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { useTypewriter } from "@/hooks/useTypewriter";
import { LETTER_LINES } from "@/data/content";

/**
 * Envelope — Phase 4.
 * Sequence:
 *  1. A closed envelope sits center screen with a gentle float + glow,
 *     inviting a tap.
 *  2. On click: the flap swings open, a folded letter slides up out of it,
 *     and the envelope itself fades back.
 *  3. The letter "unfolds" into a handwriting-style card where each line
 *     of LETTER_LINES types out one by one (Caveat font).
 */
export function Envelope() {
  const [opened, setOpened] = useState(false);

  const { completedLines, currentText, isDone } = useTypewriter(
    LETTER_LINES,
    {
      speed: 35,
      lineDelay: 450,
      startDelay: 600,
      active: opened,
    }
  );

  return (
    <section
      id="envelope"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />
      <FloatingParticles count={8} glyphs={["❤️", "✨"]} />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.button
              key="closed-envelope"
              onClick={() => setOpened(true)}
              className="group relative flex flex-col items-center gap-6 outline-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.4 } }}
              transition={{ duration: 0.7 }}
            >
              <motion.p
                className="font-display text-sm uppercase tracking-[0.25em] text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                A letter for you
              </motion.p>

              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <EnvelopeSVG flapOpen={false} className="h-40 w-56 md:h-48 md:w-64 drop-shadow-[0_0_25px_rgba(255,93,143,0.35)] transition-transform duration-300 group-hover:scale-105" />
              </motion.div>

              <motion.p
                className="text-xs text-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                tap to open ✨
              </motion.p>
            </motion.button>
          ) : (
            <motion.div
              key="open-letter"
              className="flex w-full flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Opened envelope shrinks up top, letter rises from it */}
              <motion.div
                initial={{ y: 0, scale: 1 }}
                animate={{ y: -20, scale: 0.7 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-[-2.5rem] opacity-80"
              >
                <EnvelopeSVG flapOpen className="h-28 w-40 md:h-32 md:w-48" />
              </motion.div>

              <motion.div
                className="glass relative z-10 w-full max-w-md rounded-2xl px-6 py-10 md:px-10 md:py-12"
                initial={{ y: 60, opacity: 0, rotateX: -15 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                style={{ transformPerspective: 800 }}
              >
                <div className="flex min-h-[16rem] flex-col items-center justify-center gap-2 text-center">
                  {completedLines.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={
                        line === "— Rudra"
                          ? "font-hand mt-4 text-2xl text-rose-soft md:text-3xl"
                          : "font-hand text-xl text-white/90 md:text-2xl"
                      }
                    >
                      {line}
                    </motion.p>
                  ))}
                  {!isDone && (
                    <p className="font-hand text-xl text-rose-soft md:text-2xl">
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/**
 * EnvelopeSVG — original simple envelope illustration.
 * flapOpen=false → closed triangle flap on top.
 * flapOpen=true  → flap rotated open, revealing a peek of "letter" inside.
 */
function EnvelopeSVG({
  flapOpen,
  className = "",
}: {
  flapOpen: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 160"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* body */}
      <rect
        x="10"
        y="30"
        width="200"
        height="120"
        rx="10"
        fill="#1d1026"
        stroke="#ff9bb8"
        strokeOpacity="0.4"
        strokeWidth="2"
      />
      {/* peek of letter inside when open */}
      {flapOpen && (
        <rect x="35" y="42" width="150" height="80" rx="6" fill="#2a1638" />
      )}
      {/* bottom V fold */}
      <path
        d="M10 36 L110 110 L210 36"
        fill="none"
        stroke="#ff9bb8"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
      {/* flap — flattens upward and fades back when opened, giving a
          believable "swung open" feel without relying on inconsistent
          cross-browser 3D transforms on SVG paths */}
      <motion.path
        d="M10 32 Q110 -10 210 32 L210 36 L110 110 L10 36 Z"
        fill="#2a1638"
        stroke="#ff9bb8"
        strokeOpacity="0.5"
        strokeWidth="2"
        initial={false}
        animate={
          flapOpen
            ? { scaleY: -0.85, y: -58, opacity: 0.55 }
            : { scaleY: 1, y: 0, opacity: 1 }
        }
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{ transformOrigin: "50% 20%" }}
      />
      {/* little heart seal */}
      <text x="110" y="40" textAnchor="middle" fontSize="16">
        ❤️
      </text>
    </svg>
  );
}
