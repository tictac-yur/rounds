import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireAdmin } from "../lib/access";

// Numbers and the current latest episode for the admin dashboard.
export const summary = query({
  args: {},
  returns: v.object({
    published: v.number(),
    drafts: v.number(),
    comingSoon: v.number(),
    flags: v.number(),
    latestTitle: v.union(v.string(), v.null()),
    // Which hosts have a portrait and which published episodes have a photo.
    photos: v.array(
      v.object({ kind: v.union(v.literal("host"), v.literal("episode")), name: v.string(), done: v.boolean() }),
    ),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const episodes = await ctx.db.query("episodes").withIndex("by_order").take(500);
    const flags = await ctx.db
      .query("myths")
      .withIndex("by_published_and_order", (q) => q.eq("published", true))
      .take(500);
    const published = episodes.filter((e) => e.status === "published");
    const hosts = await ctx.db.query("hosts").withIndex("by_order").take(50);
    const latest = published.find((e) => e.featured) ?? published[0];
    return {
      published: published.length,
      drafts: episodes.filter((e) => e.status === "draft").length,
      comingSoon: episodes.filter((e) => e.status === "coming_soon").length,
      flags: flags.length,
      latestTitle: latest?.title ?? null,
      photos: [
        ...hosts.map((h) => ({ kind: "host" as const, name: h.name, done: Boolean(h.photoId) })),
        ...published.map((e) => ({ kind: "episode" as const, name: e.title, done: Boolean(e.thumbnailId) })),
      ],
    };
  },
});
