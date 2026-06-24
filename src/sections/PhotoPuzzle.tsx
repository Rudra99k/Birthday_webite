import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { PUZZLE_PHOTO } from "@/data/content";

/**
 * PhotoPuzzle — Phase 7 (part 3), "Photo Puzzle Section".
 * A blurred photo is split into a grid of pieces, each covered by a card.
 * Tapping a card flips it over (with a little delay stagger per piece),
 * revealing that piece of the sharp photo underneath. Once every piece
 * is flipped, the whole photo is fully revealed and unblurred.
 */
export function PhotoPuzzle() {
  const size = PUZZLE_PHOTO.gridSize;
  const totalPieces = size * size;

  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [imgFailed, setImgFailed] = useState(false);

  const pieces = useMemo(
    () => Array.from({ length: totalPieces }, (_, i) => i),
    [totalPieces]
  );

  const revealAll = () => setRevealed(new Set(pieces));
  const toggle = (i: number) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });

  const allRevealed = revealed.size === totalPieces;

  return (
    <section
      id="photo-puzzle"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />
      <FloatingParticles count={6} glyphs={["✨", "❤️"]} />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <motion.h2
          className="font-display mb-3 text-3xl text-gradient md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          {allRevealed ? "There She Is ✨" : PUZZLE_PHOTO.revealLabel}
        </motion.h2>
        <motion.p
          className="mb-10 text-sm text-white/50 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {allRevealed
            ? "Worth the wait, every time ❤️"
            : "Tap each piece to reveal it ✨"}
        </motion.p>

        {imgFailed ? (
          <div className="glass flex aspect-square w-full max-w-sm flex-col items-center justify-center gap-2 rounded-2xl text-white/30">
            <span className="text-4xl">🤍</span>
            <span className="text-xs uppercase tracking-wide">
              Photo coming soon
            </span>
          </div>
        ) : (
          <>
            <div
              className="relative grid aspect-square w-full max-w-sm overflow-hidden rounded-2xl"
              style={{
                gridTemplateColumns: `repeat(${size}, 1fr)`,
                gridTemplateRows: `repeat(${size}, 1fr)`,
              }}
            >
              {/* the sharp photo sits underneath, always rendered */}
              <img
                src={PUZZLE_PHOTO.src}
                alt="Estuti"
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setImgFailed(true)}
              />

              {pieces.map((i) => {
                const row = Math.floor(i / size);
                const col = i % size;
                const isRevealed = revealed.has(i);

                return (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className="relative overflow-hidden outline-none"
                    style={{ gridRow: row + 1, gridColumn: col + 1 }}
                    aria-label={`Reveal piece ${i + 1}`}
                  >
                    {/* blurred duplicate of just this piece, covers the
                        sharp version until revealed */}
                    <AnimatePresence>
                      {!isRevealed && (
                        <motion.div
                          key="overlay"
                          className="absolute inset-0 border border-white/10"
                          style={{
                            backgroundImage: `url(${PUZZLE_PHOTO.src})`,
                            backgroundSize: `${size * 100}% ${size * 100}%`,
                            backgroundPosition: `${
                              (col / (size - 1)) * 100
                            }% ${(row / (size - 1)) * 100}%`,
                            filter: "blur(10px) brightness(0.55)",
                          }}
                          exit={{ opacity: 0, scale: 1.15 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                        />
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>

            {!allRevealed && (
              <motion.button
                onClick={revealAll}
                className="mt-8 text-xs text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                reveal it all at once
              </motion.button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
