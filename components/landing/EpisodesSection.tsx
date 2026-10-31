"use client";

import { useState } from "react";
import type { EpisodeView } from "@/convex/contentTypes";
import { EpisodeArt } from "./EpisodeArt";
import { episodeCaption, Polaroid } from "./Polaroid";

const ALL = "ทั้งหมด";
const TILTS = [-2.5, 1.5, -1, 2.5];

export function EpisodesSection({ episodes }: { episodes: EpisodeView[] }) {
  const [filter, setFilter] = useState(ALL);
  const filters = [ALL, ...new Set(episodes.map((ep) => ep.specialty).filter(Boolean))];
  const shown = filter === ALL ? episodes : episodes.filter((ep) => ep.specialty === filter);
  return (
    <section id="episodes" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 96px", display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", color: "#5d666f" }}>
          02
        </span>
        <h2 style={{ margin: 0, fontSize: 40, lineHeight: 1.3, fontWeight: 600, letterSpacing: "-0.01em" }}>
          ทุกตอน
        </h2>
      </div>

      <div role="group" aria-label="กรองตามสาขา" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "48px 36px", paddingTop: 12 }}>
        {shown.map((ep, i) => (
          <a
            key={ep.key}
            href={ep.featured && ep.status === "published" ? "#latest" : (ep.youtubeUrl ?? "#episodes")}
            style={{ display: "flex", flexDirection: "column", gap: 20, color: "#0a0f14", textDecoration: "none" }}
          >
            <Polaroid
              imageUrl={ep.thumbnailUrl}
              alt={episodeCaption(ep)}
              caption={episodeCaption(ep)}
              tilt={TILTS[i % TILTS.length]}
              fallback={<EpisodeArt variant={ep.thumbVariant} label={ep.thumbLabel} kicker={ep.seriesName} />}
            >
              {ep.status === "coming_soon" && (
                <div
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 12,
                    transform: "rotate(4deg)",
                    background: "#f4e7a1",
                    color: "#0a0f14",
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "4px 12px",
                    boxShadow: "0 2px 4px rgba(10, 15, 20, 0.2)",
                  }}
                >
                  เร็วๆ นี้
                </div>
              )}
            </Polaroid>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 13, lineHeight: "20px", color: "#5d666f" }}>
                {[ep.specialty, ep.meta].filter(Boolean).join(" · ")}
              </div>
              <div style={{ fontSize: 20, lineHeight: 1.4, fontWeight: 600 }}>{ep.title}</div>
              {ep.guestName && (
                <div
                  lang={ep.guestLang === "th" ? "th" : "en"}
                  style={{ fontSize: 14, lineHeight: "22px", color: "#5d666f" }}
                >
                  {ep.guestName}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
