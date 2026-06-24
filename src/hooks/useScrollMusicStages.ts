import { useEffect } from "react";
import { useMusic } from "@/hooks/useMusic";

/**
 * useScrollMusicStages — Phase 10 fix.
 *
 * Replaces the earlier approach of giving Cake3D and Finale each their
 * own independent IntersectionObserver. That approach had a real bug:
 * each observer only knew about its OWN section, so if a visitor
 * scrolled back upward (e.g. re-reading the cake section after already
 * reaching the finale), the cake observer would fire `isIntersecting:
 * true` again and call `setStage("cake")`, yanking the music backward
 * even though the visitor was just glancing back, not restarting the
 * story. There was no single source of truth for "what section is the
 * visitor actually in right now."
 *
 * This hook instead reads the actual #cake and #finale section
 * positions on every scroll/resize (throttled to one check per animation
 * frame) and derives the current stage directly from scroll position —
 * opening, until you've scrolled at least 40% into #cake; then cake,
 * until you've scrolled at least 40% into #finale; then finale. Calling
 * `setStage` with the same stage repeatedly is already a no-op (the
 * underlying AudioManager singleton ignores redundant `play()` calls
 * for whatever src is already active), so this is safe to call on
 * every scroll tick without re-triggering fades.
 *
 * Mount this once near the root of the app (in App.tsx) — it doesn't
 * render anything itself.
 */
export function useScrollMusicStages() {
  const { setStage } = useMusic();

  useEffect(() => {
    let rafId: number | null = null;

    const computeStage = () => {
      rafId = null;
      const viewportH = window.innerHeight;
      const cakeEl = document.getElementById("cake");
      const finaleEl = document.getElementById("finale");

      // Default: still in the opening stage until proven otherwise.
      let stage: "opening" | "cake" | "finale" = "opening";

      if (cakeEl) {
        const cakeTop = cakeEl.getBoundingClientRect().top;
        // Once the cake section's top has scrolled up past 60% of the
        // viewport height, we're meaningfully "in" that section.
        if (cakeTop <= viewportH * 0.6) {
          stage = "cake";
        }
      }

      if (finaleEl) {
        const finaleTop = finaleEl.getBoundingClientRect().top;
        if (finaleTop <= viewportH * 0.6) {
          stage = "finale";
        }
      }

      setStage(stage);
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(computeStage);
    };

    // Lenis (the smooth-scroll library used elsewhere in this app)
    // fires native scroll events under the hood, so a plain window
    // scroll listener still works correctly here.
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // run once on mount in case the page loads already scrolled
    // (e.g. browser restoring scroll position)
    computeStage();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
