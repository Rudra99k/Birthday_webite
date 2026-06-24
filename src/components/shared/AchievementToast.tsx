import { AnimatePresence, motion } from "framer-motion";
import { useAchievements, ACHIEVEMENT_LABELS } from "@/hooks/useAchievements";
import { useEffect, useState } from "react";
import type { AchievementId } from "@/hooks/useAchievements";

/**
 * AchievementToast — Phase 8.
 * Watches the achievements context; whenever a new one unlocks, shows a
 * small glassmorphism toast in the bottom-right corner for a few seconds.
 * Mount this once near the root of the app (in App.tsx).
 */
export function AchievementToast() {
  const { unlocked } = useAchievements();
  const [queue, setQueue] = useState<AchievementId[]>([]);
  const [seen, setSeen] = useState<Set<AchievementId>>(new Set());

  // whenever a new achievement appears in `unlocked` that we haven't
  // shown yet, push it onto the toast queue
  useEffect(() => {
    const newOnes = [...unlocked].filter((id) => !seen.has(id));
    if (newOnes.length === 0) return;
    setSeen((prev) => new Set([...prev, ...newOnes]));
    setQueue((prev) => [...prev, ...newOnes]);
  }, [unlocked, seen]);

  // auto-dismiss the oldest toast in the queue after a few seconds
  useEffect(() => {
    if (queue.length === 0) return;
    const timeout = setTimeout(() => {
      setQueue((prev) => prev.slice(1));
    }, 3200);
    return () => clearTimeout(timeout);
  }, [queue]);

  const current = queue[0];

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current}
            className="glass glow-rose flex items-center gap-3 rounded-xl px-4 py-3"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span className="text-xl">🏆</span>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-wide text-white/50">
                Achievement Unlocked
              </p>
              <p className="font-display text-sm text-white/90">
                {ACHIEVEMENT_LABELS[current]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
