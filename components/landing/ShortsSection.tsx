import type { HomeContent } from "@/convex/contentTypes";
import { PlayIcon } from "./Icons";
import { SectionHeader } from "./SectionHeader";

// The channel's most-watched Shorts, opening on YouTube. Ranked by views,
// but the numbers themselves stay off the public site.
export function ShortsSection({ shorts }: { shorts: HomeContent["shorts"] }) {
  if (shorts.length === 0) return null;
  return (
    <section id="shorts" className="wrap section" style={{ paddingTop: 0 }} aria-labelledby="shorts-title">
      <SectionHeader id="shorts-title" label="Shorts" en="Popular Shorts" th="คลิปสั้นที่คนดูเยอะที่สุด" />
      <ul className="shorts-row">
        {shorts.map((s) => (
          <li key={s.videoId}>
            <a href={`https://www.youtube.com/shorts/${s.videoId}`} className="short-card" target="_blank" rel="noopener">
              <span className="short-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.thumbnailUrl} alt="" loading="lazy" />
                <span className="badge badge-watch" aria-hidden="true">
                  <PlayIcon />
                </span>
              </span>
              <span className="short-title">{s.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
