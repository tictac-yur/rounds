/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { afterEach, describe, expect, test, vi } from "vitest";
import schema from "./schema";
import { api, internal } from "./_generated/api";
import { countryShares, splitAgeGender } from "./lib/youtubeAnalytics";

const modules = import.meta.glob("./**/*.ts");
const CHANNEL = "UCEFU6rPDRcSFChIvvnYN3TQ";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// Answers the four Google endpoints the refresh calls.
function googleMock(opts: { tokenStatus?: number } = {}) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.startsWith("https://www.googleapis.com/youtube/v3/channels")) {
      return json({ items: [{ statistics: { subscriberCount: "1520", viewCount: "48211", videoCount: "12" } }] });
    }
    if (url.startsWith("https://oauth2.googleapis.com/token")) {
      return opts.tokenStatus
        ? json({ error: "invalid_grant", error_description: "Token has been expired or revoked." }, opts.tokenStatus)
        : json({ access_token: "access", refresh_token: "refresh-from-google" });
    }
    if (url.includes("dimensions=ageGroup")) {
      return json({
        rows: [
          ["age13-17", "female", 20],
          ["age13-17", "male", 10],
          ["age18-24", "female", 40],
          ["age18-24", "male", 30],
        ],
      });
    }
    if (url.includes("dimensions=country")) return json({ rows: [["TH", 900], ["US", 60]] });
    if (url.startsWith("https://youtubeanalytics.googleapis.com")) return json({ rows: [[1000]] });
    return new Response("not mocked", { status: 404 });
  });
}

async function setup() {
  const t = convexTest(schema, modules);
  await t.run(async (ctx) => {
    await ctx.db.insert("youtubeSync", { channelId: CHANNEL, lastAddedCount: 0 });
  });
  return t;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("audience helpers", () => {
  test("sums age groups and genders", () => {
    const { ageGroups, genders } = splitAgeGender([
      ["age18-24", "male", 30],
      ["age13-17", "female", 20.04],
      ["age18-24", "female", 40],
    ]);
    expect(ageGroups).toEqual([
      { group: "13-17", percent: 20 },
      { group: "18-24", percent: 70 },
    ]);
    expect(genders).toEqual([
      { gender: "female", percent: 60 },
      { gender: "male", percent: 30 },
    ]);
  });

  test("turns country views into shares", () => {
    expect(countryShares([["TH", 900], ["US", 60]], 1000)).toEqual([
      { country: "TH", percent: 90 },
      { country: "US", percent: 6 },
    ]);
    expect(countryShares([["TH", 1]], 0)).toEqual([]);
  });
});

describe("refresh", () => {
  test("reads public counts with the API key, and shows them on the site", async () => {
    vi.stubEnv("YOUTUBE_API_KEY", "key");
    vi.stubGlobal("fetch", googleMock());
    const t = await setup();
    await t.action(internal.youtubeStats.refresh, {});
    const home = await t.query(api.content.home, {});
    expect(home.channel).toEqual({ subscribers: 1520, views: 48211, videos: 12 });
    expect(home.audience).toBeNull();
  });

  test("reads the audience once YouTube is connected", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "secret");
    vi.stubGlobal("fetch", googleMock());
    const t = await setup();
    await t.run(async (ctx) => {
      const userId = await ctx.db.insert("users", { email: "a@example.com", role: "admin" });
      await ctx.db.insert("youtubeAuth", { refreshToken: "r", connectedAt: 0, connectedBy: userId });
    });
    await t.action(internal.youtubeStats.refresh, {});
    const { audience } = await t.query(api.content.home, {});
    expect(audience?.ageGroups).toEqual([
      { group: "13-17", percent: 30 },
      { group: "18-24", percent: 70 },
    ]);
    expect(audience?.countries[0]).toEqual({ country: "TH", percent: 90 });
  });

  test("forgets a permission Google has revoked", async () => {
    vi.stubGlobal("fetch", googleMock({ tokenStatus: 400 }));
    const t = await setup();
    await t.run(async (ctx) => {
      const userId = await ctx.db.insert("users", { email: "a@example.com", role: "admin" });
      await ctx.db.insert("youtubeAuth", { refreshToken: "r", connectedAt: 0, connectedBy: userId });
    });
    await t.action(internal.youtubeStats.refresh, {});
    const state = await t.run(async (ctx) => ({
      auth: await ctx.db.query("youtubeAuth").first(),
      stats: await ctx.db.query("channelStats").first(),
    }));
    expect(state.auth).toBeNull();
    expect(state.stats?.audienceError).toContain("Connect YouTube again");
  });
});

describe("Google sign-in callback", () => {
  test("stores the permission for a valid sign-in and sends the admin back", async () => {
    vi.stubEnv("SITE_URL", "https://roundsmed.com");
    vi.stubGlobal("fetch", googleMock());
    const t = await setup();
    await t.run(async (ctx) => {
      const userId = await ctx.db.insert("users", { email: "a@example.com", role: "admin" });
      await ctx.db.insert("youtubeOAuthStates", { state: "s1", userId, expiresAt: Date.now() + 60_000 });
    });
    const res = await t.fetch("/youtube/oauth/callback?code=c&state=s1", { redirect: "manual" });
    expect(res.headers.get("location")).toBe("https://roundsmed.com/admin?youtube=connected");
    const auth = await t.run((ctx) => ctx.db.query("youtubeAuth").first());
    expect(auth?.refreshToken).toBe("refresh-from-google");
  });

  test("refuses a sign-in it didn't start, or one that expired", async () => {
    vi.stubEnv("SITE_URL", "https://roundsmed.com");
    vi.stubGlobal("fetch", googleMock());
    const t = await setup();
    await t.run(async (ctx) => {
      const userId = await ctx.db.insert("users", { email: "a@example.com", role: "admin" });
      await ctx.db.insert("youtubeOAuthStates", { state: "old", userId, expiresAt: Date.now() - 1 });
    });
    for (const state of ["forged", "old"]) {
      const res = await t.fetch(`/youtube/oauth/callback?code=c&state=${state}`, { redirect: "manual" });
      expect(res.headers.get("location")).toBe("https://roundsmed.com/admin?youtube=expired");
    }
    expect(await t.run((ctx) => ctx.db.query("youtubeAuth").first())).toBeNull();
  });
});
