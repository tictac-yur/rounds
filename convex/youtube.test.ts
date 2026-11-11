/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { afterEach, describe, expect, test, vi } from "vitest";
import schema from "./schema";
import { internal } from "./_generated/api";
import { parseFeed, thaiDate, videoIdFromUrl } from "./lib/youtube";
import { seedMyths, seedSettings } from "./seedData";

const modules = import.meta.glob("./**/*.ts");

const CHANNEL = "UCEFU6rPDRcSFChIvvnYN3TQ";

// The shape of YouTube's feed, trimmed: one Short and two full videos.
const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <entry>
  <yt:videoId>8Y_ljIFRuJ4</yt:videoId>
  <title>ไข่วันละ 2 ฟอง | The Consult EP.1 #shorts</title>
  <link rel="alternate" href="https://www.youtube.com/shorts/8Y_ljIFRuJ4"/>
  <published>2026-11-05T21:00:16+00:00</published>
  <media:group><media:description>short</media:description></media:group>
 </entry>
 <entry>
  <yt:videoId>o4kY44zLgig</yt:videoId>
  <title>คุยกับหมอหัวใจ &quot;ถอดรหัสโรคหัวใจ&quot; | The Consult EP.1</title>
  <link rel="alternate" href="https://www.youtube.com/watch?v=o4kY44zLgig"/>
  <published>2026-11-01T11:00:00+00:00</published>
  <media:group><media:description>อกหักจนหัวใจวายได้จริงไหม? #heart

🔗 ติดตาม Rounds</media:description></media:group>
 </entry>
 <entry>
  <yt:videoId>27T2ZaG26K4</yt:videoId>
  <title>ทำความรู้จักกับเรา &quot;What is Rounds?&quot; | The Consult EP.0</title>
  <link rel="alternate" href="https://www.youtube.com/watch?v=27T2ZaG26K4"/>
  <published>2026-10-25T11:00:00+00:00</published>
  <media:group><media:description>เรียนหมอ 6 ปี เริ่มนับจากวันนี้</media:description></media:group>
 </entry>
</feed>`;

function stubYouTube(feed = FEED) {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.startsWith("https://www.youtube.com/@roundsmed")) {
      return new Response(`<link rel="canonical" href="https://www.youtube.com/channel/${CHANNEL}">`);
    }
    if (url === `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL}`) return new Response(feed);
    if (url.includes("maxresdefault")) return new Response(null, { status: url.includes("o4kY44zLgig") ? 200 : 404 });
    return new Response(null, { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("youtube helpers", () => {
  test("reads video ids from links", () => {
    expect(videoIdFromUrl("https://www.youtube.com/watch?v=o4kY44zLgig")).toBe("o4kY44zLgig");
    expect(videoIdFromUrl("https://youtu.be/o4kY44zLgig?t=3")).toBe("o4kY44zLgig");
    expect(videoIdFromUrl("https://www.youtube.com/shorts/8Y_ljIFRuJ4")).toBe("8Y_ljIFRuJ4");
    expect(videoIdFromUrl("https://www.youtube.com/@roundsmed")).toBeNull();
    expect(videoIdFromUrl("[YOUTUBE LINK]")).toBeNull();
  });

  test("parses the feed and spots Shorts", () => {
    const videos = parseFeed(FEED);
    expect(videos.map((v) => [v.videoId, v.isShort])).toEqual([
      ["8Y_ljIFRuJ4", true],
      ["o4kY44zLgig", false],
      ["27T2ZaG26K4", false],
    ]);
    expect(videos[1].title).toBe('คุยกับหมอหัวใจ "ถอดรหัสโรคหัวใจ" | The Consult EP.1');
  });

  test("formats Thai dates in Bangkok time", () => {
    expect(thaiDate("2026-10-31T20:00:00+00:00")).toBe("1 พ.ย. 2026");
  });
});

// A video newer than EP.1, as if just uploaded.
const NEW_ENTRY = ` <entry>
  <yt:videoId>NeWVide0_01</yt:videoId>
  <title>คุยกับจักษุแพทย์ | The Consult EP.2</title>
  <link rel="alternate" href="https://www.youtube.com/watch?v=NeWVide0_01"/>
  <published>2026-11-15T11:00:00+00:00</published>
  <media:group><media:description>เล่นมือถือในที่มืดทำให้ตาเสียจริงไหม?</media:description></media:group>
 </entry>
</feed>`;

describe("channel content switch", () => {
  test("replaces placeholder content with EP.0 and EP.1", async () => {
    stubYouTube();
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("siteSettings", { ...seedSettings, contactEmail: "[EMAIL]", linktreeUrl: "https://linktr.ee/rounds.md" });
      await ctx.db.insert("series", { name: "The Consult", kicker: "", description: "", accentColor: "#000", order: 0 });
      const oldGuest = await ctx.db.insert("guests", { name: "[ชื่ออาจารย์]", nameLang: "th", field: "ER", order: 0 });
      const old = await ctx.db.insert("episodes", {
        slug: "emergency-medicine",
        title: "ห้องฉุกเฉิน",
        status: "published",
        featured: true,
        guestId: oldGuest,
        specialty: "ER",
        summary: "",
        thumbLabel: "",
        thumbVariant: 0,
        youtubeUrl: "https://www.youtube.com/@roundsmed",
        order: 0,
      });
      await ctx.db.insert("myths", { claim: "old", answer: "old", verdict: "red", episodeId: old, published: true, order: 0 });
      // EP.0 already imported as a draft by an earlier sync.
      await ctx.db.insert("episodes", {
        slug: "yt-27t2zag26k4",
        title: "draft",
        status: "draft",
        featured: false,
        specialty: "",
        summary: "",
        thumbLabel: "",
        thumbVariant: 0,
        youtubeUrl: "https://www.youtube.com/watch?v=27T2ZaG26K4",
        youtubeVideoId: "27T2ZaG26K4",
        order: 1,
      });
    });

    await t.action(internal.youtube.sync, {});

    const episodes = await t.run((ctx) => ctx.db.query("episodes").withIndex("by_order").collect());
    expect(episodes.map((e) => [e.youtubeVideoId, e.status, e.featured])).toEqual([
      ["o4kY44zLgig", "published", true],
      ["27T2ZaG26K4", "published", false],
    ]);
    expect(episodes[1].slug).toBe("what-is-rounds");
    const guests = await t.run((ctx) => ctx.db.query("guests").collect());
    expect(guests.map((g) => g.name)).toEqual(["ผศ.นพ.กานต์ วิฑูรชาติ"]);
    expect(episodes[0].guestId).toBe(guests[0]._id);
    const myths = await t.run((ctx) => ctx.db.query("myths").collect());
    expect(myths.map((m) => [m.verdict, m.episodeId])).toEqual(
      seedMyths.map((m) => [m.verdict, episodes[m.episodeIndex]._id]),
    );
    const settings = await t.run((ctx) => ctx.db.query("siteSettings").first());
    expect(settings).toMatchObject({ linktreeUrl: "https://linktr.ee/rounds.med", contactEmail: "roundsmedofficial@gmail.com" });

    // It runs once: later edits survive the next sync.
    await t.run((ctx) => ctx.db.patch("episodes", episodes[1]._id, { title: "edited" }));
    await t.action(internal.youtube.sync, {});
    expect((await t.run((ctx) => ctx.db.get("episodes", episodes[1]._id)))?.title).toBe("edited");
  });

  test("fills an empty database with the starter content", async () => {
    stubYouTube();
    const t = convexTest(schema, modules);
    await t.action(internal.youtube.sync, {});
    const episodes = await t.run((ctx) => ctx.db.query("episodes").withIndex("by_order").collect());
    expect(episodes.map((e) => e.slug)).toEqual(["cardiology", "what-is-rounds"]);
    expect(await t.run((ctx) => ctx.db.query("hosts").collect())).toHaveLength(2);
  });
});

describe("youtube sync", () => {
  test("publishes a new upload once and makes it the latest episode", async () => {
    const fetchMock = stubYouTube(FEED.replace("</feed>", NEW_ENTRY));
    const t = convexTest(schema, modules);
    await t.action(internal.youtube.sync, {});

    const episodes = await t.run((ctx) => ctx.db.query("episodes").withIndex("by_order").collect());
    expect(episodes).toHaveLength(3);
    expect(episodes[0]).toMatchObject({
      slug: "yt-newvide0-01",
      title: "คุยกับจักษุแพทย์ | The Consult EP.2",
      status: "published",
      featured: true,
      summary: "เล่นมือถือในที่มืดทำให้ตาเสียจริงไหม?",
      releaseDate: "15 พ.ย. 2026",
      youtubeUrl: "https://www.youtube.com/watch?v=NeWVide0_01",
      youtubeThumbnailUrl: "https://i.ytimg.com/vi/NeWVide0_01/hqdefault.jpg",
    });
    expect(episodes[0].seriesId).toBeDefined();
    expect(episodes.filter((e) => e.featured)).toHaveLength(1);

    const state = await t.run((ctx) => ctx.db.query("youtubeSync").first());
    expect(state).toMatchObject({ channelId: CHANNEL, lastAddedCount: 1 });

    // A second run finds nothing new, and reuses the cached channel id.
    fetchMock.mockClear();
    await t.action(internal.youtube.sync, {});
    expect(await t.run((ctx) => ctx.db.query("episodes").collect())).toHaveLength(3);
    expect(fetchMock.mock.calls.some(([u]) => String(u).includes("@roundsmed"))).toBe(false);
  });

  test("records a failure instead of throwing", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    const t = convexTest(schema, modules);
    await t.action(internal.youtube.sync, {});
    const state = await t.run((ctx) => ctx.db.query("youtubeSync").first());
    expect(state?.lastError).toContain("HTTP 500");
    expect(state?.contentVersion).toBe(1);
  });
});

describe("chapters", () => {
  test("reads the timestamp list from a description", async () => {
    const { parseChapters, timestamp } = await import("./lib/youtube");
    const desc = "intro\n\n📍 Timestamps\n00:00 - Highlight\n00:37 - ต้อนรับ\n1:02:03 Outro\n\nnot 12:00 a chapter? no";
    expect(parseChapters(desc)).toEqual([
      { seconds: 0, title: "Highlight" },
      { seconds: 37, title: "ต้อนรับ" },
      { seconds: 3723, title: "Outro" },
    ]);
    expect(parseChapters("12:00 noon\n13:00 lunch")).toEqual([]);
    expect(timestamp(3723)).toBe("1:02:03");
    expect(timestamp(37)).toBe("0:37");
  });
});
