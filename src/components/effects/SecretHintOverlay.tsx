import { motion } from "framer-motion";

/**
 * SecretHintOverlay — shown briefly when the "S" keyboard shortcut
 * fires. Rather than instantly spoiling the 27-click secret (Phase 8),
 * this nudges the visitor toward that section so the click-to-reveal
 * mechanic still means something.
 */
export function SecretHintOverlay() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[59] flex justify-center px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass glow-rose rounded-xl px-5 py-3 text-center">
        <p className="font-display text-sm text-white/85 md:text-base">
          🤫 There's a secret hiding near the end of the page...
        </p>
      </div>
    </motion.div>
  );
}
