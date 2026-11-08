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
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const episodes = await ctx.db.query("episodes").withIndex("by_order").take(500);
    const flags = await ctx.db
      .query("myths")
      .withIndex("by_published_and_order", (q) => q.eq("published", true))
      .take(500);
    const published = episodes.filter((e) => e.status === "published");
    const latest = published.find((e) => e.featured) ?? published[0];
    return {
      published: published.length,
      drafts: episodes.filter((e) => e.status === "draft").length,
      comingSoon: episodes.filter((e) => e.status === "coming_soon").length,
      flags: flags.length,
      latestTitle: latest?.title ?? null,
    };
  },
});
