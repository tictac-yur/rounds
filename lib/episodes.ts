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
