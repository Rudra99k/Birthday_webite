import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useAchievements } from "@/hooks/useAchievements";
import { OPEN_WHEN_LETTERS } from "@/data/content";

/**
 * OpenWhen — Phase 6 (+ Phase 8 achievement tracking).
 * A grid of 5 sealed envelope cards (Sad, Miss Me, Worst Day, After 10
 * Years, Wedding Day). Clicking one opens a centered modal where the
 * letter's lines type out one by one. Once every letter has been opened
 * at least once, the "All Letters Opened" achievement unlocks.
 */
export function OpenWhen() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());
  const { unlock } = useAchievements();
  const activeLetter = OPEN_WHEN_LETTERS.find((l) => l.id === activeId) ?? null;

  const openLetter = (id: string) => {
    setActiveId(id);
    setOpenedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      if (next.size === OPEN_WHEN_LETTERS.length) {
        unlock("all-letters-opened");
      }
      return next;
    });
  };

  return (
    <section
      id="open-when"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <motion.h2
          className="font-display mb-3 text-center text-3xl text-gradient md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          Open When...
        </motion.h2>
        <motion.p
          className="mb-14 text-center text-sm text-white/50 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Sealed letters, for whenever you need them ❤️
        </motion.p>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {OPEN_WHEN_LETTERS.map((letter, i) => {
            const isOpened = openedIds.has(letter.id);
            return (
              <motion.button
                key={letter.id}
                onClick={() => openLetter(letter.id)}
                className="group glass relative flex flex-col items-center gap-4 rounded-2xl px-5 py-9 text-center outline-none transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(255,93,143,0.3)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {isOpened && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-rose text-[10px] text-white">
                    ✓
                  </span>
                )}
                <SealedEnvelopeIcon />
                <p className="font-display text-sm text-white/85 md:text-base">
                  {letter.title}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeLetter && (
          <LetterModal
            title={activeLetter.title}
            lines={[...activeLetter.lines]}
            onClose={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function SealedEnvelopeIcon() {
  return (
    <svg
      viewBox="0 0 100 70"
      className="h-16 w-24 drop-shadow-[0_0_14px_rgba(255,93,143,0.4)] transition-transform duration-300 group-hover:scale-110"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="10"
        width="92"
        height="56"
        rx="6"
        fill="#1d1026"
        stroke="#ff9bb8"
        strokeOpacity="0.45"
        strokeWidth="2"
      />
      <path
        d="M4 14 L50 48 L96 14"
        fill="none"
        stroke="#ff9bb8"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      {/* wax seal */}
      <circle cx="50" cy="38" r="11" fill="#ff5d8f" opacity="0.9" />
      <text x="50" y="42" textAnchor="middle" fontSize="11">
        ❤
      </text>
    </svg>
  );
}

function LetterModal({
  title,
  lines,
  onClose,
}: {
  title: string;
  lines: string[];
  onClose: () => void;
}) {
  const { completedLines, currentText, isDone } = useTypewriter(lines, {
    speed: 32,
    lineDelay: 400,
    startDelay: 300,
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="glass relative w-full max-w-md rounded-2xl px-6 py-10 text-center md:px-10 md:py-12"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-lg text-white/40 transition-colors hover:text-white/80"
          aria-label="Close letter"
        >
          ✕
        </button>

        <h3 className="font-display mb-6 text-xl text-rose-soft md:text-2xl">
          {title}
        </h3>

        <div className="flex min-h-[14rem] flex-col items-center justify-center gap-2">
          {completedLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                line.startsWith("—")
                  ? "font-hand mt-3 text-xl text-rose-soft md:text-2xl"
                  : "font-hand text-lg text-white/90 md:text-xl"
              }
            >
              {line}
            </motion.p>
          ))}
          {!isDone && lines.length > 0 && (
            <p className="font-hand text-lg text-rose-soft md:text-xl">
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
  );
}
