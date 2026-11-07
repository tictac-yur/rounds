import type { EpisodeView } from "@/convex/contentTypes";
import { filled } from "@/lib/placeholders";
import { episodeMeta, episodeTitle, guestName, watchUrl } from "@/lib/episodes";
import { EpisodeVisual } from "./EpisodeArt";
import { ArrowIcon, PlatformIcon, PlayIcon, type Platform } from "./Icons";
import { SectionHeader } from "./SectionHeader";

export function LatestEpisodeSection({ episode }: { episode: EpisodeView }) {
  const playUrl = watchUrl(episode);
  const guest = guestName(episode);
  const links = (
    [
      ["youtube", "ดูบน YouTube", episode.youtubeUrl],
      ["spotify", "ฟังบน Spotify", episode.spotifyUrl],
      ["apple", "Apple Podcasts", episode.appleUrl],
    ] as [Platform, string, string | null][]
  ).filter(([, , href]) => filled(href));
  const title = episodeTitle(episode);

  return (
    <section id="latest" className="wrap section" aria-labelledby="latest-title">
      <SectionHeader
        id="latest-title"
        label="01 · Latest"
        en="Latest episode"
        th="ตอนใหม่ที่เพิ่งออก ดูได้เลยตอนนี้"
        action={
          <a href="#episodes" className="text-link">
            ดูทุกตอน <ArrowIcon />
          </a>
        }
      />

      <article className="latest">
        {playUrl ? (
          <a href={playUrl} className="latest-art" aria-label={`ดูตอน ${title}`}>
            <EpisodeVisual episode={episode} alt="" />
            <span className="play-btn" aria-hidden="true">
              <PlayIcon size={26} />
            </span>
          </a>
        ) : (
          <div className="latest-art">
            <EpisodeVisual episode={episode} />
          </div>
        )}

        <div className="latest-body">
          <span className="eyebrow eyebrow-th">{episodeMeta(episode, true)}</span>
          <h3 className="latest-title">{title}</h3>
          {guest && (
            <div className="guest">
              <span className="guest-disc" aria-hidden="true">
                {guest.replace(/^(Asst\. Prof\. |Dr\. |อ\.พญ\.|อ\.นพ\.)+/, "").charAt(0)}
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span lang={episode.guestLang} style={{ fontWeight: 600 }}>
                  {guest}
                </span>
                {filled(episode.guestAffiliation) && <span className="small muted">{episode.guestAffiliation}</span>}
              </div>
            </div>
          )}
          {filled(episode.summary) && (
            <p className="body" style={{ color: "#d6dee7", fontFamily: "var(--font-thai)" }}>
              {episode.summary}
            </p>
          )}
          {links.length > 0 && (
            <div className="watch-links">
              {links.map(([platform, label, href], i) => (
                <a key={platform} href={href ?? undefined} className={i === 0 ? "btn btn-light" : "btn btn-outline"}>
                  <PlatformIcon name={platform} size={18} />
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
