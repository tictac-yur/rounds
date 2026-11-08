import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { internal } from "../_generated/api";
import { requireAdmin } from "../lib/access";

// The YouTube sync's last result, for the admin dashboard.
export const status = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      channelId: v.union(v.string(), v.null()),
      lastCheckedAt: v.union(v.number(), v.null()),
      lastAddedCount: v.number(),
      lastError: v.union(v.string(), v.null()),
    }),
  ),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const state = await ctx.db.query("youtubeSync").first();
    if (state === null) return null;
    return {
      channelId: state.channelId ?? null,
      lastCheckedAt: state.lastCheckedAt ?? null,
      lastAddedCount: state.lastAddedCount,
      lastError: state.lastError ?? null,
    };
  },
});

// "Check YouTube now" — runs the same sync as the hourly job.
export const syncNow = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    await ctx.scheduler.runAfter(0, internal.youtube.sync, {});
    return null;
  },
});
