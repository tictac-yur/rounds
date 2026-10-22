import { Infer, v } from "convex/values";
import { episodeStatus, textLang } from "./schema";

// View models returned to the public site. Kept free of storage ids and
// foreign keys so the site can render them directly.

export const settingsView = v.object({
  heroKicker: v.string(),
  heroHeadline: v.string(),
  heroIntro: v.string(),
  heroIntroTh: v.string(),
  heroImageUrl: v.union(v.string(), v.null()),
  heroImageCaption: v.string(),
  stats: v.array(v.object({ value: v.string(), label: v.string() })),
  audienceIntro: v.string(),
  platformHandles: v.array(v.string()),
  contactEmail: v.string(),
  mediaKitUrl: v.string(),
  youtubeUrl: v.string(),
  spotifyUrl: v.string(),
  appleUrl: v.string(),
  instagramUrl: v.string(),
  tiktokUrl: v.string(),
  linktreeUrl: v.string(),
});

export const episodeView = v.object({
  key: v.string(),
  slug: v.string(),
  title: v.string(),
  status: episodeStatus,
  featured: v.boolean(),
  specialty: v.string(),
  summary: v.string(),
  thumbLabel: v.string(),
  thumbVariant: v.number(),
  thumbnailUrl: v.union(v.string(), v.null()),
  meta: v.string(),
  seriesName: v.union(v.string(), v.null()),
  guestName: v.union(v.string(), v.null()),
  guestLang: textLang,
  guestAffiliation: v.union(v.string(), v.null()),
  youtubeUrl: v.union(v.string(), v.null()),
  spotifyUrl: v.union(v.string(), v.null()),
  appleUrl: v.union(v.string(), v.null()),
});

export const homeContent = v.object({
  settings: settingsView,
  episodes: v.array(episodeView),
  latest: v.union(episodeView, v.null()),
  myths: v.array(
    v.object({
      key: v.string(),
      claim: v.string(),
      answer: v.string(),
      episodeSpecialty: v.union(v.string(), v.null()),
    }),
  ),
  audienceSegments: v.array(
    v.object({ key: v.string(), stat: v.string(), title: v.string(), description: v.string() }),
  ),
  series: v.array(
    v.object({
      key: v.string(),
      name: v.string(),
      kicker: v.string(),
      description: v.string(),
      accentColor: v.string(),
    }),
  ),
  sponsorPackages: v.array(
    v.object({ key: v.string(), letter: v.string(), title: v.string(), description: v.string() }),
  ),
  guests: v.array(
    v.object({ key: v.string(), name: v.string(), nameLang: textLang, field: v.string() }),
  ),
  hosts: v.array(
    v.object({
      key: v.string(),
      name: v.string(),
      role: v.string(),
      photoUrl: v.union(v.string(), v.null()),
    }),
  ),
});

export type HomeContent = Infer<typeof homeContent>;
export type EpisodeView = Infer<typeof episodeView>;

export function episodeMeta(episode: {
  releaseDate?: string;
  runtime?: string;
  metaNote?: string;
}): string {
  const parts = [episode.releaseDate, episode.runtime].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : (episode.metaNote ?? "");
}

export function pickLatest(episodes: EpisodeView[]): EpisodeView | null {
  const published = episodes.filter((e) => e.status === "published");
  return published.find((e) => e.featured) ?? published[0] ?? null;
}
