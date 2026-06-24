import { useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { MEMORY_GALLERY } from "@/data/content";

/**
 * Gallery — Phase 7 (part 1), "Memory Gallery".
 * Real polaroid-style photo cards. Each slot points at a file in
 * public/images/ (see content.ts for exact filenames). Until Rudra drops
 * the actual photo in, a soft placeholder card shows instead of a
 * broken-image icon — the layout looks finished either way.
 */
export function Gallery() {
  return (
    <section
      id="gallery"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <motion.h2
          className="font-display mb-3 text-center text-3xl text-gradient md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          Memory Gallery
        </motion.h2>
        <motion.p
          className="mb-14 max-w-md text-center text-sm text-white/50 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Moments in time ❤️
        </motion.p>

        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
          {MEMORY_GALLERY.map((item, i) => {
            const rotation = i % 2 === 0 ? -3 : 3;

            return (
              <motion.div
                key={i}
                className="glass mx-auto flex w-full max-w-[14rem] flex-col items-center gap-3 rounded-lg p-3"
                style={{ rotate: rotation }}
                initial={{ opacity: 0, y: 30, rotate: rotation }}
                whileInView={{ opacity: 1, y: 0, rotate: rotation }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ rotate: 0, scale: 1.04, y: -4 }}
              >
                <PolaroidPhoto src={item.src} alt={item.caption} />
                <p className="font-hand px-2 pb-1 text-center text-base text-white/85 md:text-lg">
                  {item.caption}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PolaroidPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md bg-white/5 text-white/30">
        <span className="text-3xl">🤍</span>
        <span className="text-[10px] uppercase tracking-wide">
          Photo coming soon
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-40 w-full rounded-md object-cover"
      loading="lazy"
    />
  );
}
