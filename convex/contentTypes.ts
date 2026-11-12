import { Infer, v } from "convex/values";
import { audienceData, episodeStatus, flagVerdict, textLang } from "./schema";

// View models returned to the public site. Kept free of storage ids and
// foreign keys so the site can render them directly.

export const settingsView = v.object({
  heroKicker: v.string(),
  heroHeadline: v.string(),
  heroHeadlineTh: v.union(v.string(), v.null()),
  heroIntroTh: v.string(),
  heroImageUrl: v.union(v.string(), v.null()),
  stats: v.array(v.object({ value: v.string(), label: v.string() })),
  audienceIntro: v.string(),
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
  // The video's YouTube thumbnail (an uploaded photo only when there's no video).
  thumbnailUrl: v.union(v.string(), v.null()),
  // Photo of the hosts with the guest uploaded in the admin, for the doctor's page.
  photoUrl: v.union(v.string(), v.null()),
  photoCaption: v.union(v.string(), v.null()),
  meta: v.string(),
  seriesName: v.union(v.string(), v.null()),
  guestName: v.union(v.string(), v.null()),
  // The guest's profile page path segment (/doctors/<guestPath>).
  guestPath: v.union(v.string(), v.null()),
  guestLang: textLang,
  guestAffiliation: v.union(v.string(), v.null()),
  youtubeUrl: v.union(v.string(), v.null()),
  spotifyUrl: v.union(v.string(), v.null()),
  appleUrl: v.union(v.string(), v.null()),
  chapters: v.array(v.object({ seconds: v.number(), title: v.string() })),
});

export const homeContent = v.object({
  settings: settingsView,
  // Live from YouTube (convex/youtubeStats.ts); null until the first refresh.
  channel: v.union(
    v.object({
      subscribers: v.union(v.number(), v.null()),
      views: v.union(v.number(), v.null()),
      videos: v.union(v.number(), v.null()),
    }),
    v.null(),
  ),
  audience: v.union(audienceData, v.null()),
  // The channel's most-watched Shorts (no view counts on the public site).
  shorts: v.array(v.object({ videoId: v.string(), title: v.string(), thumbnailUrl: v.string() })),
  episodes: v.array(episodeView),
  latest: v.union(episodeView, v.null()),
  myths: v.array(
    v.object({
      key: v.string(),
      claim: v.string(),
      answer: v.string(),
      verdict: flagVerdict,
      answeredBy: v.union(v.string(), v.null()),
      answeredByPath: v.union(v.string(), v.null()),
      episodeSpecialty: v.union(v.string(), v.null()),
      episodeTitle: v.union(v.string(), v.null()),
      // Where "Learn more" goes: the episode on YouTube.
      episodeUrl: v.union(v.string(), v.null()),
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
    }),
  ),
  sponsorPackages: v.array(
    v.object({ key: v.string(), title: v.string(), description: v.string(), includes: v.array(v.string()) }),
  ),
  guests: v.array(
    v.object({
      key: v.string(),
      // Profile page path segment: the guest's slug, else their id.
      path: v.string(),
      name: v.string(),
      nameAlt: v.union(v.string(), v.null()),
      nameLang: textLang,
      field: v.string(),
      affiliation: v.union(v.string(), v.null()),
      bio: v.union(v.string(), v.null()),
      profileUrl: v.union(v.string(), v.null()),
      photoUrl: v.union(v.string(), v.null()),
    }),
  ),
  hosts: v.array(
    v.object({
      key: v.string(),
      path: v.string(),
      name: v.string(),
      fullName: v.union(v.string(), v.null()),
      fullNameAlt: v.union(v.string(), v.null()),
      role: v.string(),
      bio: v.union(v.string(), v.null()),
      photoUrl: v.union(v.string(), v.null()),
    }),
  ),
});

export type HomeContent = Infer<typeof homeContent>;
export type GuestView = HomeContent["guests"][number];
export type HostView = HomeContent["hosts"][number];
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
