import { v } from "convex/values";
import { internalMutation, MutationCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { insertStarterContent } from "./lib/starter";
import { releaseFile } from "./lib/files";
import { videoIdFromUrl } from "./lib/youtube";
import { seedEpisodes, seedGuests, seedMyths, seedSeries, seedSettings } from "./seedData";
import { isPlaceholderValue } from "./lib/placeholder";

// One-time switch of an existing database to the channel's real content:
// The Consult EP.0 and EP.1 (from seedData), their guest and Red/Green flags.
// Placeholder episodes and the guests only they used are removed; episodes
// that came from YouTube are kept. Runs at the start of the YouTube sync and
// records CONTENT_VERSION so it never runs twice. Bump the version to re-run.
export const CONTENT_VERSION = 1;

export const apply = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const state = await ctx.db.query("youtubeSync").first();
    if ((state?.contentVersion ?? 0) >= CONTENT_VERSION) return null;

    const settings = await ctx.db.query("siteSettings").first();
    const anyEpisode = await ctx.db.query("episodes").first();
    if (settings === null && anyEpisode === null) {
      await insertStarterContent(ctx);
    } else {
      await replaceWithChannel(ctx, settings);
    }

    if (state === null) {
      await ctx.db.insert("youtubeSync", { lastAddedCount: 0, contentVersion: CONTENT_VERSION });
    } else {
      await ctx.db.patch("youtubeSync", state._id, { contentVersion: CONTENT_VERSION });
    }
    return null;
  },
});

async function replaceWithChannel(ctx: MutationCtx, settings: Doc<"siteSettings"> | null) {
  // Settings: fix the Linktree link and fill the contact email if still blank.
  if (settings === null) {
    await ctx.db.insert("siteSettings", seedSettings);
  } else {
    await ctx.db.patch("siteSettings", settings._id, {
      linktreeUrl: seedSettings.linktreeUrl,
      ...(isPlaceholderValue(settings.contactEmail) ? { contactEmail: seedSettings.contactEmail } : {}),
    });
  }

  // The Consult series and the EP.1 guest, reused when they already exist.
  const series = await ctx.db.query("series").withIndex("by_order").take(100);
  const seriesIds: (Id<"series"> | undefined)[] = [];
  for (const [i, seed] of seedSeries.entries()) {
    const found = series.find((s) => s.name.trim().toLowerCase() === seed.name.toLowerCase());
    seriesIds.push(found?._id ?? (i === 0 ? await ctx.db.insert("series", { ...seed, order: -1 }) : undefined));
  }
  const guests = await ctx.db.query("guests").withIndex("by_order").take(200);
  const guestIds: Id<"guests">[] = [];
  for (const seed of seedGuests) {
    const found = guests.find((g) => g.name.trim() === seed.name);
    guestIds.push(found?._id ?? (await ctx.db.insert("guests", { ...seed, order: -1 })));
  }

  // Episodes: keep YouTube ones, drop the placeholders.
  const keepVideoIds = new Set<string>(seedEpisodes.map((e) => e.youtubeVideoId));
  const byVideoId = new Map<string, Doc<"episodes">>();
  for (const episode of await ctx.db.query("episodes").withIndex("by_order").take(500)) {
    const videoId = episode.youtubeVideoId ?? videoIdFromUrl(episode.youtubeUrl);
    if (videoId && keepVideoIds.has(videoId)) {
      byVideoId.set(videoId, episode);
    } else if (videoId) {
      await ctx.db.patch("episodes", episode._id, { featured: false, youtubeVideoId: videoId });
    } else {
      await releaseFile(ctx, episode.thumbnailId);
      await ctx.db.delete("episodes", episode._id);
    }
  }

  const episodeIds: Id<"episodes">[] = [];
  for (const [order, { seriesIndex, guestIndex, ...seed }] of seedEpisodes.entries()) {
    const fields = {
      ...seed,
      seriesId: seriesIds[seriesIndex],
      guestId: guestIds[guestIndex],
      order,
    };
    const existing = byVideoId.get(seed.youtubeVideoId);
    const slugOwner = await ctx.db
      .query("episodes")
      .withIndex("by_slug", (q) => q.eq("slug", seed.slug))
      .first();
    if (existing) {
      // Keep an uploaded photo and, if the slug is taken by another episode, the old slug.
      const slug = slugOwner === null || slugOwner._id === existing._id ? seed.slug : existing.slug;
      await ctx.db.patch("episodes", existing._id, { ...fields, slug });
      episodeIds.push(existing._id);
    } else {
      const slug = slugOwner === null ? seed.slug : `${seed.slug}-${seed.youtubeVideoId.toLowerCase()}`;
      episodeIds.push(await ctx.db.insert("episodes", { ...fields, slug }));
    }
  }

  // Red / Green flags: replaced by the ones from EP.1.
  for (const myth of await ctx.db.query("myths").withIndex("by_order").take(500)) {
    await ctx.db.delete("myths", myth._id);
  }
  for (const [order, { episodeIndex, ...myth }] of seedMyths.entries()) {
    await ctx.db.insert("myths", { ...myth, episodeId: episodeIds[episodeIndex], published: true, order });
  }

  // Guests that no remaining episode uses (the placeholder doctors).
  const usedGuests = new Set<string>();
  for (const episode of await ctx.db.query("episodes").withIndex("by_order").take(500)) {
    if (episode.guestId) usedGuests.add(episode.guestId);
  }
  for (const guest of await ctx.db.query("guests").withIndex("by_order").take(200)) {
    if (!usedGuests.has(guest._id)) {
      await releaseFile(ctx, guest.photoId);
      await ctx.db.delete("guests", guest._id);
    }
  }
}
