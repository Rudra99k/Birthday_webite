import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * AuroraBackground — soft pink/violet glowing blobs that slowly drift,
 * sitting behind everything (z-0) on a near-black canvas.
 * Used by: every section in the site.
 *
 * ⚡ Performance: this is mounted ~12 times (once per section), and since
 * this is a single long scrolling page, every instance lives in the DOM
 * simultaneously. Animating all 36 blurred blobs at once regardless of
 * what's actually on screen is wasted GPU work and can cause jank on
 * mid-range phones. `useInView` pauses each instance's animation (drops
 * back to a static `animate={false}` state) whenever its section is far
 * from the viewport, and resumes once it's about to scroll into view.
 */
export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);
  // generous margin so the animation resumes slightly before the
  // section is actually visible, avoiding a visible "pop" on scroll
  const isInView = useInView(ref, { margin: "200px 0px 200px 0px" });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden bg-night"
      aria-hidden="true"
    >
      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[60vw] w-[60vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,93,143,0.35), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={
          isInView
            ? {
                x: ["0%", "8%", "-4%", "0%"],
                y: ["0%", "-6%", "5%", "0%"],
                scale: [1, 1.1, 1.04, 1],
              }
            : undefined
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[55vw] w-[55vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(160,107,255,0.3), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={
          isInView
            ? {
                x: ["0%", "-6%", "4%", "0%"],
                y: ["0%", "5%", "-6%", "0%"],
                scale: [1, 1.06, 1.1, 1],
              }
            : undefined
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 h-[40vw] w-[40vw] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,209,102,0.12), transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={isInView ? { scale: [1, 1.15, 1] } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
