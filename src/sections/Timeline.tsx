import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { TIMELINE } from "@/data/content";

/**
 * Timeline — Phase 5 (part 2).
 * A vertical glowing line with year nodes that pop in on scroll,
 * alternating left/right on desktop, stacked on mobile.
 */
export function Timeline() {
  return (
    <section
      id="timeline"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <motion.h2
          className="font-display mb-3 text-center text-3xl text-gradient md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          Our Friendship Timeline
        </motion.h2>
        <motion.p
          className="mb-16 text-center text-sm text-white/50 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {TIMELINE[0].year} to {TIMELINE[TIMELINE.length - 1].year} ❤️
        </motion.p>

        <div className="relative w-full">
          {/* glowing vertical line */}
          <motion.div
            className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-rose via-violet to-rose-soft md:left-1/2"
            style={{ boxShadow: "0 0 12px rgba(255,93,143,0.5)" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />

          <div className="flex flex-col gap-10 md:gap-6">
            {TIMELINE.map((entry, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={entry.year}
                  className="relative flex w-full items-center md:justify-center"
                >
                  {/* node dot */}
                  <motion.div
                    className="absolute left-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gold"
                    style={{ boxShadow: "0 0 14px rgba(255,209,102,0.8)" }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  />

                  {/* desktop: alternate left/right; mobile: always offset right of line */}
                  <motion.div
                    className={`glass ml-10 w-full max-w-[15rem] rounded-xl px-5 py-4 text-left md:ml-0 md:max-w-[16rem] ${
                      isLeft
                        ? "md:mr-[calc(50%+1.5rem)] md:text-right"
                        : "md:ml-[calc(50%+1.5rem)] md:text-left"
                    }`}
                    initial={{
                      opacity: 0,
                      x: isLeft ? -30 : 30,
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <span className="font-display text-xl text-rose-soft md:text-2xl">
                      {entry.year}
                    </span>
                    <p className="mt-1 text-sm text-white/75 md:text-base">
                      {entry.text}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
