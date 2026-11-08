import { MutationCtx } from "../_generated/server";
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

// Writes the starter content (convex/seedData.ts) into an empty database.
export async function insertStarterContent(ctx: MutationCtx) {
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
    await ctx.db.insert("myths", { ...myth, episodeId: episodeIds[episodeIndex], published: true, order });
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
}
