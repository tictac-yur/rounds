import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../lib/access";
import { applyEpisodeKit, episodeKitValidator, kitResultValidator } from "../lib/episodeKit";

// Admin → Episode kit: applies a kit Claude drafted from the transcript to one
// episode. Pasting the same kit twice adds nothing the second time.
export const apply = mutation({
  args: { episodeId: v.id("episodes"), kit: episodeKitValidator },
  returns: kitResultValidator,
  handler: async (ctx, { episodeId, kit }) => {
    await requireAdmin(ctx);
    const episode = await ctx.db.get("episodes", episodeId);
    if (episode === null) throw new ConvexError("That episode no longer exists.");
    if (!kit.guest.name.trim()) throw new ConvexError("The kit's guest needs a name.");
    return await applyEpisodeKit(ctx, episode, kit, { replaceGuest: true });
  },
});

// What each episode has and is missing, for the dashboard checklist.
export const checklist = query({
  args: {},
  returns: v.array(
    v.object({
      id: v.id("episodes"),
      title: v.string(),
      status: v.string(),
      // Episodes without a guest (like EP.0, the hosts' intro) need no kit.
      guest: v.union(v.string(), v.null()),
      guestBio: v.boolean(),
      flags: v.number(),
      chapters: v.number(),
      photo: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const episodes = await ctx.db.query("episodes").withIndex("by_order").take(200);
    const myths = await ctx.db.query("myths").withIndex("by_order").take(1000);
    const rows = [];
    for (const ep of episodes) {
      if (ep.status === "draft") continue;
      const guest = ep.guestId ? await ctx.db.get("guests", ep.guestId) : null;
      rows.push({
        id: ep._id,
        title: ep.title,
        status: ep.status,
        guest: guest?.name ?? null,
        guestBio: Boolean(guest?.bio?.trim()),
        flags: myths.filter((m) => m.episodeId === ep._id && m.published).length,
        chapters: ep.chapters?.length ?? 0,
        photo: Boolean(ep.thumbnailId),
      });
    }
    return rows;
  },
});
