import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../lib/access";
import {
  seedAudienceSegments,
  seedEpisodes,
  seedGuests,
  seedHosts,
  seedMyths,
  seedSeries,
  seedSettings,
  seedSponsorPackages,
} from "../seedData";

export const status = query({
  args: {},
  returns: v.object({ isEmpty: v.boolean() }),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [settings, episode] = await Promise.all([
      ctx.db.query("siteSettings").first(),
      ctx.db.query("episodes").first(),
    ]);
    return { isEmpty: settings === null && episode === null };
  },
});

// Loads the original landing-page copy into an empty database.
export const loadStarterContent = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [settings, episode] = await Promise.all([
      ctx.db.query("siteSettings").first(),
      ctx.db.query("episodes").first(),
    ]);
    if (settings !== null || episode !== null) {
      throw new ConvexError("Starter content can only be loaded into an empty site.");
    }

    await ctx.db.insert("siteSettings", seedSettings);

    const seriesIds = [];
    for (const [order, series] of seedSeries.entries()) {
      seriesIds.push(await ctx.db.insert("series", { ...series, order }));
    }
    const guestIds = [];
    for (const [order, guest] of seedGuests.entries()) {
      guestIds.push(await ctx.db.insert("guests", { ...guest, order }));
    }
    const episodeIds = [];
    for (const [order, { seriesIndex, guestIndex, ...episode }] of seedEpisodes.entries()) {
      episodeIds.push(
        await ctx.db.insert("episodes", {
          ...episode,
          seriesId: seriesIds[seriesIndex],
          guestId: guestIds[guestIndex],
          order,
        }),
      );
    }
    for (const [order, { episodeIndex, ...myth }] of seedMyths.entries()) {
      await ctx.db.insert("myths", {
        ...myth,
        episodeId: episodeIds[episodeIndex],
        published: true,
        order,
      });
    }
    for (const [order, segment] of seedAudienceSegments.entries()) {
      await ctx.db.insert("audienceSegments", { ...segment, order });
    }
    for (const [order, pkg] of seedSponsorPackages.entries()) {
      await ctx.db.insert("sponsorPackages", { ...pkg, order });
    }
    for (const [order, host] of seedHosts.entries()) {
      await ctx.db.insert("hosts", { ...host, order });
    }
    return null;
  },
});
