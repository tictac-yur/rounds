"use client";

import { useState } from "react";
import type { EpisodeView } from "@/convex/contentTypes";
import { EpisodeArt } from "./EpisodeArt";
import { Polaroid } from "./Polaroid";
import { SectionHeader } from "./SectionHeader";

const ALL = "ทั้งหมด";
const TILTS = [-2.5, 1.5, -1, 2.5];

function EpisodeCard({ ep, tilt }: { ep: EpisodeView; tilt: number }) {
  const body = (
    <>
      <Polaroid
        imageUrl={ep.thumbnailUrl}
        alt={ep.photoCaption ?? `ตีตี้ ปั๊บ และ${ep.guestName ?? "แขกรับเชิญ"}`}
        caption={ep.photoCaption}
        tilt={tilt}
        fallback={<EpisodeArt variant={ep.thumbVariant} label={ep.thumbLabel} kicker={ep.seriesName} />}
      >
        {ep.status === "coming_soon" && (
          <div
            className="ds-small"
            style={{
              position: "absolute",
              right: "var(--space-3)",
              top: "var(--space-3)",
              background: "var(--white)",
              color: "var(--ink)",
              fontWeight: 600,
              padding: "var(--space-1) var(--space-3)",
            }}
          >
            เร็วๆ นี้
          </div>
        )}
      </Polaroid>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <div className="ds-small muted">{[ep.specialty, ep.meta].filter(Boolean).join(" · ")}</div>
        <h3 className="ds-title">{ep.title}</h3>
        {ep.guestName && (
          <div lang={ep.guestLang} className="ds-small muted">
            {ep.guestName}
          </div>
        )}
      </div>
    </>
  );
  const style = { display: "flex", flexDirection: "column", gap: "var(--space-6)", color: "var(--ink)", textDecoration: "none" } as const;
  // Link to the episode itself; coming-soon episodes aren't links.
  const href = ep.youtubeUrl ?? (ep.featured && ep.status === "published" ? "#latest" : null);
  return href ? (
    <a href={href} style={style}>
      {body}
    </a>
  ) : (
    <div style={style}>{body}</div>
  );
}

export function EpisodesSection({ episodes }: { episodes: EpisodeView[] }) {
  const [filter, setFilter] = useState(ALL);
  const filters = [ALL, ...new Set(episodes.map((ep) => ep.specialty).filter(Boolean))];
  const shown = filter === ALL ? episodes : episodes.filter((ep) => ep.specialty === filter);
  return (
    <section id="episodes" className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--section-y)", display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <SectionHeader number="02" en="The Consult" th="ทุกตอน คุยกับอาจารย์แพทย์เฉพาะทาง" />

      <div role="group" aria-label="กรองตามสาขา" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {filters.map((option) => (
          <button key={option} type="button" className="chip" aria-pressed={option === filter} onClick={() => setFilter(option)}>
            {option}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--space-12) var(--space-8)", paddingTop: "var(--space-3)" }}>
        {shown.map((ep, i) => (
          <EpisodeCard key={ep.key} ep={ep} tilt={TILTS[i % TILTS.length]} />
        ))}
      </div>
    </section>
  );
}
