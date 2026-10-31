type Circle = { cx: number; cy: number; r: number; fill: string };

// Decorative circle layouts used in place of a photo, picked per episode.
const VARIANTS: Circle[][] = [
  [
    { cx: 90, cy: 250, r: 90, fill: "#16283d" },
    { cx: 170, cy: 250, r: 90, fill: "#1b3a5f" },
    { cx: 250, cy: 250, r: 90, fill: "#2b5c91" },
  ],
  [
    { cx: 110, cy: 110, r: 56, fill: "#16283d" },
    { cx: 165, cy: 110, r: 56, fill: "#1b3a5f" },
    { cx: 220, cy: 110, r: 56, fill: "#2b5c91" },
  ],
  [
    { cx: 200, cy: 150, r: 80, fill: "#16283d" },
    { cx: 270, cy: 150, r: 80, fill: "#1b3a5f" },
    { cx: 340, cy: 150, r: 80, fill: "#2b5c91" },
  ],
  [
    { cx: 100, cy: 60, r: 70, fill: "#16283d" },
    { cx: 170, cy: 140, r: 70, fill: "#1b3a5f" },
    { cx: 240, cy: 220, r: 70, fill: "#2b5c91" },
  ],
];

// Square placeholder artwork shown inside the polaroid until a photo is uploaded.
export function EpisodeArt({
  variant,
  label,
  kicker,
}: {
  variant: number;
  label: string;
  kicker: string | null;
}) {
  const circles = VARIANTS[Math.abs(variant) % VARIANTS.length];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0a0f14" }}>
      <svg viewBox="0 0 320 320" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
        {circles.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} />
        ))}
      </svg>
      {kicker && (
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#a8bacd",
          }}
        >
          {kicker}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: 16,
          bottom: 14,
          right: 16,
          color: "#ffffff",
          fontSize: 26,
          lineHeight: 1.2,
          fontWeight: 600,
          whiteSpace: "pre-line",
        }}
      >
        {label}
      </div>
    </div>
  );
}
