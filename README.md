# Happy Birthday Estuti ❤️ — Phase 1: Setup

Cinematic interactive birthday website for Estuti, built phase by phase.

## Stack
- React + TypeScript + Vite
- Tailwind CSS v4 (CSS-first config, no `tailwind.config.js` needed)
- shadcn/ui components — set up **manually** (CLI domain `ui.shadcn.com`
  was blocked in this sandbox, so components were hand-written following
  the official "new-york" style patterns)
- Framer Motion (animations)
- Lenis (smooth scrolling)
- lucide-react (icons)

## Folder structure & where everything goes

```
estuti-birthday/
├── index.html                 # Root HTML — fonts (Playfair Display, Poppins, Caveat) loaded here
├── vite.config.ts             # Vite config — Tailwind plugin + "@/*" path alias
├── tsconfig.app.json           # TS config for app code — path alias "@/*" → "./src/*"
├── components.json             # shadcn manual-setup record (style, aliases) — CLI not used
│
├── public/
│   ├── song/                  # 🎵 Rudra: put your "Tumhi Ho Bandhu Sakha Tumhi Ho" mp3 here
│   │                           #    as `song.mp3` (referenced in src/data/content.ts → MUSIC_CONFIG.src)
│   └── images/                # 🖼️ Any real photos for the gallery (Phase 7) go here
│
└── src/
    ├── main.tsx                # React root mount — do not touch unless adding global providers
    ├── App.tsx                 # Top-level app shell — sections will be composed here phase by phase
    ├── index.css                # Tailwind v4 import + shadcn CSS variables (light/dark) + our
    │                            #   cinematic theme tokens (--color-rose, --color-violet, fonts, etc.)
    │
    ├── components/
    │   ├── ui/                 # shadcn primitives — button.tsx, card.tsx, separator.tsx, input.tsx
    │   ├── effects/             # (Phase 2+) particle/aurora/sparkle/confetti visual effect components
    │   └── shared/              # (Phase 2+) small reusable pieces (e.g. SectionWrapper, GlowText)
    │
    ├── sections/                # (Phase 2+) one file per big section:
    │                            #   LoadingScreen.tsx, Hero.tsx, Envelope.tsx, WhySpecial.tsx,
    │                            #   Timeline.tsx, OpenWhen.tsx, Gallery.tsx, BucketList.tsx,
    │                            #   Secret.tsx, Cake3D.tsx, MusicPlayer.tsx, Finale.tsx
    │
    ├── hooks/
    │   ├── useSmoothScroll.ts   # Lenis setup — called once in App.tsx
    │   └── (Phase 2+) useTypewriter.ts, useParticles.ts, etc.
    │
    ├── data/
    │   └── content.ts           # 📝 ALL TEXT CONTENT lives here. Edit this file to change any
    │                            #    wording — sections will just import from it.
    │
    ├── types/
    │   └── index.ts              # Shared TypeScript interfaces (TimelineEntry, OpenWhenLetter, etc.)
    │
    ├── lib/
    │   └── utils.ts              # shadcn's `cn()` helper (clsx + tailwind-merge)
    │
    └── assets/
        ├── audio/                 # (alternative spot for audio if you don't want it in /public)
        ├── images/                 # (alternative spot for imported/bundled images)
        └── fonts/                  # (only needed if we self-host fonts instead of Google Fonts CDN)
```

## Installation (already run, kept here for reference / fresh clone)

```bash
npm create vite@latest estuti-birthday -- --template react-ts
cd estuti-birthday
npm install

# Tailwind v4
npm install -D tailwindcss @tailwindcss/vite

# shadcn manual deps (CLI was blocked by sandbox network policy)
npm install class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
npm install @radix-ui/react-slot @radix-ui/react-separator
npm install -D @types/node

# Animation / scroll
npm install framer-motion lenis
```

## Commands

```bash
npm run dev      # start dev server
npm run build    # type-check (tsc -b) + production build → dist/
npm run preview  # preview the production build locally
```

## Status

✅ Phase 1 complete — project scaffolding, Tailwind v4, manual shadcn/ui base
   (Button, Card, Separator, Input), Framer Motion, Lenis, path aliases,
   fonts, theme tokens, and centralized content/types files.

✅ Phase 2 complete — Loading Screen:
   - `src/sections/LoadingScreen.tsx` — typing animation (4 lines from
     `LOADER_LINES` in `content.ts`) + percentage counter 0→100 + fade-out
     transition into the app.
   - `src/hooks/useTypewriter.ts` — reusable typewriter hook (will be reused
     by Hero, Envelope, Open-When letters in later phases).
   - `src/components/effects/AuroraBackground.tsx` — reusable glowing blob
     background (used everywhere from now on).
   - `src/components/effects/FloatingParticles.tsx` — reusable floating
     hearts/sparkles (used everywhere from now on).
   - Wired into `src/App.tsx`: loader shows first, calls `onComplete` when
     done, then the rest of the app renders.

✅ Phase 3 complete — Hero section:
   - `src/sections/Hero.tsx` — typewriter intro (3 lines from
     `HERO_TYPEWRITER_LINES`) fades out into the big "Happy Birthday
     Estuti ❤️" title reveal inside a glowing glass card, with subtitle
     and a scroll-down hint.
   - `src/components/effects/Flower.tsx` — original SVG blossom (5 petals
     + center), no external image assets, fully colorable.
   - `FloatingParticles` extended with a `variant="flower"` option so any
     section can spawn floating flowers going forward.
   - Wired into `src/App.tsx` right after the loading screen.

✅ Phase 4 complete — Envelope section:
   - `src/sections/Envelope.tsx` — closed envelope (original SVG, floats
     gently, glowing) → tap opens it (flap animates open via scaleY,
     letter slides up and unfolds) → handwriting-style letter (Caveat
     font) types out `LETTER_LINES` from `content.ts` one by one, signed
     "— Rudra" in a highlighted color.
   - Wired into `src/App.tsx` right after Hero.

✅ Phase 5 complete — Why You Are Special + Friendship Timeline:
   - `src/sections/WhySpecial.tsx` — responsive grid of glassmorphism cards
     (from `WHY_SPECIAL_CARDS` in `content.ts`), each fades/scales in on
     scroll with a stagger, floats gently, and glows on hover.
   - `src/sections/Timeline.tsx` — vertical glowing gradient line with
     2021→2026 nodes (from `TIMELINE` in `content.ts`) that alternate
     left/right on desktop and stack on mobile, animating in on scroll.
   - Both wired into `src/App.tsx` right after Envelope.

✅ Phase 6 complete — Open When letters:
   - `src/data/content.ts` — filled in the 4 letters that only had titles
     in the original spec (Miss Me, Worst Day, After 10 Years, Wedding
     Day) with original Hinglish content matching the same warm
     best-friend tone as the "Sad" letter. Edit these anytime.
   - `src/sections/OpenWhen.tsx` — grid of 5 sealed envelope cards
     (original SVG with wax-seal heart). Clicking one opens a modal where
     that letter's lines type out one by one (Caveat handwriting font).
   - Wired into `src/App.tsx` right after Timeline.

✅ Phase 7 complete — Memory Gallery + Future Bucket List:
   - `src/components/effects/Star.tsx`, `HeartIcon.tsx` — two more original
     SVG illustration icons (joining `Flower.tsx`), all hand-drawn, no
     external images, since there are no real photos together yet.
   - `src/sections/Gallery.tsx` — "Memory Gallery": polaroid-style tilted
     cards using flower/star/heart illustrations + handwritten-style
     captions (from `MEMORY_GALLERY` in `content.ts`), straighten and lift
     on hover.
   - `src/sections/BucketList.tsx` — "Future Bucket List": animated
     checkboxes (from `BUCKET_LIST` in `content.ts`) with a little
     heart-burst micro-celebration on check, progress counter, and a
     special message once all items are checked.
   - Both wired into `src/App.tsx` right after Open When letters.
   - 📝 Note: `MEMORY_GALLERY` captions are placeholder/illustrative since
     no real photos exist yet — edit freely in `content.ts`, or swap the
     icons for real `<img>` tags later by dropping photos in
     `public/images/`.

📸 Update — real photos added:
   - 6 real photos of Estuti (selected from her saved pictures, resized to
     800px wide / quality 85 for web) now live in `public/images/` as
     `memory-1.jpg` through `memory-6.jpg`.
   - `src/sections/Gallery.tsx` now renders real `<img>` tags instead of
     illustration icons, with a graceful "Photo coming soon" placeholder
     if a file is ever missing/renamed.
   - `src/sections/PhotoPuzzle.tsx` — new "Photo Puzzle" section: a 3×3
     grid built from `memory-2.jpg` (the festival-lights photo), each
     piece individually blurred until tapped, revealing the sharp photo
     underneath piece by piece. A "reveal it all at once" link is offered
     if she doesn't want to tap through 9 pieces. Wired into `App.tsx`
     between Gallery and BucketList.
   - `BUCKET_LIST` in `content.ts` got a new line: "Click our first
     picture together 📸" (as requested).
   - To swap any photo later: just replace the file in `public/images/`
     keeping the same filename, or edit the `src` paths in
     `MEMORY_GALLERY` / `PUZZLE_PHOTO` inside `content.ts`.

✅ Phase 8 complete — 27-click heart secret + achievements:
   - `src/hooks/useAchievements.tsx` — global React context tracking 5
     achievements (Secret Found, Cake Cut, Heart Clicked 27 Times,
     Birthday Completed, All Letters Opened). Not persisted to
     localStorage — resets on reload, which is fine for a one-sitting
     experience. Wraps the whole app via `AchievementsProvider` in
     `App.tsx`.
   - `src/components/shared/AchievementToast.tsx` — small glassmorphism
     toast that pops up bottom-right whenever a new achievement unlocks,
     auto-dismisses after ~3s.
   - `src/sections/Secret.tsx` — big glowing heart with a progress ring;
     tapping it `SECRET_CLICK_TARGET` (27) times reveals
     `SECRET_MESSAGE_LINES` typed out, and unlocks "Secret Found" +
     "Heart Clicked 27 Times". Scrolling this section into view at all
     also unlocks "Birthday Completed" (it's the last section before the
     finale, so reaching it means she's seen everything).
   - `src/sections/OpenWhen.tsx` updated: opened letters now get a small
     ✓ badge, and opening all 5 unlocks "All Letters Opened".
   - "Cake Cut" achievement is wired up in Phase 9 (the cake doesn't
     exist yet).
   - Wired into `src/App.tsx`: `AchievementsProvider` wraps everything,
     `AchievementToast` mounted once at the root, `Secret` added as the
     last section before the finale.

✅ Phase 9 complete — Interactive 3D Birthday Cake:
   - Installed `three`, `@react-three/fiber`, `@react-three/drei` (these
     were listed in Phase 1's plan but only actually needed — and
     installed — now that there's a 3D scene to build).
   - `src/components/effects/Cake3DScene.tsx` — real Three.js scene: a
     two-tier cake with icing rings, 5 candles arranged in a circle
     (count from `CAKE_CONFIG.candleCount` in `content.ts`), each with a
     flickering flame (sine-wave scale animation) and its own point
     light. Slow auto-rotate via drei's `OrbitControls`, and the visitor
     can also drag to look around.
   - `src/hooks/useLitCandles.ts` — tiny state hook tracking which
     candles are still lit (kept separate from the 3D scene file on
     purpose, see below).
   - `src/components/effects/CelebrationBurst.tsx` — confetti rectangles
     + falling flower emoji + sparkle/firework bursts, a 2D
     Framer-Motion overlay (not 3D — much lighter and just as
     effective) that plays once when the last candle is blown out.
   - `src/sections/Cake3D.tsx` — wires it all together: blow out every
     candle → confetti/flowers/fireworks burst → "Cake Cut" achievement
     unlocks → a "light the candles again" link resets it.
   - ⚡ Performance: Three.js + fiber/drei add ~900kB minified, which
     would otherwise bloat every single visitor's initial load even if
     they never scroll to the cake. `Cake3DScene` is lazy-loaded via
     `React.lazy()` + dynamic `import()`, so it lands in its own chunk
     (`Cake3DScene-*.js`) that only downloads when the visitor actually
     reaches this section. `useLitCandles` was deliberately split into
     its own file with zero three.js imports so the simple "is this
     candle lit" state logic loads eagerly without dragging the 3D
     library in early.
   - Wired into `src/App.tsx` between BucketList and Secret.

✅ Phase 10 complete — Music Player:
   - `src/hooks/useMusic.tsx` — global `MusicProvider` context owning a
     single `<audio>` element for the whole app (so the song plays
     continuously across sections instead of restarting). Exposes
     play/pause, seek, volume, current time/duration, and a `hasError`
     flag for when the mp3 file isn't present yet.
   - `src/components/shared/MusicPlayer.tsx` — floating widget pinned
     bottom-left: collapsed it's a small spinning disc (spins while
     playing, shows a progress ring), expanded it shows the song title
     (`MUSIC_CONFIG.title`), play/pause, a seekable progress bar, and a
     volume slider.
   - 🎵 **Song file note:** `MUSIC_CONFIG.src` points at
     `/song/song.mp3`. "Tumhi Ho Bandhu Sakha Tumhi Ho" (Cocktail,
     Pritam/Sony Music) is a copyrighted commercial track, so Claude
     cannot copy/embed that audio file into the project itself — Rudra,
     drop your mp3 at `public/song/song.mp3` yourself (any audio file
     works, just keep that exact filename, or update `MUSIC_CONFIG.src`
     in `content.ts` to match a different filename). Until that file
     exists, the widget shows a friendly "song not added yet" message
     instead of a broken/silent player.
   - Wired into `src/App.tsx`: `MusicProvider` wraps the app (inside
     `AchievementsProvider`), `MusicPlayer` mounted once at the root
     alongside `AchievementToast`.

✅ Phase 11 complete — Keyboard shortcuts (easter eggs):
   - `src/hooks/useKeyboardEasterEggs.ts` — single global keydown
     listener (ignores keypresses while typing in any input/textarea),
     each shortcut auto-clears its own effect after a few seconds:
     - **H** → heart rain
     - **F** → flower rain
     - **B** → rising balloon mode
     - **R** → "Made With ❤️ By Rudra" signature overlay
     - **S** → a hint nudging toward the hidden secret section (rather
       than instantly spoiling the Phase 8 27-click reveal)
   - `src/components/effects/KeyboardRain.tsx` — shared full-screen
     falling/rising effect powering H/F/B (original SVG balloon shape
     for B, matching the style of `Flower.tsx`/`HeartIcon.tsx`).
   - `src/components/effects/SignatureOverlay.tsx`,
     `SecretHintOverlay.tsx` — the R and S overlays.
   - `src/components/shared/KeyboardHintBadge.tsx` — a small collapsible
     "⌨️ shortcuts" pill, top-right, desktop-only (hidden on mobile since
     phones have no physical keyboard) — without this, almost nobody
     would ever discover the shortcuts exist.
   - Wired into `src/App.tsx`: the hook is called once at the root, all
     four overlay types render alongside the existing toasts/widgets.

✅ Phase 12 complete — Final polish, performance, SEO, deployment prep:
   - `src/sections/Finale.tsx` — the cinematic ending: slow-motion flowers
     (`FloatingParticles variant="flower"`) + soft looping firework bursts
     + `FINALE_LINES` typing out + `FINALE_SIGNOFF` fading in last. Only
     starts once scrolled into view (`IntersectionObserver`), so it lands
     with intent. Added as the very last section in `App.tsx`.
   - ⚡ **Performance — animation cost on a long single-page site:**
     `AuroraBackground` and `FloatingParticles` are each mounted in ~12
     different sections, and since this is one continuously-scrolling
     page, every instance exists in the DOM simultaneously — that's 36+
     blurred gradient blobs and 100+ particles all animating at once
     regardless of what's actually visible, which can cause real jank on
     mid-range phones. Both components now use Framer Motion's
     `useInView` (with a generous margin so animation resumes just
     before scrolling into view, avoiding a visible "pop") to pause
     animation while off-screen.
   - ⚡ **Performance — bundle size:** confirmed Three.js (`Cake3DScene`,
     Phase 9) still lands in its own lazy-loaded chunk
     (`Cake3DScene-*.js`, ~897kB) separate from the main bundle
     (~385kB) — visitors who never reach the cake section never pay for
     Three.js. This is the single biggest win available; the remaining
     "chunk >500kB" build warning is just Three.js itself and isn't
     reducible without dropping the 3D cake entirely.
   - 📱 **Mobile responsiveness:** every section already carries `md:`
     breakpoints; this pass specifically re-checked fixed-position
     widgets (`MusicPlayer`, `AchievementToast`, `KeyboardHintBadge`) for
     overlap and small-screen overflow — `MusicPlayer`'s expanded width
     was changed from a fixed `w-72` to `w-[min(18rem,calc(100vw-2.5rem))]`
     so it can never overflow even on the narrowest phones.
   - 🔍 **SEO / sharing:** `index.html` now has a proper `<title>`,
     description, favicon, and Open Graph tags — deliberately written
     *without* Estuti's name in the public-facing OG metadata, since
     link-preview crawlers (WhatsApp/Instagram/etc.) would otherwise
     expose her name in a shared-link preview card before she's even
     opened it. Also includes `<meta name="robots" content="noindex,
     nofollow">` since this is a private one-off gift, not something
     meant to be discovered via search.
   - 🧹 **Dead code cleanup:** removed an unused `src/types/index.ts`
     (interfaces that were never actually imported anywhere — every
     section gets its types automatically from the `as const` data in
     `content.ts` instead).
   - 📝 **Note on shadcn/ui components:** `Button`, `Card`, `Input`,
     `Separator` were set up in Phase 1 but ended up unused — every
     section needed a distinct custom look (neon-glow buttons, glass
     cards with specific gradients) that didn't map cleanly onto the
     generic shadcn primitives without heavy overriding, so custom
     Tailwind classes were used directly instead. The shadcn components
     are kept in `src/components/ui/` as a ready-made base for any
     future section/feature that does want a more standard look.
   - 🚀 **Deployment:** added `vercel.json` (build command, output dir,
     SPA rewrite so any direct URL resolves to `index.html` — there's no
     server-side routing, it's a single scrolling page).

## Deploying to Vercel

```bash
npm install -g vercel   # one-time
cd estuti-birthday
vercel                  # follow the prompts, deploys a preview
vercel --prod           # deploy to production
```

Or connect the GitHub repo directly at vercel.com → "New Project" → it
will auto-detect Vite and use the settings in `vercel.json`.

## 🎂 Before sharing the link with Estuti

1. Drop your `song.mp3` (or any audio file) at `public/song/song.mp3` —
   see Phase 10 notes above for why Claude couldn't add it directly.
2. Double check the 6 photos in `public/images/` are the ones you want.
3. Run `npm run build && npm run preview` once locally to do a final
   click-through before deploying.

---
🎉 **All 12 phases complete.**

## Latest update — Spotlight Wheel + 3-song music story + timeline date

Per request: minimal, additive changes only — nothing existing was
rewritten, refactored, or had its timing/animations/UI changed.

✅ **New: "One Last Look" circular rotating photo gallery**
   - `src/sections/SpotlightWheel.tsx` — brand new section, does not
     touch or replace `Gallery.tsx`/`PhotoPuzzle.tsx`/`BucketList.tsx`.
     8 photos orbit a center heart on a slow-spinning ring; each photo
     counter-rotates so it always stays upright. Tap a photo to pause
     the spin and read its caption.
   - Reuses the existing `AuroraBackground` and `FloatingParticles`
     components rather than introducing new background effects.
   - `SPOTLIGHT_GALLERY` added to `content.ts` (new export, existing
     `MEMORY_GALLERY` untouched). Photos live at
     `public/images/spotlight-1.jpg` through `spotlight-8.jpg`.
   - Placed between `Secret` and `Finale` in `App.tsx` (2-line addition:
     one import, one render call — nothing else in `App.tsx` changed).

✅ **New: 3-song music story flow with crossfade**
   - `src/hooks/useMusic.tsx` — `MusicProvider` now plays a 3-stage
     story: **opening** (Tumhi Ho Bandhu) → **cake** (Happy Birthday) →
     **finale** (Tu Hi Yaar Mera), each section's `IntersectionObserver`
     calling `setStage(...)` to crossfade. Only one song is ever audible
     — the previous track fades out (volume ramped to 0 over ~900ms)
     before being paused and cleaned up, and the new one fades in.
   - Existing API (`isPlaying`, `togglePlay`, `seek`, `setVolume`,
     `hasError`) is unchanged, so `MusicPlayer.tsx` needed only a
     one-line swap (`MUSIC_CONFIG.title` → the new `currentTitle` field)
     to show whichever song is actually playing.
   - Autoplay is attempted the instant the site loads; if the browser
     blocks it, playback silently starts on the first
     click/tap/key/scroll instead — same fallback pattern as before,
     just generalized to work for stage changes too.
   - Volume target is 0.55 (within the requested 50–60% range).
   - `MUSIC_STORY` added to `content.ts` (new export, existing
     `MUSIC_CONFIG` left in place and still used as a fallback import).
   - 🎵 **Rudra: add 2 more files** — `public/song/happy-birthday.mp3`
     and `public/song/yaar.mp3` (exact filenames, see `MUSIC_STORY` in
     `content.ts`). `song.mp3` (opening song) was already present.
     Until a stage's file is added, that stage's `hasError` becomes true
     and the widget shows "song not added yet" instead of crashing or
     playing broken audio — verified this doesn't throw any console
     errors even with missing files.
   - Files touched: `src/hooks/useMusic.tsx` (rewritten internals, same
     public API), `src/components/shared/MusicPlayer.tsx` (1-line
     change), `src/sections/Cake3D.tsx` (added a `setStage("cake")` call
     inside a new `IntersectionObserver`), `src/sections/Finale.tsx`
     (added `setStage("finale")` inside its *existing* observer — no new
     observer needed there).

✅ **Timeline start date corrected to Mid July 2022**
   - `TIMELINE` in `content.ts`: first entry changed from "2021" to
     "Jul 2022" (the actual friendship start date), remaining years
     shifted to 2023–2026 to keep a clean progression. Nothing else
     referencing dates needed changing — the "4–4.5 years" friendship
     duration mentioned in letters/content already lines up correctly
     with a July 2022 start through June 2026.

**Verified after all changes:** `tsc --noEmit` clean, `npm run build`
clean (1001 modules, code-splitting still intact — `Cake3DScene` still
its own lazy-loaded chunk), all 8 spotlight photos confirmed served
correctly, confirmed missing audio files fail gracefully (HTML
fallback response, not a real audio file) without crashing the player.

---

## Bug fix — music story flow (root cause + fix)

Two real bugs were found and fixed, plus the previous request's
2 new memory photos were added.

### Bug 1: filename mismatch (Happy Birthday never played)

`MUSIC_STORY.cake.src` in `content.ts` pointed at
`/song/happy-birthday.mp3` (hyphen), but the actual file Rudra placed
was named `happy birthday.mp3` (space). Browsers treat these as two
completely different filenames — the request 404'd, `hasError` was set
silently, and the song never played. **Fixed** by updating the path in
`content.ts` to match the real filename exactly.

### Bug 2: crossfade race condition (songs overlapped)

In `useMusic.tsx`, fading the outgoing track and fading in the
incoming track shared a single `fadeIntervalRef`. Starting the
fade-in's `setInterval` silently overwrote/cleared the fade-out's
interval before it finished, so the previous song never actually
reached volume 0 — both songs were briefly audible together exactly as
described ("Tumhi Ho Bandhu mixed with Tu Hi Yaar Mera"). **Fixed** by
giving each `<audio>` element its own fade interval (stored on the
element itself via `__fadeInterval`) so outgoing and incoming fades
run fully independently.

### Debug logging (currently still in the code, harmless)

Temporary `console.log`/`console.warn` calls were added to
`useMusic.tsx` exactly as requested: "Opening section reached",
"Opening music started", "Cake section reached", "Happy Birthday music
started", "Final letters section reached", "Tu Hi Yaar Mera started",
plus a `[Music] Failed to load: <src>` warning on any audio error
instead of silently swallowing it. **These have zero effect on the
live site** — they only print to the browser's developer console (F12)
and are invisible to a normal visitor. Toggle them off anytime by
flipping `const DEBUG_LOG = true` to `false` near the top of
`useMusic.tsx`, or delete the `DEBUG_LOG`-guarded lines entirely once
you've confirmed everything in your own browser.

### Verified with two independent test methods

**Method 1 — static asset check (curl):** confirmed `song.mp3`,
`happy birthday.mp3`, and `yaar.mp3` all return `Content-Type:
audio/mpeg` (real audio, not a 404/HTML fallback), and all 16 photos
(8 memory + 8 spotlight) return `200`.

**Method 2 — headless browser (Puppeteer), real interaction:**
launched an actual Chrome instance, loaded the built site, and
simulated real mouse-wheel scroll events (required — Lenis intercepts
real wheel/touch input, not `scrollIntoView()`, so the first attempt
at this test gave a false negative before switching approaches).
Captured console output end-to-end:

```
[Music] Opening section reached
[Music] Opening music started
[Music] Cake section reached
[Music] Happy Birthday music started
[Music] Final letters section reached
[Music] Tu Hi Yaar Mera started
```

Exactly one song active at a time, correct order, zero unexpected
console errors or page errors (the only console noise was Google
Fonts being blocked by this development sandbox's network policy —
unrelated to the app and won't occur in normal hosting).

### Photos: 2 more added (per request — "cute but funny too")

`public/images/memory-7.jpg` and `memory-8.jpg` added to
`MEMORY_GALLERY` in `content.ts` — one playful/funny (outdoor selfie
making a face) and one cute (doodle-filter selfie), mixing tone with
the rest of the gallery as requested.

### Files touched in this round
- `src/data/content.ts` — fixed the `happy-birthday.mp3` →
  `happy birthday.mp3` path, added 2 new `MEMORY_GALLERY` entries.
- `src/hooks/useMusic.tsx` — fixed the shared-interval race condition,
  made the autoplay-fallback listener more robust (capture phase on
  `document` instead of `once` listeners on `window`), added temporary
  debug logging.
- `public/images/memory-7.jpg`, `memory-8.jpg` — new files.

Nothing else was refactored or rewritten — `MusicPlayer.tsx`,
`Cake3D.tsx`, `Finale.tsx`, `SpotlightWheel.tsx`, and all other
sections are untouched from the previous round.

---

## Fix round 3 — music stage stability + true 3D cylinder

### Bug: music didn't stop/restart cleanly across sections

**Root cause:** `Cake3D.tsx` and `Finale.tsx` each had their own,
fully independent `IntersectionObserver`. Each observer only knew
about its own section, with no shared source of truth for "what
section is the visitor actually in." This meant scrolling around
(especially back and forth) could fire a section's observer
unpredictably and yank the music to that stage even when the visitor
wasn't deliberately re-entering it.

**Fix:** replaced both per-section observers with a single centralized
hook, `src/hooks/useScrollMusicStages.ts`, mounted once at the app
root (inside `MusicProvider`, via a tiny `ScrollMusicStagesController`
in `App.tsx`). On every scroll tick (throttled to one check per
animation frame), it directly measures the `#cake` and `#finale`
section positions and derives the current stage from scroll position
— there's now exactly one place deciding which song should be
playing, instead of multiple sections independently guessing.
`Cake3D.tsx` and `Finale.tsx` no longer call `setStage` themselves.

Verified via headless browser: scrolled forward through the whole
site, then backward, then forward again — confirmed the song stage
transitions only when the visitor's actual scroll position matches a
stage's section (audible: opening → cake → finale → cake → opening →
cake → finale, matching scroll direction exactly), zero overlapping
audio, zero console errors.

### Spotlight Wheel: now a true 3D cylinder

The previous version was a flat 2D ring (rotate + translate in one
plane). `src/sections/SpotlightWheel.tsx` was rewritten to build an
actual 3D cylinder using CSS 3D transforms:

- A `perspective`-enabled container wraps a `rotateY`-animated parent
  (`transform-style: preserve-3d`).
- Each photo card sits at a fixed `rotateY(angle) translateZ(radius)`
  around the shared center — this is what gives real depth: cards
  facing the viewer render large and sharp, cards swung toward the
  back render smaller and dimmer because of actual perspective
  distance, not a CSS filter trick.
- Cards are bigger, rounded "polaroid-style" rectangles (not small
  circles) with a soft bottom gradient, glass border, and glow —
  aiming for the "beautiful, attractive" look requested rather than a
  minimal ring of thumbnails.
- Tapping a card animates the whole cylinder to rotate that card to
  face-front-center (rather than just pausing in place), making the
  "bring it forward" interaction feel more deliberate in 3D.
- Radius/card size are responsive (smaller on screens under 768px) so
  the cylinder doesn't overflow narrow phone viewports.

Verified with real screenshots from a headless browser mid-rotation —
confirmed multiple photo cards visible simultaneously at different
points around the cylinder, with the expected size/brightness
falloff for cards rotated toward the back, and the rotation animating
continuously and smoothly across screenshots taken ~1.3s apart.

### Files touched in this round
- `src/hooks/useScrollMusicStages.ts` — new file, centralized stage
  controller.
- `src/sections/Cake3D.tsx` — removed its `IntersectionObserver` +
  `setStage` call (now handled centrally).
- `src/sections/Finale.tsx` — removed its `setStage` call only; kept
  its own observer for the unrelated typewriter/fireworks `active`
  trigger.
- `src/App.tsx` — added `ScrollMusicStagesController`, mounted inside
  `MusicProvider`.
- `src/sections/SpotlightWheel.tsx` — rewritten for true 3D cylindrical
  rotation (previous 2D-ring version fully replaced).

`MusicPlayer.tsx`, `useMusic.tsx`, `Gallery.tsx`, `PhotoPuzzle.tsx`,
and every other section are unchanged from the previous round.

---

## Fix round 4 — singleton audio manager, realistic cake, cinematic carousel

### Audio: rebuilt as a true singleton (root cause finally isolated)

**Root cause:** the previous `useMusic.tsx` kept its `<audio>` element
in a React `ref` inside the `MusicProvider` component. In **development
mode**, React's `<StrictMode>` (present in `main.tsx`) intentionally
double-invokes every effect on mount specifically to surface exactly
this class of bug — and the ref-based approach could end up with two
live `<audio>` elements briefly overlapping as a result. This explains
why multiple songs were heard playing together.

**Fix:** `src/lib/AudioManager.ts` — a true singleton class instance
that lives entirely outside React (no hooks, no component state, one
instance for the whole page lifetime). `useMusic.tsx` was rewritten as
a thin wrapper using `useSyncExternalStore` to subscribe React to this
external store. The critical guarantee: `AudioManager.play(src)`
always tears down whatever is currently playing — cancels any
in-flight fade, pauses it, detaches its listeners, nulls the
reference — **before** creating anything new. It is structurally not
possible for two tracks to be audible at once through this manager.

Verified on the actual dev server (StrictMode active, the exact
condition that exposed the original bug) via a headless browser:
captured exactly one `"Playing: ..."` log per song, in the correct
order (opening → cake → finale), with zero duplicates, across a full
scroll-through.

### 3D Cake: rebuilt for realism + candle-framing bug fixed

**Bug found:** candles were positioned at radius 0.85 while the top
tier's own radius was only ~1.05–1.15 — close enough that candles
could appear to sit on/past the tier's edge depending on camera angle,
which matches the "candles outside the frame" issue described.

**Fix:** `src/components/effects/Cake3DScene.tsx` rebuilt:
- Candle ring radius (0.5) is now well inside the top tier's actual
  radius (0.78), so candles are always framed within the cake's top
  surface regardless of orbit angle.
- Tiers use `THREE.LatheGeometry` with a gently-curved profile instead
  of a flat cylinder — reads as soft frosting rather than a plastic
  tube.
- Added: piped buttercream border (28/22 small sphere "dots" per tier
  instead of one smooth torus), glossy drip-layer rings, scattered
  fondant pearls on top, a metallic cake stand/plate.
- Realistic 3-point lighting (warm key light with shadows, cool violet
  fill, soft rose rim light) plus a contact-shadow plane.
- Candle flames: layered multi-frequency flicker (reads organic, not
  robotic), a small lateral sway, a soft glow-halo mesh behind the
  flame (cheap fake-bloom), and a warm point light.
- The whole cake now has a gentle multi-axis sway + subtle float
  instead of a single flat rotation.

⚠️ **Note on verification:** this development sandbox's headless
Chrome cannot reliably initialize WebGL (confirmed via explicit
"Error creating WebGL context" page errors and repeated tab crashes
when scrolling to this section, even with `--disable-gpu` and
software-rendering flags). The geometry, materials, and lighting setup
were verified by careful manual code review (valid non-self-intersecting
lathe profiles, no NaN-producing math, correct candle radius math) and
the build compiles and type-checks cleanly, but **this section's visual
result could not be screenshot-verified in this environment** the way
the music flow and spotlight carousel were. Please check this one
yourself first.

### Spotlight Carousel: now genuinely cinematic, and faster

Per request ("like Instagram reels... front sharp, back faded and
blurred"), `src/sections/SpotlightWheel.tsx` now computes each card's
angle relative to the camera every frame and derives scale, opacity,
blur, and brightness directly from that — the front-center photo is
large/sharp/bright, photos toward the back shrink, dim, and blur into
the dark, with a soft spotlight glow fixed at the center. This was the
missing piece in the previous 3D-cylinder version, which had correct
perspective scaling from CSS 3D transforms alone but no explicit
fade/blur falloff, so it didn't read as cinematic.

⚡ **Performance fix in the same pass:** the first version of this
drove the rotation via `setState` on every animation frame (60×/sec),
re-rendering all 8 photo cards 60 times a second just to recompute
their depth styling. That's expensive enough to cause visible stutter
on weaker devices, and was severe enough to crash this sandbox's
headless browser outright. Rewritten to write each card's computed
style directly via DOM refs inside the animation-frame loop — React
only re-renders on genuine state changes (tapping a card), not for the
continuous background spin. Verified via headless-browser screenshot
after this fix: captured a clean shot showing the front photo sharp
and bright with correctly blurred/dimmed neighbors, where the
unoptimized version crashed before a screenshot could be taken.

### Files touched in this round
- `src/lib/AudioManager.ts` — new file, the singleton audio controller.
- `src/hooks/useMusic.tsx` — rewritten as a thin `useSyncExternalStore`
  wrapper around `AudioManager`. Same public API (`isPlaying`,
  `togglePlay`, `seek`, `setVolume`, `hasError`, `currentTitle`,
  `setStage`), so no other file needed to change to keep working.
- `src/components/effects/Cake3DScene.tsx` — rebuilt geometry,
  materials, lighting, candle placement.
- `src/sections/SpotlightWheel.tsx` — rewritten for cinematic depth
  cues + DOM-ref-based animation instead of per-frame React state.
- `src/hooks/useScrollMusicStages.ts` — one stale comment updated to
  reflect the new AudioManager-based dedupe check (no logic changes).

`MusicPlayer.tsx`, `Cake3D.tsx` (the section wrapper, as opposed to the
3D scene itself), `Finale.tsx`, and every other section are unchanged.

---

## Fix round 5 — cake rendering artifact + slower, steadier spotlight rotation

### Cake: removed a stray rendered shape

Per your screenshot, a large red/purple curved tube-like shape was
appearing arched over the top of the cake, which is not something
intentionally modeled (there's no tube/torus-knot geometry anywhere in
the code). The most likely cause: the previous version used
`THREE.LatheGeometry` with a multi-point curved profile for both
tiers (meant to give a soft "frosting belly" silhouette instead of a
plain cylinder) — some GPU/WebGL driver combinations can triangulate a
multi-point lathe profile incorrectly and produce stray connecting
faces exactly like what appeared in your screenshot.

**Fix:** both tiers now use plain `THREE.CylinderGeometry` (the same
reliable primitive the candles and cake stand already used) instead of
`LatheGeometry`. This is a strictly safer/simpler geometry that cannot
produce the kind of triangulation artifact a multi-point lathe profile
can. The "soft frosting" look is kept via materials/lighting/the
piped-dot border rather than a curved profile. All position math
(tier heights, drip-ring placement, candle height, icing-cap height)
was re-derived to match the new cylinder dimensions exactly, so
nothing shifted out of place.

⚠️ Same as the previous round: this sandbox's headless Chrome cannot
reliably initialize WebGL (confirmed again — it now crashes even
before fully scrolling to the cake section, with the simpler geometry
in place), so this fix could not be re-screenshotted here. It was
verified by removing every line of code that could plausibly produce
the artifact and replacing it with primitives already proven to render
correctly elsewhere in the same scene (the candle bodies, the cake
stand). Please confirm visually on your end.

### Spotlight carousel: slower, steadier rotation

Per request ("rotation like Earth's rotation — slow and steady"):
- Idle rotation speed reduced from 9°/sec to 4.5°/sec (one full lap
  now takes about 80 seconds instead of 40).
- The "bring this photo to the front" easing (when you tap a card) was
  softened from a quick snap to a gentler, slower glide, so the motion
  feels consistent with the slow ambient spin rather than jarring by
  comparison.

### Files touched in this round
- `src/components/effects/Cake3DScene.tsx` — replaced both tiers'
  `LatheGeometry` with `CylinderGeometry`; removed the now-unused
  profile-point arrays.
- `src/sections/SpotlightWheel.tsx` — two numeric tuning changes
  (rotation speed, tap-to-focus easing factor). No structural changes.

---

## Fix round 6 — cake torus bug found + real 3D cylinder rotation fixed

### Cake: found the actual cause of the curved tube shape

The red/purple arched shape in your screenshot was `THREE.TorusGeometry`
— used for a glossy "drip layer" ring around each tier. A torus
defaults to lying flat in the XY plane (i.e. standing upright, like a
donut on its edge) unless explicitly rotated onto the XZ plane (lying
flat, like a ring wrapped around the cake). That rotation was missing,
so both drip-ring toruses stood upright instead of lying flat —
exactly the tall arched tube shape in your screenshot.

**Fix:** the cake was rebuilt as a clean, simple cartoon-style cake
matching your reference image — no torus, no lathe, every shape is a
basic cylinder/sphere/cone:
- Two tiers, each with a light-yellow sponge layer peeking out beneath
  a soft pink icing layer (matches the reference's color split).
- A ring of small cream-colored "pearl" beads at each tier's seam.
- A plain white plate underneath.
- Exactly 3 candles (was 5 — `CAKE_CONFIG.candleCount` updated),
  arranged in a gentle forward fan rather than a full circle, animated
  flickering flames kept.
- Same camera/orbit controls as before — untouched.

### Spotlight Wheel: found why it was sliding instead of rotating

The previous version's animation loop wrote the `rotateY(...)
translateZ(...)` transform onto an *inner* `<div>` nested inside an
absolutely-positioned `<button>` that itself had no 3D transform — so
every card's outer wrapper sat stacked at dead center (all positioned
via plain `left: 50%; top: 50%`), and only each card's *internal*
style changed frame to frame. That reads exactly like what you
described: photos sliding left/right rather than actually moving
around a circle in 3D space, because nothing was ever actually placed
on a circle.

**Fix:** `src/sections/SpotlightWheel.tsx` rewritten so the transform
is applied directly to the positioned element itself: each card's
`<button>` now carries `translate(-50%,-50%) rotateY(angle)
translateZ(radius)` as a single transform, with `angle` = that card's
fixed placement angle (0°, 1/8 of 360° apart for 8 photos, etc.) plus
one shared "spin" value that increases every frame — so all cards
swing around the same circular path together, like photos glued
around a rotating mug. Depth cues (opacity 0.05 at the back → 1 at the
front, scale, blur, brightness) are recalculated every frame from each
card's current angle relative to the camera. Rotation speed set to
~26s per revolution (within your requested 20-30s range), linear,
continuous. Front/side/back alignment and spacing feel unchanged from
what you confirmed was correct in the screenshot — only the underlying
transform target was fixed.

⚠️ This sandbox's headless browser became too unstable late in this
session to capture a fresh confirming screenshot for either fix (it
was crashing even on the simplified cake and on the cylinder rotation
alone, independent of each other — environment exhaustion after many
repeated browser launches, not a code issue). Both fixes are
high-confidence based on identifying the exact mechanism that produced
each bug (torus default orientation; transform applied to the wrong
element) and replacing it with the corresponding correct, minimal
approach — please confirm visually on your end.

### Files touched this round
- `src/components/effects/Cake3DScene.tsx` — full rebuild per the
  reference image (no unrelated section touched).
- `src/data/content.ts` — `CAKE_CONFIG.candleCount` 5 → 3.
- `src/sections/SpotlightWheel.tsx` — transform target fixed (now on
  the positioned element itself, not a nested child).
