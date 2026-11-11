import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { internal } from "../_generated/api";
import { requireAdmin } from "../lib/access";
import { audienceData } from "../schema";
import { googleAuthUrl } from "../lib/youtubeAnalytics";
import { callbackUrl } from "../youtubeStats";

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

// Live numbers and the YouTube Analytics connection, for the admin dashboard.
export const stats = query({
  args: {},
  returns: v.object({
    apiKeySet: v.boolean(),
    oauthSet: v.boolean(),
    siteUrlSet: v.boolean(),
    callbackUrl: v.string(),
    connected: v.boolean(),
    connectedAt: v.union(v.number(), v.null()),
    subscribers: v.union(v.number(), v.null()),
    views: v.union(v.number(), v.null()),
    videos: v.union(v.number(), v.null()),
    statsUpdatedAt: v.union(v.number(), v.null()),
    statsError: v.union(v.string(), v.null()),
    audience: v.union(audienceData, v.null()),
    audienceUpdatedAt: v.union(v.number(), v.null()),
    audienceError: v.union(v.string(), v.null()),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const s = await ctx.db.query("channelStats").first();
    const auth = await ctx.db.query("youtubeAuth").first();
    return {
      apiKeySet: Boolean(process.env.YOUTUBE_API_KEY),
      oauthSet: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      siteUrlSet: Boolean(process.env.SITE_URL),
      callbackUrl: callbackUrl(),
      connected: auth !== null,
      connectedAt: auth?.connectedAt ?? null,
      subscribers: s?.subscribers ?? null,
      views: s?.views ?? null,
      videos: s?.videos ?? null,
      statsUpdatedAt: s?.statsUpdatedAt ?? null,
      statsError: s?.statsError ?? null,
      audience: s?.audience ?? null,
      audienceUpdatedAt: s?.audienceUpdatedAt ?? null,
      audienceError: s?.audienceError ?? null,
    };
  },
});

export const refreshNumbers = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    await ctx.scheduler.runAfter(0, internal.youtubeStats.refresh, {});
    return null;
  },
});

// Starts the Google sign-in; returns the page to send the browser to.
export const startConnect = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const admin = await requireAdmin(ctx);
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new ConvexError("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Convex first.");
    }
    const state = crypto.randomUUID();
    await ctx.db.insert("youtubeOAuthStates", { state, userId: admin._id, expiresAt: Date.now() + 15 * 60_000 });
    return googleAuthUrl(clientId, callbackUrl(), state);
  },
});

export const disconnect = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const auth = await ctx.db.query("youtubeAuth").first();
    if (auth) await ctx.db.delete("youtubeAuth", auth._id);
    const s = await ctx.db.query("channelStats").first();
    if (s) await ctx.db.patch("channelStats", s._id, { audience: undefined, audienceUpdatedAt: undefined, audienceError: undefined });
    return null;
  },
});
