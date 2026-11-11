import type { EpisodeView } from "@/convex/contentTypes";

type Circle = { cx: number; cy: number; r: number };

// The logo's three discs, arranged differently per episode, stand in for a
// photo until one is uploaded in the admin.
const VARIANTS: Circle[][] = [
  [
    { cx: 70, cy: 300, r: 120 },
    { cx: 180, cy: 300, r: 120 },
    { cx: 290, cy: 300, r: 120 },
  ],
  [
    { cx: 230, cy: 40, r: 80 },
    { cx: 290, cy: 100, r: 80 },
    { cx: 350, cy: 160, r: 80 },
  ],
  [
    { cx: 160, cy: 150, r: 64 },
    { cx: 230, cy: 150, r: 64 },
    { cx: 300, cy: 150, r: 64 },
  ],
  [
    { cx: 310, cy: 300, r: 150 },
    { cx: 310, cy: 300, r: 105 },
    { cx: 310, cy: 300, r: 60 },
  ],
];
const FILLS = ["#16283d", "#1b3a5f", "#2b5c91"];

export function EpisodeArt({ variant, label, kicker }: { variant: number; label: string; kicker: string | null }) {
  const circles = VARIANTS[Math.abs(variant) % VARIANTS.length];
  return (
    <div className="ep-art zoom" aria-hidden="true">
      <svg viewBox="0 0 360 360" preserveAspectRatio="xMidYMid slice">
        {circles.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={FILLS[i]} />
        ))}
      </svg>
      {kicker && <div className="eyebrow ep-art-kicker">{kicker}</div>}
      <div className="ep-art-label">{label}</div>
    </div>
  );
}

// The episode's photo, or the disc artwork when there is none.
export function EpisodeVisual({ episode, alt }: { episode: EpisodeView; alt?: string }) {
  if (episode.thumbnailUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="ep-photo zoom"
        src={episode.thumbnailUrl}
        alt={alt ?? episode.title}
      />
    );
  }
  return <EpisodeArt variant={episode.thumbVariant} label={episode.thumbLabel} kicker={episode.seriesName} />;
}
