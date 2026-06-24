import { useEffect, useRef, useState } from "react";

interface UseTypewriterOptions {
  /** ms per character */
  speed?: number;
  /** ms pause after a line finishes before moving to next */
  lineDelay?: number;
  /** ms before typing starts at all */
  startDelay?: number;
  /** whether typing should run */
  active?: boolean;
  /** called once after the last line finishes typing */
  onDone?: () => void;
}

interface UseTypewriterResult {
  /** lines that have fully finished typing */
  completedLines: string[];
  /** the line currently being typed (partial text) */
  currentText: string;
  /** index of the line currently being typed */
  currentLineIndex: number;
  /** true once every line has finished */
  isDone: boolean;
}

/**
 * useTypewriter — types an array of lines one by one, character by character.
 * Used by: LoadingScreen (Phase 2), Hero (Phase 3), Envelope (Phase 4), OpenWhen (Phase 6).
 */
export function useTypewriter(
  lines: string[],
  {
    speed = 45,
    lineDelay = 700,
    startDelay = 300,
    active = true,
    onDone = () => {},
  }: UseTypewriterOptions = {}
): UseTypewriterResult {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const linesKey = lines.join("|");

  useEffect(() => {
    if (!active) return;

    setCompletedLines([]);
    setCurrentText("");
    setCurrentLineIndex(0);
    setIsDone(false);

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const typeLine = (lineIdx: number) => {
      if (cancelled) return;
      if (lineIdx >= lines.length) {
        setIsDone(true);
        onDoneRef.current();
        return;
      }

      const line = lines[lineIdx];
      let charIdx = 0;

      const typeChar = () => {
        if (cancelled) return;
        charIdx++;
        setCurrentText(line.slice(0, charIdx));

        if (charIdx < line.length) {
          timeouts.push(setTimeout(typeChar, speed));
        } else {
          timeouts.push(
            setTimeout(() => {
              setCompletedLines((prev) => [...prev, line]);
              setCurrentText("");
              setCurrentLineIndex(lineIdx + 1);
              typeLine(lineIdx + 1);
            }, lineDelay)
          );
        }
      };
      typeChar();
    };

    timeouts.push(setTimeout(() => typeLine(0), startDelay));

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, linesKey, speed, lineDelay, startDelay]);

  return { completedLines, currentText, currentLineIndex, isDone };
}
