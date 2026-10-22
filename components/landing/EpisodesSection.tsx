"use client";

import { useState } from "react";
import type { EpisodeView } from "@/convex/contentTypes";

type Circle = { cx: number; cy: number; r: number; fill: string };

// Decorative circle layouts for generated thumbnails, picked per episode.
export const THUMB_VARIANTS: Circle[][] = [
  [
    { cx: 200, cy: 160, r: 80, fill: "#16283d" },
    { cx: 270, cy: 160, r: 80, fill: "#1b3a5f" },
    { cx: 340, cy: 160, r: 80, fill: "#2b5c91" },
  ],
  [
    { cx: 190, cy: 90, r: 52, fill: "#16283d" },
    { cx: 240, cy: 90, r: 52, fill: "#1b3a5f" },
    { cx: 290, cy: 90, r: 52, fill: "#2b5c91" },
  ],
  [
    { cx: 250, cy: 110, r: 72, fill: "#16283d" },
    { cx: 318, cy: 110, r: 72, fill: "#1b3a5f" },
    { cx: 386, cy: 110, r: 72, fill: "#2b5c91" },
  ],
  [
    { cx: 200, cy: 30, r: 62, fill: "#16283d" },
    { cx: 250, cy: 90, r: 62, fill: "#1b3a5f" },
    { cx: 300, cy: 150, r: 62, fill: "#2b5c91" },
  ],
];

function EpisodeThumb({
  circles,
  label,
  kicker,
  imageUrl,
  badge,
}: {
  circles: Circle[];
  label: string;
  kicker: string | null;
  imageUrl: string | null;
  badge?: string;
}) {
  return (
    <div style={{ position: "relative", aspectRatio: "16 / 9", background: "#0a0f14", overflow: "hidden" }}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
      <svg
        viewBox="0 0 320 180"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        {circles.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} />
        ))}
      </svg>
      )}
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "#a8bacd",
        }}
      >
        {kicker}
      </div>
      <div style={{ position: "absolute", left: 18, bottom: 16, color: "#ffffff", fontSize: 24, lineHeight: 1, fontWeight: 600, whiteSpace: "pre-line" }}>
        {label}
      </div>
      {badge && (
        <div
          style={{
            position: "absolute",
            right: 14,
            top: 14,
            background: "#ffffff",
            color: "#0a0f14",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "5px 8px",
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
}

export function EpisodesSection({ episodes }: { episodes: EpisodeView[] }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...new Set(episodes.map((ep) => ep.specialty).filter(Boolean))];
  const shown = filter === "All" ? episodes : episodes.filter((ep) => ep.specialty === filter);
  return (
    <section id="episodes" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 96px", display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", color: "#5d666f" }}>
          02
        </span>
        <h2 style={{ margin: 0, fontSize: 40, lineHeight: "44px", fontWeight: 600, letterSpacing: "-0.02em" }}>
          The Consult
        </h2>
      </div>

      <div role="group" aria-label="Filter by specialty" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {filters.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === filter}
            onClick={() => setFilter(option)}
            style={{
              height: 44,
              padding: "0 18px",
              border: option === filter ? "1px solid #0a0f14" : "1px solid #b6bec6",
              background: option === filter ? "#0a0f14" : "#ffffff",
              color: option === filter ? "#ffffff" : "#0a0f14",
              font: "inherit",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {shown.map((ep) => (
          <a
            key={ep.key}
            href={ep.featured && ep.status === "published" ? "#latest" : (ep.youtubeUrl ?? "#episodes")}
            style={{ display: "flex", flexDirection: "column", gap: 16, color: "#0a0f14", textDecoration: "none" }}
          >
            <EpisodeThumb
              circles={THUMB_VARIANTS[ep.thumbVariant % THUMB_VARIANTS.length]}
              label={ep.thumbLabel}
              kicker={ep.seriesName}
              imageUrl={ep.thumbnailUrl}
              badge={ep.status === "coming_soon" ? "Coming soon" : undefined}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#5d666f" }}>
                {ep.meta}
              </div>
              <div style={{ fontSize: 20, lineHeight: "26px", fontWeight: 600 }}>{ep.title}</div>
              <div
                lang={ep.guestLang === "th" ? "th" : undefined}
                style={{
                  fontFamily: ep.guestLang === "th" ? "var(--font-thai)" : undefined,
                  fontSize: 14,
                  lineHeight: "22px",
                  color: "#5d666f",
                }}
              >
                {ep.guestName}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
