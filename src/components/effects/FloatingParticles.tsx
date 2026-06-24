import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Flower } from "@/components/effects/Flower";

interface FloatingParticlesProps {
  /** how many particles to render */
  count?: number;
  /** emoji/characters to randomly pick from, e.g. ["❤️", "✨"] */
  glyphs?: string[];
  /** plain color dots, glyphs, or original SVG flowers */
  variant?: "glyph" | "dot" | "flower";
  /** flower petal colors to randomly pick from (only used when variant="flower") */
  flowerColors?: string[];
  className?: string;
}

interface Particle {
  id: number;
  left: number; // vw %
  size: number; // px or rem multiplier
  duration: number; // seconds
  delay: number; // seconds
  glyph?: string;
  color?: string;
}

/**
 * FloatingParticles — ambient floating hearts/sparkles/dots/flowers rising
 * from the bottom of the screen. Pure decoration, sits behind content (z-0).
 * Used by: LoadingScreen (Phase 2), Hero (Phase 3), Finale (Phase 12).
 */
export function FloatingParticles({
  count = 18,
  glyphs = ["❤️", "✨", "💗"],
  variant = "glyph",
  flowerColors = ["#ff9bb8", "#ff5d8f", "#a06bff"],
  className = "",
}: FloatingParticlesProps) {
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size:
        variant === "glyph"
          ? 14 + Math.random() * 18
          : variant === "flower"
          ? 22 + Math.random() * 20
          : 3 + Math.random() * 5,
      duration: 7 + Math.random() * 8,
      delay: Math.random() * 6,
      glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, variant, glyphs.join(""), flowerColors.join("")]);

  // ⚡ Performance: this is mounted in ~12 sections at once on this long
  // single-page site. Pausing animation while off-screen (with generous
  // margin so it resumes just before becoming visible) avoids animating
  // particles nobody can see.
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "200px 0px 200px 0px" });

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bottom-0 block"
          style={{
            left: `${p.left}%`,
            fontSize: variant === "glyph" ? `${p.size}px` : undefined,
            width:
              variant === "dot" || variant === "flower"
                ? `${p.size}px`
                : undefined,
            height:
              variant === "dot" || variant === "flower"
                ? `${p.size}px`
                : undefined,
            borderRadius: variant === "dot" ? "50%" : undefined,
            background:
              variant === "dot"
                ? "radial-gradient(circle, var(--color-rose-soft), transparent)"
                : undefined,
          }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={
            isInView
              ? {
                  y: "-110vh",
                  opacity: [0, 1, 1, 0],
                  rotate: variant === "flower" ? [0, 25, -15, 0] : 360,
                }
              : undefined
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {variant === "glyph" && p.glyph}
          {variant === "flower" && <Flower color={p.color} className="h-full w-full" />}
        </motion.span>
      ))}
    </div>
  );
}
