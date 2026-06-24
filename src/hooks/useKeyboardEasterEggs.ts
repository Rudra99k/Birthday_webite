import { useEffect, useState } from "react";
import type { RainKind } from "@/components/effects/KeyboardRain";

interface KeyboardEasterEggsState {
  rain: { kind: RainKind; key: number } | null;
  showSignature: boolean;
  showSecretHint: boolean;
}

const RAIN_DURATION_MS = 4500;
const OVERLAY_DURATION_MS = 2200;

/**
 * useKeyboardEasterEggs — Phase 11.
 * Listens globally for H/F/B/R/S keypresses (ignoring presses while the
 * visitor is typing in an input/textarea) and returns transient state
 * the root App can render overlays from. Each effect auto-clears itself
 * after a few seconds.
 */
export function useKeyboardEasterEggs(): KeyboardEasterEggsState {
  const [rain, setRain] = useState<{ kind: RainKind; key: number } | null>(
    null
  );
  const [showSignature, setShowSignature] = useState(false);
  const [showSecretHint, setShowSecretHint] = useState(false);

  useEffect(() => {
    let rainTimeout: ReturnType<typeof setTimeout>;
    let signatureTimeout: ReturnType<typeof setTimeout>;
    let hintTimeout: ReturnType<typeof setTimeout>;

    const triggerRain = (kind: RainKind) => {
      setRain({ kind, key: Date.now() });
      clearTimeout(rainTimeout);
      rainTimeout = setTimeout(() => setRain(null), RAIN_DURATION_MS);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (isTyping) return;

      switch (e.key.toLowerCase()) {
        case "h":
          triggerRain("heart");
          break;
        case "f":
          triggerRain("flower");
          break;
        case "b":
          triggerRain("balloon");
          break;
        case "r":
          setShowSignature(true);
          clearTimeout(signatureTimeout);
          signatureTimeout = setTimeout(
            () => setShowSignature(false),
            OVERLAY_DURATION_MS
          );
          break;
        case "s":
          setShowSecretHint(true);
          clearTimeout(hintTimeout);
          hintTimeout = setTimeout(
            () => setShowSecretHint(false),
            OVERLAY_DURATION_MS
          );
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(rainTimeout);
      clearTimeout(signatureTimeout);
      clearTimeout(hintTimeout);
    };
  }, []);

  return { rain, showSignature, showSecretHint };
}
