interface HeartIconProps {
  className?: string;
  color?: string;
}

/**
 * HeartIcon — small original SVG heart shape (distinct from emoji hearts
 * used elsewhere, for illustration contexts like polaroid cards).
 * Used by: Memory Gallery (Phase 7), and reusable elsewhere.
 */
export function HeartIcon({ className = "", color = "#ff5d8f" }: HeartIconProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 52 C30 52 6 38 6 21 C6 11 14 5 22 5 C26 5 29 7 30 11 C31 7 34 5 38 5 C46 5 54 11 54 21 C54 38 30 52 30 52 Z"
        fill={color}
      />
    </svg>
  );
}
