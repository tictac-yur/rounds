import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery, MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { seedSettings } from "./seedData";
import {
  channelIdFromPage,
  channelIdFromUrl,
  cleanTitle,
  parseFeed,
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
    const { channelUrl, channelId: cached } = await ctx.runQuery(internal.youtube.getSource, {});
    try {
      let channelId = cached ?? channelIdFromUrl(channelUrl);
      if (!channelId) {
        const page = await fetch(channelUrl, { headers: { "Accept-Language": "en" } });
        if (!page.ok) throw new Error(`Couldn't open ${channelUrl} (HTTP ${page.status}).`);
        channelId = channelIdFromPage(await page.text());
        if (!channelId) throw new Error(`Couldn't find a YouTube channel at ${channelUrl}.`);
      }

      const feed = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
      if (!feed.ok) throw new Error(`YouTube feed returned HTTP ${feed.status}.`);
      const videos = parseFeed(await feed.text()).filter((video) => !video.isShort);

      const known: string[] = await ctx.runQuery(internal.youtube.knownVideoIds, {});
      const fresh = videos.filter((video) => !known.includes(video.videoId));
      const withThumbs = await Promise.all(
        fresh.map(async (video) => ({
          videoId: video.videoId,
          title: video.title,
          description: video.description,
          publishedAt: video.publishedAt,
          thumbnailUrl: await bestThumbnail(video.videoId),
        })),
      );

      await ctx.runMutation(internal.youtube.importVideos, { channelId, channelUrl, videos: withThumbs });
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
