import { useMemo } from "react";
import { motion } from "framer-motion";

export type RainKind = "heart" | "flower" | "balloon";

interface KeyboardRainProps {
  kind: RainKind;
  /** changing this remounts the rain with fresh randomness */
  triggerKey: number;
}

const GLYPHS: Record<RainKind, string[]> = {
  heart: ["❤️", "💗", "💕"],
  flower: ["🌸", "🌷", "🌺"],
  balloon: ["🎈", "🎈", "🎈"],
};

const BALLOON_COLORS = ["#ff5d8f", "#a06bff", "#ffd166", "#7dd3fc", "#ff9bb8"];

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  glyph: string;
  color?: string;
}

/**
 * KeyboardRain — Phase 11.
 * Renders ~30 falling (or rising, for balloons) pieces across the full
 * screen for a few seconds, then is unmounted by the parent. Used for
 * the H (heart rain), F (flower rain), and B (balloon mode) shortcuts.
 */
export function KeyboardRain({ kind, triggerKey }: KeyboardRainProps) {
  const rising = kind === "balloon";

  const pieces: Piece[] = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 2.8 + Math.random() * 2.2,
      size: kind === "balloon" ? 30 + Math.random() * 16 : 18 + Math.random() * 16,
      glyph: GLYPHS[kind][i % GLYPHS[kind].length],
      color:
        kind === "balloon"
          ? BALLOON_COLORS[i % BALLOON_COLORS.length]
          : undefined,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, triggerKey]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[58] overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block"
          style={{
            left: `${p.left}%`,
            top: rising ? undefined : "-8%",
            bottom: rising ? "-12%" : undefined,
            fontSize:
              kind === "balloon" ? undefined : `${p.size}px`,
          }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: rising ? "-115vh" : "115vh",
            opacity: [0, 1, 1, 0],
            rotate: rising ? [0, 12, -8, 0] : 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: rising ? "easeOut" : "easeIn",
          }}
        >
          {kind === "balloon" ? (
            <Balloon size={p.size} color={p.color!} />
          ) : (
            p.glyph
          )}
        </motion.span>
      ))}
    </div>
  );
}

function Balloon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 40 52"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="20" cy="20" rx="18" ry="20" fill={color} opacity="0.9" />
      <path d="M20 40 L20 52" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    </svg>
  );
}
