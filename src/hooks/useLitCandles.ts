import { useState } from "react";

/**
 * useLitCandles — tracks which candles on the cake are still lit.
 * Deliberately kept in its own tiny file (no three.js import) so it can
 * be used eagerly by Cake3D.tsx without pulling in the heavy 3D scene
 * bundle before it's actually needed.
 */
export function useLitCandles(count: number) {
  const [litCandles, setLitCandles] = useState<boolean[]>(
    Array.from({ length: count }, () => true)
  );

  const blowCandle = (i: number) => {
    setLitCandles((prev) => {
      const next = [...prev];
      next[i] = false;
      return next;
    });
  };

  const allBlown = litCandles.every((lit) => !lit);
  const resetCandles = () =>
    setLitCandles(Array.from({ length: count }, () => true));

  return { litCandles, blowCandle, allBlown, resetCandles };
}
