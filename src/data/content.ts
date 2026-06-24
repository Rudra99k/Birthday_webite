// ============================================
// PERSONAL INFO + ALL TEXT CONTENT
// Edit only here — every section pulls from this file.
// ============================================

export const PEOPLE = {
  her: "Estuti",
  him: "Rudra",
  nicknames: {
    motuuu: "Motuuu",
    motiii: "Motiii",
    chudail: "Chudail",
  },
  friendshipYears: "4–4.5",
} as const;

export const THEME = {
  language: "Hinglish",
  vibe: "Dark premium, pink-purple glow, glassmorphism, Apple-level UI",
} as const;

// Phase 2 will consume this
export const LOADER_LINES: string[] = [
  "Initializing Friendship.exe",
  "Loading memories...",
  "Connecting hearts across distance...",
  "Welcome Motuuu ❤️",
];

// Phase 3 will consume this
export const HERO_TYPEWRITER_LINES: string[] = [
  "Hey Motiii ❤️",
  "Aaj ka din special hai...",
  "Kyuki duniya ki sabse pyari chudail ka birthday hai 🎂✨",
];

export const HERO_TITLE = "Happy Birthday Estuti ❤️";
export const HERO_SUBTITLE =
  "Distance may separate us, but friendship keeps us close forever ❤️";

// Phase 4 will consume this
export const LETTER_LINES: string[] = [
  "Dear Motuuu ❤️",
  "4-4.5 saal ka safar pata hi nahi chala.",
  "Chahe kitni bhi distance ho,",
  "Tu hamesha meri life ka important part rahegi.",
  "Tu hasi hai ❤️",
  "Tu support hai ❤️",
  "Tu pagalpan hai ❤️",
  "Aur sabse pyari chudail bhi 😂❤️",
  "Thank you for being my best friend.",
  "Happy Birthday Motiii ❤️✨",
  "— Rudra",
];

// Phase 5 will consume this
export const WHY_SPECIAL_CARDS = [
  { emoji: "❤️", text: "Because you always understand me" },
  { emoji: "🌸", text: "Because you make bad days better" },
  { emoji: "✨", text: "Because our friendship survived distance" },
  { emoji: "😂", text: "Because you are my favorite chudail" },
  { emoji: "❤️", text: "Because you are irreplaceable" },
] as const;

export const TIMELINE = [
  { year: "Jul 2022", text: "Beginning of friendship ❤️" },
  { year: "2023", text: "Crazy memories 😂" },
  { year: "2024", text: "Distance but stronger bond 🌸" },
  { year: "2025", text: "Countless talks ✨" },
  { year: "2026", text: "Still best friends ❤️" },
] as const;

// Phase 6 will consume this
export const OPEN_WHEN_LETTERS = [
  {
    id: "sad",
    title: "Open When You Are Sad ❤️",
    lines: [
      "Motuuu ❤️",
      "Agar kabhi sad ho,",
      "Ya lage ki sab galat chal raha hai,",
      "To bas yaad rakhna,",
      "Tu akeli nahi hai ❤️",
      "Aur tera ye pagal best friend hamesha tere saath hai.",
      "Smile kar pagli 😊✨",
      "— Rudra",
    ],
  },
  {
    id: "miss-me",
    title: "Open When You Miss Me ❤️",
    lines: [
      "Motiii ❤️",
      "Agar tu ye letter padh rahi hai,",
      "Matlab tu mujhe miss kar rahi hai right now.",
      "Toh suniye Madam,",
      "Main bhi kahin door nahi gaya.",
      "Bas ek message door hoon, hamesha ❤️",
      "Distance kabhi bhi friendship se bada nahi ho sakta.",
      "— Rudra",
    ],
  },
  {
    id: "worst-day",
    title: "Open On Your Worst Day ❤️",
    lines: [
      "Chudail 😂❤️",
      "Aaj ka din bahut bekar gaya na?",
      "Sun, kharaab din hamesha nahi rehte.",
      "Tu unse strong hai jitna tu sochti hai.",
      "Aur jab bhi sab heavy lage,",
      "Yaad rakhna — main proud hoon tujhpe,",
      "Kal phir se naya din hoga ❤️",
      "— Rudra",
    ],
  },
  {
    id: "after-10-years",
    title: "Open After 10 Years ❤️",
    lines: [
      "Estuti,",
      "Agar tu ye 10 saal baad padh rahi hai,",
      "Toh pehle batao — life kaisi chal rahi hai? 😄",
      "Jo bhi ho raha ho abhi,",
      "Umeed hai tu khush hai, successful hai,",
      "Aur kabhi kabhi humari purani baatein yaad karti hai.",
      "4.5 saal ki dosti hamesha special rahegi,",
      "Chahe 10 saal ho ya 50.",
      "— Rudra (jo abhi bhi tera favorite pagal dost hai)",
    ],
  },
  {
    id: "wedding-day",
    title: "Open On Your Wedding Day ❤️",
    lines: [
      "Motuuu ❤️",
      "Aaj tera sabse special din hai.",
      "Itne saalon ki dosti mein,",
      "Maine tujhe hamesha hasi mein, gussa mein,",
      "Pagalpan mein, aur sabse pyaari version mein dekha hai.",
      "Aaj tu aur bhi zyada khush dikhegi.",
      "Jisko bhi tu apna bana rahi hai,",
      "Wo bahut lucky hai.",
      "Congratulations Motiii ❤️🎉",
      "— Rudra, always your best friend",
    ],
  },
] as const;

// Phase 7 will consume this
// 📸 Real photos of Estuti, picked from her saved pictures and placed in
// public/images/. To change which photo shows in a slot, just replace the
// file in public/images/ keeping the same filename, or edit the `src`
// path here to point at a new filename.
export const MEMORY_GALLERY = [
  { src: "/images/memory-1.jpg", caption: "That smile says everything ❤️" },
  { src: "/images/memory-2.jpg", caption: "Lit up like the festival lights ✨" },
  { src: "/images/memory-3.jpg", caption: "Effortlessly you 🎞️" },
  { src: "/images/memory-4.jpg", caption: "Looking like the main character 🌸" },
  { src: "/images/memory-5.jpg", caption: "My favorite kind of calm ❤️" },
  { src: "/images/memory-6.jpg", caption: "Just being adorable, as usual 😊" },
  { src: "/images/memory-7.jpg", caption: "Full chaos, zero regrets 😂" },
  { src: "/images/memory-8.jpg", caption: "Doodle filter, real cuteness ✏️❤️" },
] as const;

// New addition: a small, separate set of photos for the closing
// "Spotlight" circular rotating gallery (see SpotlightWheel.tsx). Kept
// completely separate from MEMORY_GALLERY on purpose — this does not
// replace or touch the existing Gallery section above.
export const SPOTLIGHT_GALLERY = [
  { src: "/images/spotlight-1.jpg", caption: "That look ❤️" },
  { src: "/images/spotlight-2.jpg", caption: "Heart eyes, literally 💗" },
  { src: "/images/spotlight-3.jpg", caption: "Cozy and gorgeous 🤍" },
  { src: "/images/spotlight-4.jpg", caption: "That smile gets me every time ✨" },
  { src: "/images/spotlight-5.jpg", caption: "Pure charm, no effort needed 😊" },
  { src: "/images/spotlight-6.jpg", caption: "Golden hour kind of pretty ✨" },
  { src: "/images/spotlight-7.jpg", caption: "Effortlessly stunning 💗" },
  { src: "/images/spotlight-8.jpg", caption: "Just existing, beautifully ❤️" },
] as const;

// Phase 7 will consume this
export const BUCKET_LIST: string[] = [
  "Meet one day ❤️",
  "Click our first picture together 📸",
  "Take lots of pictures 📸",
  "Eat together 🍕",
  "Laugh on old chats 😂",
  "Create more memories ✨",
  "Stay best friends forever ❤️",
];

// Phase 7 will consume this — Photo Puzzle reveal
export const PUZZLE_PHOTO = {
  src: "/images/memory-2.jpg",
  revealLabel: "Click to reveal Motuuu ❤️",
  gridSize: 3, // 3x3 = 9 pieces
};

// Phase 8 will consume this
export const SECRET_CLICK_TARGET = 27;
export const SECRET_MESSAGE_LINES: string[] = [
  "Congratulations Motiii ❤️",
  "You found the secret.",
  "Thank you for coming into my life.",
  "Distance means nothing when friendship means everything ❤️✨",
  "— Rudra",
];

// Phase 9 will consume this
export const CAKE_CONFIG = {
  candleCount: 3,
};

// Phase 10 will consume this
export const MUSIC_CONFIG = {
  title: "Tumhi Ho Bandhu Sakha Tumhi Ho",
  src: "/song/song.mp3", // Rudra: place your mp3 file here
};

// New addition: the 3-song story flow. Each stage plays one song, and
// MusicProvider crossfades between them as the visitor scrolls into the
// matching section (see useMusic.tsx + App.tsx section refs).
export const MUSIC_STORY = {
  opening: {
    title: "Tumhi Ho Bandhu Sakha Tumhi Ho",
    src: "/song/song.mp3", // Rudra: same file as MUSIC_CONFIG above
  },
  cake: {
    title: "Happy Birthday",
    src: "/song/happy birthday.mp3", // matches the actual filename in public/song/
  },
  finale: {
    title: "Tu Hi Yaar Mera",
    src: "/song/yaar.mp3", // Rudra: place this file here
  },
};

// Phase 12 final ending
export const FINALE_LINES: string[] = [
  "Distance means nothing when friendship means everything ❤️",
  "Happy Birthday Motiii ❤️",
  "Forever Best Friends ❤️",
];
export const FINALE_SIGNOFF = "Made with endless love by Rudra ❤️";
