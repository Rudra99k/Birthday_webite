import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { BUCKET_LIST } from "@/data/content";

/**
 * BucketList — Phase 7 (part 2), "Future Bucket List".
 * Each item has a clickable animated checkbox. Checking one shows a
 * small heart-burst micro-celebration. Purely playful/sentimental —
 * nothing is persisted, it's meant to be tapped through together.
 */
export function BucketList() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const checkedCount = checked.size;

  return (
    <section
      id="bucket-list"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
        <motion.h2
          className="font-display mb-3 text-center text-3xl text-gradient md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          Future Bucket List
        </motion.h2>
        <motion.p
          className="mb-3 text-center text-sm text-white/50 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Things we still have to do together ❤️
        </motion.p>
        <motion.p
          className="mb-10 text-xs text-rose-soft"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {checkedCount} / {BUCKET_LIST.length} dreamed about (tap to mark ✓)
        </motion.p>

        <div className="glass flex w-full flex-col gap-1 rounded-2xl px-4 py-4 md:px-6">
          {BUCKET_LIST.map((item, i) => {
            const isChecked = checked.has(i);
            return (
              <motion.button
                key={i}
                onClick={() => toggle(i)}
                className="group flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-rose-soft/60">
                  <AnimatePresence>
                    {isChecked && (
                      <motion.span
                        className="absolute inset-0 flex items-center justify-center rounded-md bg-gradient-to-br from-rose to-violet text-sm text-white"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "backOut" }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isChecked && (
                      <>
                        {["💗", "✨", "💗"].map((g, gi) => (
                          <motion.span
                            key={gi}
                            className="pointer-events-none absolute text-xs"
                            initial={{ opacity: 1, x: 0, y: 0, scale: 0.8 }}
                            animate={{
                              opacity: 0,
                              x: (gi - 1) * 18,
                              y: -22,
                              scale: 1.1,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          >
                            {g}
                          </motion.span>
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </span>

                <span
                  className={`font-display text-sm transition-all md:text-base ${
                    isChecked
                      ? "text-white/40 line-through"
                      : "text-white/85"
                  }`}
                >
                  {item}
                </span>
              </motion.button>
            );
          })}
        </div>

        {checkedCount === BUCKET_LIST.length && (
          <motion.p
            className="font-hand mt-8 text-center text-xl text-rose-soft md:text-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Let's actually do all of these someday 🥹❤️
          </motion.p>
        )}
      </div>
    </section>
  );
}
