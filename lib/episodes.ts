import type { EpisodeView } from "@/convex/contentTypes";
import { cleanJoin, filled } from "./placeholders";

// What to call an episode whose title hasn't been written yet: its specialty.
export function episodeTitle(ep: EpisodeView): string {
  return filled(ep.title) ?? `ตอน${ep.specialty}`;
}

export function episodeMeta(ep: EpisodeView, withSeries = false): string {
  return cleanJoin(withSeries ? ep.seriesName : null, ep.specialty, ep.meta);
}

// Where "watch" goes: the first real platform link.
export function watchUrl(ep: EpisodeView): string | null {
  return filled(ep.youtubeUrl) ?? filled(ep.spotifyUrl) ?? filled(ep.appleUrl);
}

export function guestName(ep: EpisodeView): string | null {
  return filled(ep.guestName);
}

// "What is Rounds?", the channel's first video, where the hosts introduce
// themselves. "Meet the hosts" always shows it.
export const INTRO_VIDEO_ID = "27T2ZaG26K4";

// The intro episode: that video if it's on the site, else the oldest published
// episode (the list runs newest first).
export function introEpisode(episodes: EpisodeView[]): EpisodeView | null {
  const published = episodes.filter((ep) => ep.status === "published");
  return published.find((ep) => ep.youtubeUrl?.includes(INTRO_VIDEO_ID)) ?? published.at(-1) ?? null;
}
