import type { EpisodeView } from "@/convex/contentTypes";
import { PlayIcon } from "./DecorCircles";
import { EpisodeArt } from "./EpisodeArt";
import { episodeCaption, Polaroid } from "./Polaroid";

export function LatestEpisodeSection({ episode }: { episode: EpisodeView }) {
  const playUrl = episode.youtubeUrl ?? episode.spotifyUrl ?? episode.appleUrl;
  const caption = episodeCaption(episode);
  return (
    <section id="latest" style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 24px 72px", display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", color: "#5d666f" }}>
            01
          </span>
          <h2 style={{ margin: 0, fontSize: 40, lineHeight: 1.3, fontWeight: 600, letterSpacing: "-0.01em" }}>
            ตอนล่าสุด
          </h2>
        </div>
        <a href="#episodes" style={{ fontSize: 15, fontWeight: 600 }}>
          ดูทุกตอน →
        </a>
      </div>

      <article style={{ background: "#0a0f14", color: "#ffffff", display: "flex", flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 520px",
            minWidth: 0,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "56px 32px",
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
            alt={caption}
            caption={caption}
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
                  right: 16,
                  bottom: 16,
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#ffffff",
                  color: "#0a0f14",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(10, 15, 20, 0.3)",
                }}
              >
                <PlayIcon size={20} />
              </a>
            )}
          </Polaroid>
        </div>

        <div style={{ flex: "1 1 380px", minWidth: 0, padding: 40, display: "flex", flexDirection: "column", gap: 18, justifyContent: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#a8bacd" }}>
            {[episode.seriesName, episode.specialty, episode.meta].filter(Boolean).join(" · ")}
          </div>
          <h3 style={{ margin: 0, fontSize: 32, lineHeight: 1.35, fontWeight: 600 }}>{episode.title}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {episode.guestName && (
              <div lang={episode.guestLang === "th" ? "th" : "en"} style={{ fontSize: 17, lineHeight: "26px", fontWeight: 500 }}>
                {episode.guestName}
              </div>
            )}
            {episode.guestAffiliation && (
              <div style={{ fontSize: 15, lineHeight: "22px", color: "#a8bacd" }}>{episode.guestAffiliation}</div>
            )}
          </div>
          {episode.summary && (
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "#e6ebf0" }}>{episode.summary}</p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 4 }}>
            {[
              { label: "ดูบน YouTube", href: episode.youtubeUrl },
              { label: "ฟังบน Spotify", href: episode.spotifyUrl },
              { label: "Apple Podcasts", href: episode.appleUrl },
            ]
              .filter((link) => link.href)
              .map((link, i) => (
                <a
                  key={link.label}
                  href={link.href ?? undefined}
                  style={
                    i === 0
                      ? { display: "inline-flex", alignItems: "center", height: 46, padding: "0 20px", background: "#ffffff", color: "#0a0f14", textDecoration: "none", fontWeight: 600, fontSize: 15 }
                      : { display: "inline-flex", alignItems: "center", height: 46, padding: "0 20px", border: "1px solid #5d666f", color: "#ffffff", textDecoration: "none", fontWeight: 600, fontSize: 15 }
                  }
                >
                  {link.label}
                </a>
              ))}
          </div>
        </div>
      </article>
    </section>
  );
}
