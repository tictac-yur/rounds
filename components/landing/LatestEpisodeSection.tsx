import type { EpisodeView } from "@/convex/contentTypes";
import { PlayIcon } from "./DecorCircles";
import { EpisodeArt } from "./EpisodeArt";
import { Polaroid } from "./Polaroid";

export function LatestEpisodeSection({ episode }: { episode: EpisodeView }) {
  const playUrl = episode.youtubeUrl ?? episode.spotifyUrl ?? episode.appleUrl;
  const links = [
    { label: "ดูบน YouTube", href: episode.youtubeUrl },
    { label: "ฟังบน Spotify", href: episode.spotifyUrl },
    { label: "Apple Podcasts", href: episode.appleUrl },
  ].filter((link) => link.href);

  return (
    <section id="latest" className="container section" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div className="section-head">
        <div>
          <span className="ds-label">01</span>
          <h2 className="ds-headline">ตอนล่าสุด</h2>
        </div>
        <a href="#episodes" className="text-link">
          ดูทุกตอน →
        </a>
      </div>

      <article className="on-dark" style={{ display: "flex", flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 480px",
            minWidth: 0,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-12) var(--space-8)",
          }}
        >
          <svg
            viewBox="0 0 640 360"
            preserveAspectRatio="xMidYMid slice"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            aria-hidden="true"
          >
            <circle cx={300} cy={40} r={170} fill="#16283d" />
            <circle cx={520} cy={40} r={170} fill="#1b3a5f" />
            <circle cx={740} cy={40} r={170} fill="#2b5c91" />
          </svg>
          <Polaroid
            imageUrl={episode.thumbnailUrl}
            alt={episode.photoCaption ?? `ติติ ปั๊บ และ${episode.guestName ?? "แขกรับเชิญ"}`}
            caption={episode.photoCaption}
            tilt={-3}
            style={{ position: "relative", width: "min(360px, 100%)" }}
            fallback={<EpisodeArt variant={episode.thumbVariant} label={episode.thumbLabel} kicker={episode.seriesName} />}
          >
            {playUrl && (
              <a
                href={playUrl}
                aria-label={`ดูตอน ${episode.title}`}
                style={{
                  position: "absolute",
                  right: "var(--space-4)",
                  bottom: "var(--space-4)",
                  width: 56,
                  height: 56,
                  background: "var(--white)",
                  color: "var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlayIcon size={18} />
              </a>
            )}
          </Polaroid>
        </div>

        <div
          style={{
            flex: "1 1 380px",
            minWidth: 0,
            padding: "var(--space-12) var(--space-8)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            justifyContent: "center",
          }}
        >
          <div className="ds-small muted">{[episode.seriesName, episode.specialty, episode.meta].filter(Boolean).join(" · ")}</div>
          <h3 className="ds-headline">{episode.title}</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {episode.guestName && (
              <div lang={episode.guestLang} style={{ fontSize: 17, lineHeight: "28px", fontWeight: 500 }}>
                {episode.guestName}
              </div>
            )}
            {episode.guestAffiliation && <div className="ds-small muted">{episode.guestAffiliation}</div>}
          </div>
          {episode.summary && (
            <p className="ds-body" style={{ color: "#e6ebf0", lineHeight: "28px" }}>
              {episode.summary}
            </p>
          )}
          {links.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", paddingTop: "var(--space-2)" }}>
              {links.map((link, i) => (
                <a key={link.label} href={link.href ?? undefined} className={i === 0 ? "btn btn-light" : "btn btn-ghost-light"} style={{ fontSize: 15 }}>
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
