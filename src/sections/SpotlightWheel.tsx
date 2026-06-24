import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { SPOTLIGHT_GALLERY } from "@/data/content";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

// One full revolution every ~26 seconds — matches the requested
// 20-30s/revolution range.
const ROTATION_SPEED_DEG_PER_SEC = 360 / 26;

/**
 * SpotlightWheel — a true 3D cylindrical photo rotation, like photos
 * mounted around a rotating mug or a slowly-spinning globe. Shown once
 * near the very end of the site as a closing flourish; does not
 * replace or modify the existing Gallery/PhotoPuzzle/BucketList
 * sections.
 *
 * Structure (this is the part that matters for getting real 3D
 * rotation instead of an accidental left-right slide):
 *
 *   .scene (perspective: 1400px)
 *     .cylinder (transform-style: preserve-3d)   ← NOT animated itself;
 *       .card[0]  transform: rotateY(0deg)   translateZ(radius)   ← each
 *       .card[1]  transform: rotateY(90deg)  translateZ(radius)     card's
 *       .card[2]  transform: rotateY(180deg) translateZ(radius)     OWN
 *       .card[3]  transform: rotateY(270deg) translateZ(radius)     transform
 *
 * Every frame, each card's rotateY angle is its fixed placement angle
 * PLUS a single shared "spin" value that increases over time — so
 * every card moves through rotateY(0→360) together, which is what
 * actually swings cards around a circle in 3D space (an earlier,
 * broken version applied the rotation to an *inner* element nested
 * inside an un-transformed positioned wrapper, which meant nothing
 * was actually placed around a circle — every card overlapped at dead
 * center and only its internal style changed, which reads as a flat
 * left-right slide rather than real rotation).
 *
 * Depth cues (scale/opacity/blur/brightness) are derived every frame
 * from how close each card's current angle is to "facing the camera"
 * (0°) versus "directly behind" (180°), exactly like a real object —
 * the front face is sharp and bright, the side faces narrow via
 * perspective, and the back face is almost invisible.
 *
 * ⚡ Performance: styles are written directly to the DOM via refs
 * inside the animation-frame loop rather than through React state, so
 * React doesn't re-render 8 components 60 times a second for a purely
 * cosmetic continuous spin.
 */
export function SpotlightWheel() {
  const count = SPOTLIGHT_GALLERY.length;
  const isMobile = useIsMobile();

  const radius = isMobile ? 140 : 200;
  const cardWidth = isMobile ? 96 : 124;
  const cardHeight = isMobile ? 130 : 168;
  const containerHeight = isMobile ? 280 : 340;
  const perspective = isMobile ? 1000 : 1400;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const spinRef = useRef(0);
  const targetSpinRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const placementAngles = useRef<number[]>(
    Array.from({ length: count }, (_, i) => (i / count) * 360)
  );

  const applyCardStyles = () => {
    const spin = spinRef.current;
    for (let i = 0; i < count; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const placementAngle = placementAngles.current[i];
      // current angle of this card relative to the camera, normalized
      // to [-180, 180] where 0 = facing the camera, ±180 = directly behind
      const raw = (placementAngle + spin) % 360;
      const liveAngle = raw > 180 ? raw - 360 : raw < -180 ? raw + 360 : raw;
      const frontness = 1 - Math.abs(liveAngle) / 180; // 1 = front, 0 = back

      // depth cues per the requested spec: front opacity 1, side ~0.6,
      // back ~0.05, plus scale/blur/brightness so it reads as a real
      // rotating object rather than a flat fade
      const scale = 0.5 + frontness * 0.7;
      const opacity = 0.05 + frontness * frontness * 0.95;
      const blurPx = (1 - frontness) * 6;
      const brightness = 0.4 + frontness * 0.7;
      const zIndex = Math.round(frontness * 1000);
      const isActive = activeIndex === i;

      // the ONE transform that actually places this card on the
      // rotating cylinder — rotateY swings it around the shared axis,
      // translateZ pushes it out to the cylinder's radius
      el.style.transform = `translate(-50%, -50%) rotateY(${placementAngle + spin}deg) translateZ(${radius}px) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(zIndex);
      el.style.filter = `blur(${blurPx}px) brightness(${brightness})`;

      const inner = el.firstElementChild as HTMLElement | null;
      if (inner) {
        inner.style.boxShadow = isActive
          ? "0 0 40px rgba(255,93,143,0.8)"
          : `0 0 ${6 + frontness * 22}px rgba(255,93,143,${0.08 + frontness * 0.28})`;
        inner.style.borderColor = `rgba(255,155,184,${0.12 + frontness * 0.38})`;
      }
    }
  };

  useAnimationFrame((_, delta) => {
    const dt = delta / 1000;

    if (targetSpinRef.current !== null) {
      const diff = targetSpinRef.current - spinRef.current;
      const wrapped = (((diff + 180) % 360) + 360) % 360 - 180;
      if (Math.abs(wrapped) < 0.3) {
        spinRef.current = targetSpinRef.current;
        targetSpinRef.current = null;
      } else {
        spinRef.current += wrapped * Math.min(1, dt * 2.2);
      }
    } else if (!pausedRef.current) {
      spinRef.current += ROTATION_SPEED_DEG_PER_SEC * dt;
    }

    applyCardStyles();
  });

  useEffect(() => {
    applyCardStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const handlePhotoClick = (i: number) => {
    if (activeIndex === i) {
      setActiveIndex(null);
      pausedRef.current = false;
      targetSpinRef.current = null;
    } else {
      setActiveIndex(i);
      pausedRef.current = true;
      targetSpinRef.current = -placementAngles.current[i];
    }
  };

  return (
    <section
      id="spotlight"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <AuroraBackground />
      <FloatingParticles count={8} glyphs={["✨", "❤️"]} />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <motion.h2
          className="font-display mb-3 text-3xl text-gradient md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          One Last Look ✨
        </motion.h2>
        <motion.p
          className="mb-10 text-sm text-white/50 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Tap a photo to bring it forward
        </motion.p>

        {/* .scene */}
        <div
          className="relative w-full"
          style={{ height: containerHeight, perspective: `${perspective}px` }}
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: cardWidth * 2.6,
              height: cardHeight * 2.4,
              background:
                "radial-gradient(ellipse, rgba(255,180,210,0.18), transparent 70%)",
              filter: "blur(6px)",
            }}
          />

          {/* .cylinder — establishes the shared 3D space; itself never
              animated, each child card carries its own transform */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{ transformStyle: "preserve-3d" }}
          >
            {SPOTLIGHT_GALLERY.map((photo, i) => (
              <CarouselCard
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                width={cardWidth}
                height={cardHeight}
                src={photo.src}
                caption={photo.caption}
                onClick={() => handlePhotoClick(i)}
              />
            ))}
          </div>
        </div>

        {activeIndex !== null && (
          <motion.p
            key={activeIndex}
            className="font-hand mt-6 text-xl text-rose-soft md:text-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {SPOTLIGHT_GALLERY[activeIndex].caption}
          </motion.p>
        )}

        {activeIndex === null && (
          <motion.button
            onClick={() => (pausedRef.current = !pausedRef.current)}
            className="mt-6 text-xs text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            pause / resume spinning
          </motion.button>
        )}
      </div>
    </section>
  );
}

interface CarouselCardProps {
  width: number;
  height: number;
  src: string;
  caption: string;
  onClick: () => void;
}

/**
 * CarouselCard — a single photo card. THIS element (the outer button)
 * is the one whose `transform` carries `rotateY(...) translateZ(...)`
 * — that's what actually places it at its position around the
 * cylinder. Nothing about its position is set via CSS `left`/`top`
 * percentages; `translate(-50%, -50%)` (baked into the same transform
 * string, see applyCardStyles above) is what centers it before the 3D
 * placement happens, so the rotation math has a clean origin.
 */
function CarouselCard({
  width,
  height,
  src,
  caption,
  onClick,
  ref,
}: CarouselCardProps & { ref: (el: HTMLButtonElement | null) => void }) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="absolute left-0 top-0 outline-none"
      style={{
        width,
        height,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity, filter",
      }}
      aria-label={caption}
    >
      <div
        className="glass h-full w-full overflow-hidden rounded-2xl"
        style={{
          boxSizing: "border-box",
          border: "2px solid rgba(255,155,184,0.2)",
          transition: "box-shadow 0.3s, border-color 0.3s",
        }}
      >
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/30">
            🤍
          </div>
        ) : (
          <img
            src={src}
            alt={caption}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/45 to-transparent" />
      </div>
    </button>
  );
}
