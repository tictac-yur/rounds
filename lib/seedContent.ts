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
      thumbnailUrl: null,
      meta: episodeMeta(e),
      seriesName: seedSeries[e.seriesIndex]?.name ?? null,
      guestName: guest?.name ?? null,
      guestLang: guest?.nameLang ?? "en",
      guestAffiliation: guest?.affiliation ?? null,
      youtubeUrl: e.youtubeUrl ?? null,
      spotifyUrl: e.spotifyUrl ?? null,
      appleUrl: e.appleUrl ?? null,
    };
  });
  return {
    settings: { ...seedSettings, heroImageUrl: null },
    episodes,
    latest: pickLatest(episodes),
    myths: seedMyths.map((m, i) => ({
      key: String(i),
      claim: m.claim,
      answer: m.answer,
      episodeSpecialty: seedEpisodes[m.episodeIndex]?.specialty ?? null,
    })),
    audienceSegments: seedAudienceSegments.map((s, i) => ({ key: String(i), ...s })),
    series: seedSeries.map((s, i) => ({ key: String(i), ...s })),
    sponsorPackages: seedSponsorPackages.map((p, i) => ({ key: String(i), ...p })),
    guests: seedGuests.map((g, i) => ({ key: String(i), name: g.name, nameLang: g.nameLang, field: g.field })),
    hosts: seedHosts.map((h, i) => ({ key: String(i), ...h, photoUrl: null })),
  };
}
