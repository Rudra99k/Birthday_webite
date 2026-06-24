import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useKeyboardEasterEggs } from "@/hooks/useKeyboardEasterEggs";
import { useScrollMusicStages } from "@/hooks/useScrollMusicStages";
import { AchievementsProvider } from "@/hooks/useAchievements";
import { MusicProvider } from "@/hooks/useMusic";
import { AchievementToast } from "@/components/shared/AchievementToast";
import { MusicPlayer } from "@/components/shared/MusicPlayer";
import { KeyboardHintBadge } from "@/components/shared/KeyboardHintBadge";
import { KeyboardRain } from "@/components/effects/KeyboardRain";
import { SignatureOverlay } from "@/components/effects/SignatureOverlay";
import { SecretHintOverlay } from "@/components/effects/SecretHintOverlay";
import { LoadingScreen } from "@/sections/LoadingScreen";
import { Hero } from "@/sections/Hero";
import { Envelope } from "@/sections/Envelope";
import { WhySpecial } from "@/sections/WhySpecial";
import { Timeline } from "@/sections/Timeline";
import { OpenWhen } from "@/sections/OpenWhen";
import { Gallery } from "@/sections/Gallery";
import { PhotoPuzzle } from "@/sections/PhotoPuzzle";
import { BucketList } from "@/sections/BucketList";
import { Cake3D } from "@/sections/Cake3D";
import { Secret } from "@/sections/Secret";
import { SpotlightWheel } from "@/sections/SpotlightWheel";
import { Finale } from "@/sections/Finale";

/**
 * ScrollMusicStagesController — tiny internal component whose only job
 * is to call useScrollMusicStages() from inside MusicProvider (the hook
 * needs useMusic()'s context, which only exists below MusicProvider in
 * the tree). Renders nothing.
 */
function ScrollMusicStagesController() {
  useScrollMusicStages();
  return null;
}

function App() {
  useSmoothScroll();

  const [loadingDone, setLoadingDone] = useState(false);
  const { rain, showSignature, showSecretHint } = useKeyboardEasterEggs();

  // Permanent dark mode — this site only ever renders dark.
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  if (!loadingDone) {
    return <LoadingScreen onComplete={() => setLoadingDone(true)} />;
  }

  return (
    <AchievementsProvider>
      <MusicProvider>
        <ScrollMusicStagesController />
        <main className="min-h-screen w-full bg-night text-foreground">
          <Hero />
          <Envelope />
          <WhySpecial />
          <Timeline />
          <OpenWhen />
          <Gallery />
          <PhotoPuzzle />
          <BucketList />
          <Cake3D />
          <Secret />
          <SpotlightWheel />
          <Finale />
        </main>

        <AchievementToast />
        <MusicPlayer />
        <KeyboardHintBadge />

        {rain && <KeyboardRain kind={rain.kind} triggerKey={rain.key} />}
        <AnimatePresence>
          {showSignature && <SignatureOverlay />}
        </AnimatePresence>
        <AnimatePresence>
          {showSecretHint && <SecretHintOverlay />}
        </AnimatePresence>
      </MusicProvider>
    </AchievementsProvider>
  );
}

export default App;
