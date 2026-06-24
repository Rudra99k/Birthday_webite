import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { WHY_SPECIAL_CARDS } from "@/data/content";

/**
 * WhySpecial — Phase 5 (part 1).
 * A grid of glassmorphism cards, each revealing on scroll with a staggered
 * delay, gentle float, and a hover glow.
 */
export function WhySpecial() {
  return (
    <section
      id="why-special"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />
      <FloatingParticles count={6} glyphs={["✨", "💗"]} />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <motion.h2
          className="font-display mb-3 text-center text-3xl text-gradient md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          Why You Are Special
        </motion.h2>
        <motion.p
          className="mb-14 text-center text-sm text-white/50 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          A few reasons, out of a thousand more ❤️
        </motion.p>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {WHY_SPECIAL_CARDS.map((card, i) => (
            <motion.div
              key={i}
              className="glass group relative flex flex-col items-center gap-4 rounded-2xl px-6 py-10 text-center transition-shadow duration-300 hover:shadow-[0_0_35px_rgba(255,93,143,0.35)]"
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -6 }}
            >
              <motion.span
                className="text-4xl"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              >
                {card.emoji}
              </motion.span>
              <p className="font-display text-base text-white/85 md:text-lg">
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
