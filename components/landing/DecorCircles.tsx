type Corner = "top-right" | "bottom-left";

const POSITIONS: Record<Corner, React.CSSProperties> = {
  "top-right": { top: -140, right: -260, width: 1100 },
  "bottom-left": { bottom: -220, left: -320, width: 1000 },
};

const COLOR_SETS: Record<Corner, [string, string, string]> = {
  "top-right": ["#16283d", "#1b3a5f", "#2b5c91"],
  "bottom-left": ["#111820", "#16283d", "#1b3a5f"],
};

export function DecorCircles({ corner }: { corner: Corner }) {
  const [c1, c2, c3] = COLOR_SETS[corner];
  return (
    <svg
      viewBox="0 0 900 420"
      className={`decor decor-${corner}`}
      style={POSITIONS[corner]}
      aria-hidden="true"
    >
      <circle cx={210} cy={210} r={210} fill={c1} />
      <circle cx={483} cy={210} r={210} fill={c2} />
      <circle cx={756} cy={210} r={210} fill={c3} />
    </svg>
  );
}

export function PlayIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 1.5v11l9-5.5z" fill={color} />
    </svg>
  );
}
