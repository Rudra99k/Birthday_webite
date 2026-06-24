interface StarProps {
  className?: string;
  color?: string;
}

/**
 * Star — small original SVG 4-point sparkle star.
 * Used by: Memory Gallery (Phase 7), and reusable elsewhere.
 */
export function Star({ className = "", color = "#ffd166" }: StarProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 4 C31 18 32 28 46 30 C32 32 31 42 30 56 C29 42 28 32 14 30 C28 28 29 18 30 4 Z"
        fill={color}
      />
      <circle cx="48" cy="12" r="2.5" fill={color} opacity="0.8" />
      <circle cx="12" cy="48" r="2" fill={color} opacity="0.7" />
    </svg>
  );
}
