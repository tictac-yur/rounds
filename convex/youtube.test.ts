/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { afterEach, describe, expect, test, vi } from "vitest";
import schema from "./schema";
import { internal } from "./_generated/api";
import { parseFeed, thaiDate, videoIdFromUrl } from "./lib/youtube";

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

function stubYouTube() {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.startsWith("https://www.youtube.com/@roundsmed")) {
      return new Response(`<link rel="canonical" href="https://www.youtube.com/channel/${CHANNEL}">`);
    }
    if (url === `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL}`) return new Response(FEED);
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

describe("youtube sync", () => {
  test("adds new full-length videos as drafts, once", async () => {
    const fetchMock = stubYouTube();
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("series", { name: "The Consult", kicker: "", description: "", accentColor: "#000", order: 0 });
      // An episode already linked by hand to one of the videos.
      await ctx.db.insert("episodes", {
        slug: "what-is-rounds",
        title: "What is Rounds?",
        status: "published",
        featured: false,
        specialty: "",
        summary: "",
        thumbLabel: "",
        thumbVariant: 0,
        youtubeUrl: "https://youtu.be/27T2ZaG26K4",
        order: 0,
      });
    });

    await t.action(internal.youtube.sync, {});

    const episodes = await t.run((ctx) => ctx.db.query("episodes").withIndex("by_order").collect());
    expect(episodes).toHaveLength(2);
    const added = episodes[0];
    expect(added).toMatchObject({
      slug: "yt-o4ky44zlgig",
      title: 'คุยกับหมอหัวใจ "ถอดรหัสโรคหัวใจ" | The Consult EP.1',
      status: "draft",
      summary: "อกหักจนหัวใจวายได้จริงไหม?",
      releaseDate: "1 พ.ย. 2026",
      youtubeUrl: "https://www.youtube.com/watch?v=o4kY44zLgig",
      youtubeVideoId: "o4kY44zLgig",
      youtubeThumbnailUrl: "https://i.ytimg.com/vi/o4kY44zLgig/maxresdefault.jpg",
    });
    expect(added.seriesId).toBeDefined();
    expect(added.order).toBeLessThan(episodes[1].order);

    const state = await t.run((ctx) => ctx.db.query("youtubeSync").first());
    expect(state).toMatchObject({ channelId: CHANNEL, lastAddedCount: 1 });

    // A second run finds nothing new, and reuses the cached channel id.
    fetchMock.mockClear();
    await t.action(internal.youtube.sync, {});
    expect(await t.run((ctx) => ctx.db.query("episodes").collect())).toHaveLength(2);
    expect(fetchMock.mock.calls.some(([u]) => String(u).includes("@roundsmed"))).toBe(false);
  });

  test("records a failure instead of throwing", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    const t = convexTest(schema, modules);
    await t.action(internal.youtube.sync, {});
    const state = await t.run((ctx) => ctx.db.query("youtubeSync").first());
    expect(state?.lastError).toContain("HTTP 500");
  });
});
