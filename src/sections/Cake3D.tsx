import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { useLitCandles } from "@/hooks/useLitCandles";
import { CelebrationBurst } from "@/components/effects/CelebrationBurst";
import { useAchievements } from "@/hooks/useAchievements";
import { CAKE_CONFIG } from "@/data/content";

// Three.js + react-three-fiber/drei are heavy (~900kB+ minified). Lazy-load
// the actual 3D scene so visitors who never scroll this far never pay for
// it, and the rest of the site's initial bundle stays light.
const Cake3DScene = lazy(() =>
  import("@/components/effects/Cake3DScene").then((m) => ({
    default: m.Cake3DScene,
  }))
);

/**
 * Cake3D — Phase 9, "Interactive 3D Birthday Cake".
 * A real Three.js cake (drag to look around, auto-rotates slowly).
 * Tapping a candle blows it out. Once every candle is out, a full-screen
 * confetti + flower-rain + firework burst plays, and the "Cake Cut"
 * achievement unlocks.
 *
 * Note: the music story flow's "cake" stage is now driven by
 * useScrollMusicStages (mounted once in App.tsx), not by an
 * IntersectionObserver here — an earlier per-section-observer approach
 * had a bug where scrolling back up after reaching the finale could
 * re-trigger this section's observer and yank the music backward.
 */
export function Cake3D() {
  const { litCandles, blowCandle, allBlown, resetCandles } = useLitCandles(
    CAKE_CONFIG.candleCount
  );
  const [burstKey, setBurstKey] = useState(0);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const { unlock } = useAchievements();

  useEffect(() => {
    if (allBlown && !hasCelebrated) {
      setHasCelebrated(true);
      setBurstKey((k) => k + 1);
      unlock("cake-cut");
    }
  }, [allBlown, hasCelebrated, unlock]);

  const handleReset = () => {
    resetCandles();
    setHasCelebrated(false);
  };

  return (
    <section
      id="cake"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <motion.h2
          className="font-display mb-3 text-3xl text-gradient md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          {allBlown ? "Make A Wish Come True 🎉" : "Blow Out The Candles 🎂"}
        </motion.h2>
        <motion.p
          className="mb-8 text-sm text-white/50 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {allBlown
            ? "Happy Birthday, Estuti ❤️"
            : "Drag to look around, tap each flame to blow it out"}
        </motion.p>

        <div className="glass h-[26rem] w-full max-w-md overflow-hidden rounded-2xl md:h-[30rem]">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center text-white/30">
                Loading cake...
              </div>
            }
          >
            <Cake3DScene litCandles={litCandles} onBlowCandle={blowCandle} />
          </Suspense>
        </div>

        {allBlown && (
          <motion.button
            onClick={handleReset}
            className="mt-8 text-xs text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            light the candles again
          </motion.button>
        )}
      </div>

      {hasCelebrated && <CelebrationBurst triggerKey={burstKey} />}
    </section>
  );
}
