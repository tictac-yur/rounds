"use client";

import { useState } from "react";
import type { EpisodeView } from "@/convex/contentTypes";
import { episodeMeta, episodeTitle, guestName, watchUrl } from "@/lib/episodes";
import { EpisodeVisual } from "./EpisodeArt";
import { PlayIcon } from "./Icons";
import { SectionHeader } from "./SectionHeader";

const ALL = "ทั้งหมด";

function EpisodeCard({ ep }: { ep: EpisodeView }) {
  const guest = guestName(ep);
  // Published episodes link to where they play; coming-soon ones aren't links.
  const href = ep.status === "published" ? watchUrl(ep) : null;
  const body = (
    <>
      <div className="ep-card-art">
        <EpisodeVisual episode={ep} />
        {ep.status === "coming_soon" && <span className="badge badge-soon">เร็วๆ นี้</span>}
        {href && (
          <span className="badge badge-watch" aria-hidden="true">
            <PlayIcon />
          </span>
        )}
      </div>
      <div className="ep-card-text">
        <span className="small muted">{episodeMeta(ep)}</span>
        <h3 className="ep-card-title">{episodeTitle(ep)}</h3>
        {guest && (
          <span lang={ep.guestLang} className="small muted">
            {guest}
          </span>
        )}
      </div>
    </>
  );
  return href ? (
    <a href={href} className="ep-card">
      {body}
    </a>
  ) : (
    <div className="ep-card">{body}</div>
  );
}

export function EpisodesSection({ episodes }: { episodes: EpisodeView[] }) {
  const [filter, setFilter] = useState(ALL);
  const specialties = [...new Set(episodes.map((ep) => ep.specialty).filter(Boolean))];
  const count = (s: string) => (s === ALL ? episodes.length : episodes.filter((ep) => ep.specialty === s).length);
  const shown = filter === ALL ? episodes : episodes.filter((ep) => ep.specialty === filter);

  return (
    <section id="episodes" className="wrap section" style={{ paddingTop: 0 }} aria-labelledby="episodes-title">
      <SectionHeader id="episodes-title" label="02 · Episodes" en="Every episode" th="แต่ละตอน คุยกับอาจารย์แพทย์เฉพาะทางหนึ่งสาขา" />

      {specialties.length > 1 && (
        <div role="group" aria-label="กรองตามสาขา" className="chips">
          {[ALL, ...specialties].map((option) => (
            <button key={option} type="button" className="chip" aria-pressed={option === filter} onClick={() => setFilter(option)}>
              {option}
              <small>{count(option)}</small>
            </button>
          ))}
        </div>
      )}

      <div className="ep-grid" aria-live="polite">
        {shown.map((ep) => (
          <EpisodeCard key={ep.key} ep={ep} />
        ))}
      </div>
    </section>
  );
}
