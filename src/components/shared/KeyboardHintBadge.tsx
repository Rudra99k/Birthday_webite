import { motion } from "framer-motion";

const SHORTCUTS: { key: string; label: string }[] = [
  { key: "H", label: "Heart rain" },
  { key: "F", label: "Flower rain" },
  { key: "B", label: "Balloons" },
  { key: "R", label: "Signature" },
  { key: "S", label: "Secret hint" },
];

/**
 * KeyboardHintBadge — Phase 11.
 * A tiny, unobtrusive pill in the top-right corner reminding the visitor
 * that keyboard shortcuts exist (H/F/B/R/S). Without this, almost nobody
 * would ever discover them. Hidden on small screens since visitors on
 * phones don't have a keyboard to press anyway.
 */
export function KeyboardHintBadge() {
  return (
    <motion.div
      className="fixed right-5 top-5 z-[60] hidden md:block"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      <details className="group glass rounded-xl px-3 py-2 text-xs text-white/50">
        <summary className="cursor-pointer list-none select-none">
          ⌨️ shortcuts
        </summary>
        <div className="mt-2 flex flex-col gap-1">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/70">
                {s.key}
              </kbd>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </details>
    </motion.div>
  );
}
