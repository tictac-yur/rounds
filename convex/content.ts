import { query, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { episodeMeta, EpisodeView, homeContent, pickLatest } from "./contentTypes";
import { seedSettings } from "./seedData";
import { videoIdFromUrl } from "./lib/youtube";

const LIST_LIMIT = 100;

function youtubeThumb(url: string | undefined) {
  const id = videoIdFromUrl(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

async function fileUrl(ctx: QueryCtx, id: Id<"_storage"> | undefined) {
  return id ? await ctx.storage.getUrl(id) : null;
}

export const home = query({
  args: {},
  returns: homeContent,
  handler: async (ctx) => {
    const settingsDoc = await ctx.db.query("siteSettings").first();
    const { heroImageId, ...settingsFields } = settingsDoc ?? { ...seedSettings, heroImageId: undefined };
    const settings = {
      heroKicker: settingsFields.heroKicker,
      heroHeadline: settingsFields.heroHeadline,
      heroHeadlineTh: settingsFields.heroHeadlineTh ?? null,
      heroIntroTh: settingsFields.heroIntroTh,
      heroImageUrl: await fileUrl(ctx, heroImageId),
      stats: settingsFields.stats,
      audienceIntro: settingsFields.audienceIntro,
      contactEmail: settingsFields.contactEmail,
      mediaKitUrl: settingsFields.mediaKitUrl,
      youtubeUrl: settingsFields.youtubeUrl,
      spotifyUrl: settingsFields.spotifyUrl,
      appleUrl: settingsFields.appleUrl,
      instagramUrl: settingsFields.instagramUrl,
      tiktokUrl: settingsFields.tiktokUrl,
      linktreeUrl: settingsFields.linktreeUrl,
    };

    const seriesDocs = await ctx.db.query("series").withIndex("by_order").take(LIST_LIMIT);
    const guestDocs = await ctx.db.query("guests").withIndex("by_order").take(LIST_LIMIT);
    const seriesById = new Map(seriesDocs.map((s) => [s._id, s]));
    const guestsById = new Map(guestDocs.map((g) => [g._id, g]));
    const guestPath = (g: Doc<"guests">) => g.slug ?? g._id;

    const visibleEpisodes = [
      ...(await ctx.db
        .query("episodes")
        .withIndex("by_status_and_order", (q) => q.eq("status", "published"))
        .take(LIST_LIMIT)),
      ...(await ctx.db
        .query("episodes")
        .withIndex("by_status_and_order", (q) => q.eq("status", "coming_soon"))
        .take(LIST_LIMIT)),
    ].sort((a, b) => a.order - b.order);

    const toView = async (e: Doc<"episodes">): Promise<EpisodeView> => {
      const guest = e.guestId ? guestsById.get(e.guestId) : undefined;
      const series = e.seriesId ? seriesById.get(e.seriesId) : undefined;
      return {
        key: e._id,
        slug: e.slug,
        title: e.title,
        status: e.status,
        featured: e.featured,
        specialty: e.specialty,
        summary: e.summary,
        thumbLabel: e.thumbLabel,
        thumbVariant: e.thumbVariant,
        // An uploaded photo wins; otherwise the video's YouTube thumbnail.
        thumbnailUrl: (await fileUrl(ctx, e.thumbnailId)) ?? e.youtubeThumbnailUrl ?? youtubeThumb(e.youtubeUrl),
        photoCaption: e.photoCaption ?? null,
        meta: episodeMeta(e),
        seriesName: series?.name ?? null,
        guestName: guest?.name ?? null,
        guestPath: guest ? guestPath(guest) : null,
        guestLang: guest?.nameLang ?? "en",
        guestAffiliation: guest?.affiliation ?? null,
        youtubeUrl: e.youtubeUrl ?? null,
        spotifyUrl: e.spotifyUrl ?? null,
        appleUrl: e.appleUrl ?? null,
        chapters: e.chapters ?? [],
      };
    };
    const episodes = await Promise.all(visibleEpisodes.map(toView));
    const episodesById = new Map(visibleEpisodes.map((e) => [e._id, e]));

    const mythDocs = await ctx.db
      .query("myths")
      .withIndex("by_published_and_order", (q) => q.eq("published", true))
      .take(LIST_LIMIT);

    const guestOf = (episodeId: Id<"episodes"> | undefined) => {
      const guestId = episodeId && episodesById.get(episodeId)?.guestId;
      return guestId ? guestsById.get(guestId) : undefined;
    };

    const hostDocs = await ctx.db.query("hosts").withIndex("by_order").take(LIST_LIMIT);

    const stats = await ctx.db.query("channelStats").first();

    return {
      settings,
      channel: stats?.statsUpdatedAt
        ? { subscribers: stats.subscribers ?? null, views: stats.views ?? null, videos: stats.videos ?? null }
        : null,
      audience: stats?.audience ?? null,
      shorts: stats?.topShorts ?? [],
      episodes,
      latest: pickLatest(episodes),
      myths: mythDocs.map((m) => ({
        key: m._id,
        claim: m.claim,
        answer: m.answer,
        verdict: m.verdict ?? "red",
        answeredBy: guestOf(m.episodeId)?.name ?? null,
        answeredByPath: ((g) => (g ? guestPath(g) : null))(guestOf(m.episodeId)),
        episodeSpecialty: (m.episodeId && episodesById.get(m.episodeId)?.specialty) || null,
        episodeTitle: (m.episodeId && episodesById.get(m.episodeId)?.title) || null,
        episodeUrl: (m.episodeId && episodesById.get(m.episodeId)?.youtubeUrl) || null,
      })),
      audienceSegments: (
        await ctx.db.query("audienceSegments").withIndex("by_order").take(LIST_LIMIT)
      ).map((s) => ({ key: s._id, stat: s.stat, title: s.title, description: s.description })),
      series: seriesDocs.map((s) => ({
        key: s._id,
        name: s.name,
        kicker: s.kicker,
        description: s.description,
      })),
      sponsorPackages: (
        await ctx.db.query("sponsorPackages").withIndex("by_order").take(LIST_LIMIT)
      ).map((p) => ({ key: p._id, title: p.title, description: p.description })),
      guests: await Promise.all(
        guestDocs.map(async (g) => ({
          key: g._id,
          path: guestPath(g),
          name: g.name,
          nameAlt: g.nameAlt ?? null,
          nameLang: g.nameLang,
          field: g.field,
          affiliation: g.affiliation ?? null,
          bio: g.bio ?? null,
          profileUrl: g.profileUrl ?? null,
          photoUrl: await fileUrl(ctx, g.photoId),
        })),
      ),
      hosts: await Promise.all(
        hostDocs.map(async (h) => ({
          key: h._id,
          path: h.slug ?? h._id,
          name: h.name,
          role: h.role,
          bio: h.bio ?? null,
          photoUrl: await fileUrl(ctx, h.photoId),
        })),
      ),
    };
  },
});
