import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery, MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { seedSettings } from "./seedData";
import {
  channelIdFromPage,
  channelIdFromUrl,
  cleanTitle,
  fetchUploads,
  parseChapters,
  parseFeed,
  shortThumbnail,
  slugFor,
  summaryFrom,
  thaiDate,
  thumbLabelFrom,
  videoIdFromUrl,
  watchUrl,
} from "./lib/youtube";

// Hourly sync (convex/crons.ts): reads the channel's public uploads feed and
// publishes every new full-length video as an episode; the newest one becomes
// the featured "latest episode". Shorts are skipped. Guest and specialty can
// be added afterwards in the admin.

const feedVideo = v.object({
  videoId: v.string(),
  title: v.string(),
  description: v.string(),
  publishedAt: v.string(),
  thumbnailUrl: v.string(),
});

export const getSource = internalQuery({
  args: {},
  returns: v.object({ channelUrl: v.string(), channelId: v.union(v.string(), v.null()) }),
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    const channelUrl = settings?.youtubeUrl ?? seedSettings.youtubeUrl;
    const state = await ctx.db.query("youtubeSync").first();
    // A cached id only counts while the channel link is unchanged.
    const channelId = state?.channelUrl === channelUrl ? (state.channelId ?? null) : null;
    return { channelUrl, channelId };
  },
});

export const sync = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await ctx.runMutation(internal.channelContent.apply, {});
    await ctx.runMutation(internal.contentUpdates.apply, {});
    const { channelUrl, channelId: cached } = await ctx.runQuery(internal.youtube.getSource, {});
    try {
      let channelId = cached ?? channelIdFromUrl(channelUrl);
      if (!channelId) {
        const page = await fetch(channelUrl, { headers: { "Accept-Language": "en" } });
        if (!page.ok) throw new Error(`Couldn't open ${channelUrl} (HTTP ${page.status}).`);
        channelId = channelIdFromPage(await page.text());
        if (!channelId) throw new Error(`Couldn't find a YouTube channel at ${channelUrl}.`);
      }

      // The YouTube Data API when YOUTUBE_API_KEY is set; YouTube's public
      // feed (which has stopped answering for many channels) otherwise.
      const key = process.env.YOUTUBE_API_KEY;
      let uploads;
      if (key) {
        uploads = await fetchUploads(channelId, key);
      } else {
        const feed = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
        if (!feed.ok) {
          throw new Error(`YouTube feed returned HTTP ${feed.status}. Add YOUTUBE_API_KEY in Convex to read the channel through the YouTube API.`);
        }
        uploads = parseFeed(await feed.text());
      }
      const videos = uploads.filter((video) => !video.isShort);

      // The most-watched Shorts, for the home page (only known through the API).
      if (key) {
        const topShorts = uploads
          .filter((video) => video.isShort)
          .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
          .slice(0, 5)
          .map((video) => ({ videoId: video.videoId, title: cleanTitle(video.title), thumbnailUrl: shortThumbnail(video.videoId, video.wideThumbnailUrl) }));
        await ctx.runMutation(internal.youtube.saveTopShorts, { shorts: topShorts });
      }

      const known: string[] = await ctx.runQuery(internal.youtube.knownVideoIds, {});
      const fresh = videos.filter((video) => !known.includes(video.videoId));
      const withThumbs = await Promise.all(
        fresh.map(async (video) => ({
          videoId: video.videoId,
          title: video.title,
          description: video.description,
          publishedAt: video.publishedAt,
          thumbnailUrl: video.thumbnailUrl ?? (await bestThumbnail(video.videoId)),
        })),
      );

      await ctx.runMutation(internal.youtube.importVideos, { channelId, channelUrl, videos: withThumbs });
      // Episodes already on the site follow later changes on YouTube: a new
      // thumbnail, or chapters added to the description.
      const updates = videos.map((video) => ({
        videoId: video.videoId,
        chapters: parseChapters(video.description),
        thumbnailUrl: video.thumbnailUrl,
      }));
      if (updates.length > 0) await ctx.runMutation(internal.youtube.refreshEpisodes, { videos: updates });
    } catch (error) {
      await ctx.runMutation(internal.youtube.recordError, {
        channelUrl,
        message: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  },
});

// The widest thumbnail YouTube has for a video (1280×720 when it exists).
async function bestThumbnail(videoId: string): Promise<string> {
  const max = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  try {
    const res = await fetch(max, { method: "HEAD" });
    if (res.ok) return max;
  } catch {
    // Fall through to the thumbnail every video has.
  }
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

// Video ids already on the site, whether linked by the sync or pasted in the admin.
export const knownVideoIds = internalQuery({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const episodes = await ctx.db.query("episodes").withIndex("by_order").take(500);
    return episodes.flatMap((e) => {
      const id = e.youtubeVideoId ?? videoIdFromUrl(e.youtubeUrl);
      return id ? [id] : [];
    });
  },
});

export const importVideos = internalMutation({
  args: { channelId: v.string(), channelUrl: v.string(), videos: v.array(feedVideo) },
  returns: v.null(),
  handler: async (ctx, { channelId, channelUrl, videos }) => {
    const first = await ctx.db.query("episodes").withIndex("by_order").first();
    let order = (first?.order ?? 0) - 1;
    const series = await ctx.db.query("series").withIndex("by_order").take(50);
    let added = 0;
    let newest: Id<"episodes"> | null = null;

    // Oldest first, so the newest upload ends up first in the list.
    const sorted = [...videos].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
    for (const video of sorted) {
      const already = await ctx.db
        .query("episodes")
        .withIndex("by_youtubeVideoId", (q) => q.eq("youtubeVideoId", video.videoId))
        .first();
      if (already !== null) continue;

      let slug = slugFor(video.videoId);
      while ((await ctx.db.query("episodes").withIndex("by_slug", (q) => q.eq("slug", slug)).first()) !== null) {
        slug = `${slug}-2`;
      }
      const title = cleanTitle(video.title);
      // "… | The Consult EP.1" → the series called The Consult, if there is one.
      const seriesMatch = series.find((s) => title.toLowerCase().includes(s.name.toLowerCase()));

      const id = await ctx.db.insert("episodes", {
        slug,
        title,
        status: "published",
        featured: false,
        seriesId: seriesMatch?._id,
        specialty: "",
        summary: summaryFrom(video.description),
        thumbLabel: thumbLabelFrom(video.title),
        thumbVariant: Math.abs(order) % 4,
        releaseDate: thaiDate(video.publishedAt),
        youtubeUrl: watchUrl(video.videoId),
        youtubeVideoId: video.videoId,
        youtubeThumbnailUrl: video.thumbnailUrl,
        chapters: parseChapters(video.description),
        order,
      });
      order -= 1;
      added += 1;
      newest = id;
    }

    // The newest upload becomes the latest episode on the home page.
    if (newest !== null) {
      for (const episode of await ctx.db.query("episodes").withIndex("by_order").take(500)) {
        if (episode.featured && episode._id !== newest) {
          await ctx.db.patch("episodes", episode._id, { featured: false });
        }
      }
      await ctx.db.patch("episodes", newest, { featured: true });
    }

    await writeState(ctx, { channelId, channelUrl, lastCheckedAt: Date.now(), lastAddedCount: added, lastError: undefined });
    return null;
  },
});

const topShort = v.object({ videoId: v.string(), title: v.string(), thumbnailUrl: v.string() });

export const saveTopShorts = internalMutation({
  args: { shorts: v.array(topShort) },
  returns: v.null(),
  handler: async (ctx, { shorts }) => {
    const stats = await ctx.db.query("channelStats").first();
    if (stats) await ctx.db.patch("channelStats", stats._id, { topShorts: shorts });
    else await ctx.db.insert("channelStats", { topShorts: shorts });
    return null;
  },
});

export const refreshEpisodes = internalMutation({
  args: {
    videos: v.array(
      v.object({
        videoId: v.string(),
        chapters: v.array(v.object({ seconds: v.number(), title: v.string() })),
        // Only known through the YouTube API.
        thumbnailUrl: v.optional(v.string()),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, { videos }) => {
    for (const { videoId, chapters, thumbnailUrl } of videos) {
      const episode = await ctx.db
        .query("episodes")
        .withIndex("by_youtubeVideoId", (q) => q.eq("youtubeVideoId", videoId))
        .first();
      if (!episode) continue;
      const patch: { chapters?: typeof chapters; youtubeThumbnailUrl?: string } = {};
      // Chapters removed from a description are kept rather than wiped.
      if (chapters.length > 0 && JSON.stringify(episode.chapters ?? []) !== JSON.stringify(chapters)) {
        patch.chapters = chapters;
      }
      if (thumbnailUrl && thumbnailUrl !== episode.youtubeThumbnailUrl) patch.youtubeThumbnailUrl = thumbnailUrl;
      if (Object.keys(patch).length > 0) await ctx.db.patch("episodes", episode._id, patch);
    }
    return null;
  },
});

export const recordError = internalMutation({
  args: { channelUrl: v.string(), message: v.string() },
  returns: v.null(),
  handler: async (ctx, { channelUrl, message }) => {
    const state = await ctx.db.query("youtubeSync").first();
    await writeState(ctx, {
      channelId: state?.channelUrl === channelUrl ? state.channelId : undefined,
      channelUrl,
      lastCheckedAt: Date.now(),
      lastAddedCount: 0,
      lastError: message,
    });
    return null;
  },
});

async function writeState(
  ctx: MutationCtx,
  fields: {
    channelId: string | undefined;
    channelUrl: string;
    lastCheckedAt: number;
    lastAddedCount: number;
    lastError: string | undefined;
  },
) {
  const state = await ctx.db.query("youtubeSync").first();
  if (state === null) {
    await ctx.db.insert("youtubeSync", fields);
  } else {
    await ctx.db.patch("youtubeSync", state._id, fields);
  }
}
