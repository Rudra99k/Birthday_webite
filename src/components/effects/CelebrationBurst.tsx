import { useMemo } from "react";
import { motion } from "framer-motion";

interface CelebrationBurstProps {
  /** triggers a fresh burst whenever this key changes */
  triggerKey: number;
}

const CONFETTI_COLORS = ["#ff5d8f", "#a06bff", "#ffd166", "#ff9bb8", "#7dd3fc"];
const FLOWER_GLYPHS = ["🌸", "🌷", "🌺"];
const SPARK_GLYPHS = ["✨", "💥", "🎉"];

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotateStart: number;
  kind: "confetti" | "flower" | "spark";
  glyph?: string;
  color?: string;
}

/**
 * CelebrationBurst — Phase 9.
 * A one-shot full-screen overlay burst combining confetti rectangles,
 * falling flower emoji, and small sparkle/firework glyphs. Re-mounts
 * (via the changing `triggerKey`) every time the cake's candles are
 * fully blown out.
 */
export function CelebrationBurst({ triggerKey }: CelebrationBurstProps) {
  const pieces: Piece[] = useMemo(() => {
    const confetti: Piece[] = Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 2.2 + Math.random() * 1.4,
      rotateStart: Math.random() * 360,
      kind: "confetti",
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    }));
    const flowers: Piece[] = Array.from({ length: 14 }, (_, i) => ({
      id: 100 + i,
      left: Math.random() * 100,
      delay: 0.1 + Math.random() * 0.6,
      duration: 3 + Math.random() * 1.5,
      rotateStart: Math.random() * 360,
      kind: "flower",
      glyph: FLOWER_GLYPHS[i % FLOWER_GLYPHS.length],
    }));
    const sparks: Piece[] = Array.from({ length: 10 }, (_, i) => ({
      id: 200 + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1.2 + Math.random() * 0.8,
      rotateStart: 0,
      kind: "spark",
      glyph: SPARK_GLYPHS[i % SPARK_GLYPHS.length],
    }));
    return [...confetti, ...flowers, ...sparks];
    // re-roll fresh randomness every time the burst is retriggered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[55] overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p) => {
        if (p.kind === "confetti") {
          return (
            <motion.span
              key={p.id}
              className="absolute top-[-5%] block h-3 w-1.5 rounded-sm"
              style={{ left: `${p.left}%`, background: p.color }}
              initial={{ y: 0, opacity: 1, rotate: p.rotateStart }}
              animate={{
                y: "105vh",
                opacity: [1, 1, 0],
                rotate: p.rotateStart + 540,
              }}
              transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
            />
          );
        }
        if (p.kind === "flower") {
          return (
            <motion.span
              key={p.id}
              className="absolute top-[-5%] block text-2xl"
              style={{ left: `${p.left}%` }}
              initial={{ y: 0, opacity: 0, rotate: p.rotateStart }}
              animate={{
                y: "105vh",
                opacity: [0, 1, 1, 0],
                rotate: p.rotateStart + 200,
              }}
              transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
            >
              {p.glyph}
            </motion.span>
          );
        }
        // spark / firework — bursts outward briefly near the top half
        return (
          <motion.span
            key={p.id}
            className="absolute block text-3xl"
            style={{ left: `${p.left}%`, top: `${20 + Math.random() * 30}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          >
            {p.glyph}
          </motion.span>
        );
      })}
    </div>
  );
}
