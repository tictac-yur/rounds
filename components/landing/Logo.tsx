export function LogoMark({ width = 52, height = 22 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 170 74" aria-hidden="true">
      <circle cx={37} cy={37} r={37} fill="#5d6164" />
      <circle cx={85} cy={37} r={37} fill="#9d9fa1" />
      <circle cx={133} cy={37} r={37} fill="#ffffff" />
    </svg>
  );
}

export function Wordmark({ size = 18, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <span
      style={{
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "0.2em",
        color,
      }}
    >
      ROUNDS
    </span>
  );
}
