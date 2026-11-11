import type { CSSProperties } from "react";
import type { EpisodeView, HomeContent } from "@/convex/contentTypes";
import { filled, isPlaceholder } from "@/lib/placeholders";
import { episodeTitle, guestName } from "@/lib/episodes";
import { EpisodeVisual } from "./EpisodeArt";
import { ArrowIcon, PLATFORMS, PlatformIcon, PlayIcon, type Platform } from "./Icons";

// A heartbeat trace across the hero: flat, one beat, flat.
const PULSE =
  "M0 60 H560 l18 0 l10 -14 l10 14 l12 0 l10 26 l16 -84 l16 82 l10 -24 l14 0 l14 -10 l14 10 H1600";

function NowShowing({ episode }: { episode: EpisodeView }) {
  const guest = guestName(episode);
  return (
    <a href="#latest" className="now-card enter" style={{ "--i": 5 } as CSSProperties}>
      <div className="now-card-art">
        <EpisodeVisual episode={episode} />
      </div>
      <div className="now-card-body">
        <div>
          <span className="eyebrow">Latest episode</span>
          <span className="title" style={{ fontFamily: "var(--font-thai)" }}>
            {episodeTitle(episode)}
          </span>
          {guest && (
            <span className="small muted" lang={episode.guestLang}>
              {guest}
            </span>
          )}
        </div>
        <span className="play-btn" aria-hidden="true">
          <PlayIcon size={18} />
        </span>
      </div>
    </a>
  );
}

export function HeroSection({ settings, latest }: { settings: HomeContent["settings"]; latest: EpisodeView | null }) {
  const [line1, ...rest] = settings.heroHeadline.split("\n");
  const stats = settings.stats.filter((stat) => !isPlaceholder(stat.value));
  const platforms = (
    [
      ["youtube", settings.youtubeUrl],
      ["spotify", settings.spotifyUrl],
      ["apple", settings.appleUrl],
      ["tiktok", settings.tiktokUrl],
      ["instagram", settings.instagramUrl],
    ] as [Platform, string][]
  ).filter(([, url]) => filled(url));

  return (
    <section id="top" className="hero dark" aria-labelledby="hero-title">
      <svg className="hero-discs" viewBox="0 0 1180 420" aria-hidden="true">
        <circle cx={210} cy={210} r={210} fill="#111820" style={{ "--i": 0 } as CSSProperties} />
        <circle cx={590} cy={210} r={210} fill="#16283d" style={{ "--i": 1 } as CSSProperties} />
        <circle cx={970} cy={210} r={210} fill="#1b3a5f" style={{ "--i": 2 } as CSSProperties} />
      </svg>
      <svg className="hero-pulse" viewBox="0 0 1600 120" preserveAspectRatio="none" aria-hidden="true">
        <path d={PULSE} vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="wrap hero-body">
        <div className="hero-copy">
          <span className="hero-pill enter" style={{ "--i": 0 } as CSSProperties}>
            <span className="live-dot" aria-hidden="true" />
            {settings.heroKicker}
          </span>
          <h1 id="hero-title" className="hero-h1 enter" lang="en" style={{ "--i": 1 } as CSSProperties}>
            <span>{line1}</span>
            {rest.length > 0 && <span className="soft">{rest.join(" ")}</span>}
          </h1>
          {settings.heroHeadlineTh && (
            <p className="hero-th enter" style={{ "--i": 2 } as CSSProperties}>
              {settings.heroHeadlineTh}
            </p>
          )}
          <p className="hero-intro enter" style={{ "--i": 3 } as CSSProperties}>
            {settings.heroIntroTh}
          </p>
          <div className="hero-actions enter" style={{ "--i": 4 } as CSSProperties}>
            <a href="#latest" className="btn btn-light">
              <PlayIcon />
              ดูตอนล่าสุด
            </a>
            <a href="#flags" className="btn btn-outline">
              ทาย Red / Green flag
              <span className="btn-arrow">
                <ArrowIcon />
              </span>
            </a>
          </div>
        </div>
        {latest && <NowShowing episode={latest} />}
      </div>

      <div className="hero-facts">
        <div className="wrap">
          <div className="facts">
            {stats.map((stat) => (
              <span key={stat.label}>
                <b>{stat.value}</b>
                <span className="muted">{stat.label}</span>
              </span>
            ))}
            <span>
              <b>Thammasat</b>
              <span className="muted">อาจารย์แพทย์ คณะแพทยศาสตร์ ธรรมศาสตร์</span>
            </span>
          </div>
          {platforms.length > 0 && (
            <div className="platforms">
              {platforms.map(([name, url]) => (
                <a key={name} href={url} className="platform-chip" aria-label={`Rounds บน ${PLATFORMS[name].title}`}>
                  <PlatformIcon name={name} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
