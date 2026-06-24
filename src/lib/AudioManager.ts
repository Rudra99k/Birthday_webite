/**
 * AudioManager — a true singleton, module-level audio controller.
 *
 * This deliberately lives OUTSIDE React entirely (no hooks, no
 * component state) so it is completely immune to React re-renders,
 * Strict Mode's double-invoke-on-mount behavior in development, and
 * any race between multiple components trying to control playback.
 * There is exactly one instance of this class for the lifetime of the
 * page, and it owns exactly one <audio> element at any given moment —
 * structurally, it is impossible for two tracks to be audible at once
 * through this manager, because `play(src)` always tears down
 * whatever was previously playing (synchronously, before creating the
 * new element) as its very first step.
 *
 * Why this exists: an earlier implementation kept the <audio> element
 * in a React ref inside a provider component. That worked in
 * production builds, but in development, React Strict Mode runs each
 * effect twice (mount → cleanup → mount) specifically to catch exactly
 * this class of bug — and because the ref-based approach raced against
 * its own cleanup, it could end up with two live <audio> elements both
 * mid-fade-in at once. Rapid section/song switching could also briefly
 * overlap two tracks before the old one finished pausing. Moving full
 * ownership into a singleton outside React removes the possibility
 * entirely: every call to `play()` first kills the current track
 * (cancels any in-flight fade, pauses it, detaches its listeners, and
 * nulls the reference) before anything new is created.
 */

type Listener = () => void;

interface AudioManagerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  hasError: boolean;
  currentSrc: string | null;
}

const FADE_MS = 900;
const FADE_STEPS = 18;
const DEFAULT_VOLUME = 0.55; // within the requested 50-60% range

class AudioManagerImpl {
  private current: HTMLAudioElement | null = null;
  private currentDetach: (() => void) | null = null;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private interactionCleanup: (() => void) | null = null;
  private userVolume = DEFAULT_VOLUME;
  private listeners = new Set<Listener>();

  private state: AudioManagerState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: DEFAULT_VOLUME,
    hasError: false,
    currentSrc: null,
  };

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): AudioManagerState {
    return this.state;
  }

  private setState(patch: Partial<AudioManagerState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  /**
   * The single entry point for changing tracks. Always fully tears
   * down whatever is currently playing before starting the new one —
   * this ordering (kill old, THEN create new) is the entire guarantee
   * that only one song is ever audible.
   */
  play(src: string, { fadeIn = false }: { fadeIn?: boolean } = {}) {
    if (this.state.currentSrc === src && this.current) {
      // Already the active track — do nothing (avoids restarting the
      // same song from 0:00 on redundant calls, e.g. re-entering the
      // same section twice in a row).
      return;
    }

    this.killCurrent();

    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = fadeIn ? 0 : this.userVolume;
    this.current = audio;

    this.setState({
      currentSrc: src,
      hasError: false,
      duration: 0,
      currentTime: 0,
    });

    const onTimeUpdate = () => this.setState({ currentTime: audio.currentTime });
    const onLoadedMetadata = () => this.setState({ duration: audio.duration || 0 });
    const onError = () => {
      console.warn(`[AudioManager] Failed to load: ${src}`);
      this.setState({ hasError: true, isPlaying: false });
    };
    const onEnded = () => this.setState({ isPlaying: false });

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);

    this.currentDetach = () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };

    const attemptPlay = () => {
      audio.play().then(
        () => {
          console.log(`[AudioManager] Playing: ${src}`);
          this.setState({ isPlaying: true });
          if (fadeIn) this.fadeTo(this.userVolume);
        },
        () => this.waitForInteractionThenPlay(audio, src, fadeIn)
      );
    };

    attemptPlay();
  }

  /** Stops and fully tears down whatever is currently playing, if anything. */
  private killCurrent() {
    this.cancelFade();
    this.cancelInteractionFallback();

    if (this.current) {
      this.current.pause();
      this.current.currentTime = 0;
      this.currentDetach?.();
      this.current = null;
      this.currentDetach = null;
    }
  }

  private waitForInteractionThenPlay(
    audio: HTMLAudioElement,
    src: string,
    fadeIn: boolean
  ) {
    this.cancelInteractionFallback();
    let started = false;

    const tryStart = () => {
      if (started || this.current !== audio) return;
      started = true;
      cleanup();
      audio.volume = fadeIn ? 0 : this.userVolume;
      audio.play().then(
        () => {
          console.log(`[AudioManager] Playing (after interaction): ${src}`);
          this.setState({ isPlaying: true });
          if (fadeIn) this.fadeTo(this.userVolume);
        },
        () => this.setState({ hasError: true })
      );
    };

    const events: (keyof DocumentEventMap)[] = [
      "pointerdown",
      "keydown",
      "touchstart",
      "click",
    ];
    const cleanup = () => {
      events.forEach((evt) => document.removeEventListener(evt, tryStart, true));
      window.removeEventListener("scroll", tryStart);
      this.interactionCleanup = null;
    };

    events.forEach((evt) => document.addEventListener(evt, tryStart, { capture: true }));
    window.addEventListener("scroll", tryStart, { passive: true });
    this.interactionCleanup = cleanup;
  }

  private cancelInteractionFallback() {
    this.interactionCleanup?.();
    this.interactionCleanup = null;
  }

  private fadeTo(target: number) {
    const audio = this.current;
    if (!audio) return;
    this.cancelFade();
    let step = 0;
    const from = audio.volume;
    this.fadeInterval = setInterval(() => {
      step++;
      const t = step / FADE_STEPS;
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * t));
      this.setState({ volume: audio.volume });
      if (step >= FADE_STEPS) this.cancelFade();
    }, FADE_MS / FADE_STEPS);
  }

  private cancelFade() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  togglePlay() {
    if (!this.current || this.state.hasError) return;
    if (this.state.isPlaying) {
      this.current.pause();
      this.setState({ isPlaying: false });
    } else {
      this.current.play().then(
        () => this.setState({ isPlaying: true }),
        () => this.setState({ hasError: true })
      );
    }
  }

  seek(time: number) {
    if (!this.current || this.state.hasError) return;
    this.current.currentTime = time;
    this.setState({ currentTime: time });
  }

  setVolume(v: number) {
    const clamped = Math.max(0, Math.min(1, v));
    this.userVolume = clamped;
    this.setState({ volume: clamped });
    if (this.current) this.current.volume = clamped;
  }

  /** Full teardown — call on app unmount (rarely needed for a single-page site). */
  destroy() {
    this.killCurrent();
    this.listeners.clear();
  }
}

// The actual singleton instance — one per page load, ever.
export const AudioManager = new AudioManagerImpl();
