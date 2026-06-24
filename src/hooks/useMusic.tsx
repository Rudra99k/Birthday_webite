import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AudioManager } from "@/lib/AudioManager";
import { MUSIC_CONFIG, MUSIC_STORY } from "@/data/content";

export type MusicStage = "opening" | "cake" | "finale";

interface MusicContextValue {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  hasError: boolean;
  currentTitle: string;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  setStage: (stage: MusicStage) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

const STAGE_TO_SRC: Record<MusicStage, string> = {
  opening: MUSIC_STORY.opening.src,
  cake: MUSIC_STORY.cake.src,
  finale: MUSIC_STORY.finale.src,
};

const STAGE_TO_TITLE: Record<MusicStage, string> = {
  opening: MUSIC_STORY.opening.title,
  cake: MUSIC_STORY.cake.title,
  finale: MUSIC_STORY.finale.title,
};

/**
 * MusicProvider — thin React wrapper around the AudioManager singleton
 * (see src/lib/AudioManager.ts for the actual playback logic and the
 * full explanation of why a singleton outside React is necessary).
 *
 * Uses useSyncExternalStore — the React-blessed pattern for safely
 * subscribing to state that lives outside React — so this component
 * re-renders whenever AudioManager's internal state changes, without
 * AudioManager needing to know anything about React.
 *
 * setStage() is idempotent by source: calling it repeatedly with the
 * same stage (e.g. from a scroll handler firing many times per second)
 * is a no-op after the first call, because AudioManager.play() already
 * ignores redundant calls for the currently-active src.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(
    (cb) => AudioManager.subscribe(cb),
    () => AudioManager.getState()
  );

  // Mount: start the opening track exactly once. Because AudioManager
  // is a module-level singleton (not component state), React Strict
  // Mode's mount→unmount→mount double-invoke in development cannot
  // create a second audio element here — the second invocation's
  // `play()` call sees the same src already active and is a no-op.
  useEffect(() => {
    AudioManager.play(STAGE_TO_SRC.opening, { fadeIn: false });
  }, []);

  const setStage = (stage: MusicStage) => {
    const isFirstTrack = state.currentSrc === null;
    AudioManager.play(STAGE_TO_SRC[stage], { fadeIn: !isFirstTrack });
  };

  const currentTitle =
    (Object.keys(STAGE_TO_SRC) as MusicStage[]).find(
      (stage) => STAGE_TO_SRC[stage] === state.currentSrc
    ) !== undefined
      ? STAGE_TO_TITLE[
          (Object.keys(STAGE_TO_SRC) as MusicStage[]).find(
            (stage) => STAGE_TO_SRC[stage] === state.currentSrc
          )!
        ]
      : MUSIC_STORY.opening.title;

  return (
    <MusicContext.Provider
      value={{
        isPlaying: state.isPlaying,
        currentTime: state.currentTime,
        duration: state.duration,
        volume: state.volume,
        hasError: state.hasError,
        currentTitle,
        togglePlay: () => AudioManager.togglePlay(),
        seek: (t: number) => AudioManager.seek(t),
        setVolume: (v: number) => AudioManager.setVolume(v),
        setStage,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return ctx;
}

export { MUSIC_CONFIG };
