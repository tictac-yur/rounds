import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { audienceData } from "./schema";
import {
  AUDIENCE_DAYS,
  CALLBACK_PATH,
  countryShares,
  isoDate,
  parseCount,
  splitAgeGender,
} from "./lib/youtubeAnalytics";

// Hourly (convex/crons.ts): the channel's public numbers with the
// YOUTUBE_API_KEY, and, once "Connect YouTube" is done in the admin, who
// watches from YouTube Analytics.

export const source = internalQuery({
  args: {},
  returns: v.object({ channelId: v.union(v.string(), v.null()), refreshToken: v.union(v.string(), v.null()) }),
  handler: async (ctx) => {
    const sync = await ctx.db.query("youtubeSync").first();
    const auth = await ctx.db.query("youtubeAuth").first();
    return { channelId: sync?.channelId ?? null, refreshToken: auth?.refreshToken ?? null };
  },
});

export const save = internalMutation({
  args: {
    stats: v.optional(
      v.object({
        subscribers: v.optional(v.number()),
        views: v.optional(v.number()),
        videos: v.optional(v.number()),
      }),
    ),
    statsError: v.optional(v.string()),
    audience: v.optional(audienceData),
    audienceError: v.optional(v.string()),
    // Google refused the saved permission (revoked or expired): forget it.
    forgetAuth: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();
    const patch: Record<string, unknown> = {};
    if (args.stats) Object.assign(patch, args.stats, { statsUpdatedAt: now, statsError: undefined });
    if (args.statsError !== undefined) patch.statsError = args.statsError;
    if (args.audience) Object.assign(patch, { audience: args.audience, audienceUpdatedAt: now, audienceError: undefined });
    if (args.audienceError !== undefined) patch.audienceError = args.audienceError;
    const existing = await ctx.db.query("channelStats").first();
    if (existing) await ctx.db.patch("channelStats", existing._id, patch);
    else await ctx.db.insert("channelStats", Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)));
    if (args.forgetAuth) {
      const auth = await ctx.db.query("youtubeAuth").first();
      if (auth) await ctx.db.delete("youtubeAuth", auth._id);
    }
    return null;
  },
});

async function getJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = body?.error?.message ?? body?.error_description ?? body?.error ?? `HTTP ${res.status}`;
    throw Object.assign(new Error(String(message)), { status: res.status, code: body?.error });
  }
  return body;
}

async function publicStats(channelId: string, key: string) {
  const body = await getJson(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(key)}`,
  );
  const stats = body.items?.[0]?.statistics;
  if (!stats) throw new Error("YouTube didn't return this channel's statistics.");
  return {
    subscribers: stats.hiddenSubscriberCount ? undefined : parseCount(stats.subscriberCount),
    views: parseCount(stats.viewCount),
    videos: parseCount(stats.videoCount),
  };
}

async function audience(refreshToken: string) {
  const token = await getJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const headers = { Authorization: `Bearer ${token.access_token}` };
  const now = Date.now();
  const report = (params: Record<string, string>) =>
    getJson(
      `https://youtubeanalytics.googleapis.com/v2/reports?${new URLSearchParams({
        ids: "channel==MINE",
        startDate: isoDate(now, AUDIENCE_DAYS),
        endDate: isoDate(now),
        ...params,
      })}`,
      { headers },
    );
  const [demographics, countries, totals] = await Promise.all([
    report({ metrics: "viewerPercentage", dimensions: "ageGroup,gender" }),
    report({ metrics: "views", dimensions: "country", sort: "-views", maxResults: "5" }),
    report({ metrics: "views" }),
  ]);
  return {
    days: AUDIENCE_DAYS,
    ...splitAgeGender(demographics.rows ?? []),
    countries: countryShares(countries.rows ?? [], Number(totals.rows?.[0]?.[0] ?? 0)),
  };
}

export const refresh = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const { channelId, refreshToken } = await ctx.runQuery(internal.youtubeStats.source, {});
    const key = process.env.YOUTUBE_API_KEY;
    if (key && channelId) {
      try {
        await ctx.runMutation(internal.youtubeStats.save, { stats: await publicStats(channelId, key) });
      } catch (error) {
        await ctx.runMutation(internal.youtubeStats.save, { statsError: (error as Error).message });
      }
    }
    if (refreshToken) {
      try {
        await ctx.runMutation(internal.youtubeStats.save, { audience: await audience(refreshToken) });
      } catch (error) {
        const revoked = (error as { code?: string }).code === "invalid_grant";
        await ctx.runMutation(internal.youtubeStats.save, {
          audienceError: revoked
            ? "YouTube permission was removed or expired. Press Connect YouTube again."
            : (error as Error).message,
          forgetAuth: revoked,
        });
      }
    }
    return null;
  },
});

// The Google sign-in started from the admin comes back here (convex/http.ts).
export const consumeState = internalMutation({
  args: { state: v.string() },
  returns: v.union(v.id("users"), v.null()),
  handler: async (ctx, { state }) => {
    const row = await ctx.db
      .query("youtubeOAuthStates")
      .withIndex("by_state", (q) => q.eq("state", state))
      .unique();
    if (row === null) return null;
    await ctx.db.delete("youtubeOAuthStates", row._id);
    return row.expiresAt > Date.now() ? row.userId : null;
  },
});

export const storeGrant = internalMutation({
  args: { refreshToken: v.string(), userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, { refreshToken, userId }) => {
    const existing = await ctx.db.query("youtubeAuth").first();
    const grant = { refreshToken, connectedAt: Date.now(), connectedBy: userId };
    if (existing) await ctx.db.replace("youtubeAuth", existing._id, grant);
    else await ctx.db.insert("youtubeAuth", grant);
    await ctx.scheduler.runAfter(0, internal.youtubeStats.refresh, {});
    return null;
  },
});

export function callbackUrl(): string {
  return `${process.env.CONVEX_SITE_URL}${CALLBACK_PATH}`;
}
