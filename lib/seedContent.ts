import { episodeMeta, EpisodeView, HomeContent, pickLatest } from "@/convex/contentTypes";
import {
  seedAudienceSegments,
  seedEpisodes,
  seedGuests,
  seedHosts,
  seedMyths,
  seedSeries,
  seedSettings,
  seedSponsorPackages,
} from "@/convex/seedData";

const seedGuestPath = (i: number) => `guest-${i}`;

// Builds the home page from the starter content, for when Convex is unavailable.
export function seedHomeContent(): HomeContent {
  const episodes: EpisodeView[] = seedEpisodes.map((e) => {
    const guest = seedGuests[e.guestIndex];
    return {
      key: e.slug,
      slug: e.slug,
      title: e.title,
      status: e.status,
      featured: e.featured,
      specialty: e.specialty,
      summary: e.summary,
      thumbLabel: e.thumbLabel,
      thumbVariant: e.thumbVariant,
      thumbnailUrl: e.youtubeThumbnailUrl ?? null,
      photoCaption: null,
      meta: episodeMeta(e),
      seriesName: seedSeries[e.seriesIndex]?.name ?? null,
      guestName: guest?.name ?? null,
      guestPath: guest ? seedGuestPath(e.guestIndex) : null,
      guestLang: guest?.nameLang ?? "en",
      guestAffiliation: guest?.affiliation ?? null,
      youtubeUrl: e.youtubeUrl ?? null,
      spotifyUrl: null,
      appleUrl: null,
      chapters: ("chapters" in e && e.chapters) || [],
    };
  });
  return {
    settings: { ...seedSettings, heroImageUrl: null },
    channel: null,
    audience: null,
    episodes,
    latest: pickLatest(episodes),
    myths: seedMyths.map((m, i) => {
      const episode = seedEpisodes[m.episodeIndex];
      const guestIndex = episode?.guestIndex ?? -1;
      return {
        key: String(i),
        claim: m.claim,
        answer: m.answer,
        verdict: m.verdict,
        answeredBy: seedGuests[guestIndex]?.name ?? null,
        answeredByPath: seedGuests[guestIndex] ? seedGuestPath(guestIndex) : null,
        episodeSpecialty: episode?.specialty ?? null,
        episodeTitle: episode?.title ?? null,
        episodeUrl: episode?.youtubeUrl ?? null,
      };
    }),
    audienceSegments: seedAudienceSegments.map((s, i) => ({ key: String(i), ...s })),
    series: seedSeries.map((s, i) => ({ key: String(i), ...s })),
    sponsorPackages: seedSponsorPackages.map((p, i) => ({ key: String(i), ...p })),
    guests: seedGuests.map((g, i) => ({
      key: String(i),
      path: seedGuestPath(i),
      name: g.name,
      nameAlt: null,
      nameLang: g.nameLang,
      field: g.field,
      affiliation: g.affiliation ?? null,
      bio: g.bio ?? null,
      profileUrl: null,
      photoUrl: null,
    })),
    hosts: seedHosts.map((h, i) => ({ key: String(i), ...h, photoUrl: null })),
  };
}
