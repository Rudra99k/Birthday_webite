interface FlowerProps {
  className?: string;
  /** hex or css color for the petals */
  color?: string;
}

/**
 * Flower — small original SVG blossom (5 petals + center), used as a
 * floating decorative element. Pure CSS-colorable, no external assets.
 * Used by: Hero (Phase 3), and reused in later phases.
 */
export function Flower({ className = "", color = "#ff9bb8" }: FlowerProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="30"
          cy="16"
          rx="8"
          ry="14"
          fill={color}
          opacity="0.85"
          transform={`rotate(${angle} 30 30)`}
        />
      ))}
      <circle cx="30" cy="30" r="6" fill="#ffd166" />
    </svg>
  );
}
