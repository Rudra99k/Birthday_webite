import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMusic } from "@/hooks/useMusic";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * MusicPlayer — Phase 10 + post-launch 3-song story flow.
 * A floating widget pinned to the bottom-left of the screen. Collapsed,
 * it's a small spinning-disc button. Expanded, it shows whichever song
 * is currently playing in the story flow (opening → cake → finale),
 * play/pause, a seekable progress bar, and a volume slider.
 *
 * If the current stage's mp3 file hasn't been added yet (see
 * MusicProvider), it shows a gentle "no song yet" state instead of a
 * broken/silent player.
 */
export function MusicPlayer() {
  const [expanded, setExpanded] = useState(false);
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    hasError,
    currentTitle,
    togglePlay,
    seek,
    setVolume,
  } = useMusic();

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="fixed bottom-5 left-5 z-[60] flex flex-col items-start gap-2">
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="glass w-[min(18rem,calc(100vw-2.5rem))] rounded-2xl p-4"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-display mb-3 truncate text-sm text-white/85">
              {currentTitle}
            </p>

            {hasError ? (
              <p className="text-xs text-white/40">
                🎵 Song file not added yet — drop it in{" "}
                <code className="text-rose-soft">public/song/song.mp3</code>
              </p>
            ) : (
              <>
                <div className="mb-3 flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose to-violet text-white"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? "❚❚" : "▶"}
                  </button>

                  <div className="flex flex-1 flex-col gap-1">
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      value={currentTime}
                      onChange={(e) => seek(Number(e.target.value))}
                      className="h-1 w-full cursor-pointer accent-rose"
                    />
                    <div className="flex justify-between text-[10px] text-white/40">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">🔈</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="h-1 w-full cursor-pointer accent-violet"
                  />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="glass glow-rose flex h-12 w-12 items-center justify-center rounded-full text-lg"
        aria-label="Toggle music player"
      >
        <motion.span
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isPlaying
              ? { duration: 4, repeat: Infinity, ease: "linear" }
              : { duration: 0.3 }
          }
        >
          🎵
        </motion.span>
      </button>

      {/* progress ring around the collapsed disc when playing */}
      {!expanded && duration > 0 && (
        <svg
          className="pointer-events-none absolute -left-0.5 -top-0.5 h-[3.25rem] w-[3.25rem] -rotate-90"
          viewBox="0 0 50 50"
        >
          <circle
            cx="25"
            cy="25"
            r="23"
            fill="none"
            stroke="rgba(255,93,143,0.6)"
            strokeWidth="2"
            strokeDasharray={2 * Math.PI * 23}
            strokeDashoffset={2 * Math.PI * 23 * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.3s linear" }}
          />
        </svg>
      )}
    </div>
  );
}
