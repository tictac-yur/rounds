import type { EpisodeView, GuestView, HomeContent } from "@/convex/contentTypes";
import { isPlaceholder } from "./placeholders";

// Guests ready to show: a real name (starter rows like "[ชื่อ…]" stay hidden).
export function doctors(content: HomeContent): GuestView[] {
  return content.guests.filter((g) => !isPlaceholder(g.name));
}

export function doctorEpisodes(content: HomeContent, guest: GuestView): EpisodeView[] {
  return content.episodes.filter((ep) => ep.guestPath === guest.path);
}

export function doctorFlags(content: HomeContent, guest: GuestView) {
  return content.myths.filter(
    (m) => m.answeredByPath === guest.path && !isPlaceholder(m.claim) && !isPlaceholder(m.answer),
  );
}

// Their own portrait, else a photo of them with the hosts, else the YouTube
// thumbnail of an episode they're in.
export function doctorPhoto(content: HomeContent, guest: GuestView): string | null {
  const episodes = doctorEpisodes(content, guest);
  return (
    guest.photoUrl ??
    episodes.find((ep) => ep.photoUrl)?.photoUrl ??
    episodes.find((ep) => ep.thumbnailUrl)?.thumbnailUrl ??
    null
  );
}
