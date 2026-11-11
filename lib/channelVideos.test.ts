import { describe, expect, test } from "vitest";
import type { FeedVideo } from "@/convex/lib/youtube";
import { withChannelVideos } from "./channelVideos";
import { seedHomeContent } from "./seedContent";
import { seedMyths } from "@/convex/seedData";

const video = (videoId: string, publishedAt: string, isShort = false): FeedVideo => ({
  videoId,
  title: `Video ${videoId} | The Consult EP.9 #tag`,
  description: "First paragraph.\n\nLinks",
  publishedAt,
  isShort,
});

// The channel today (newest first), plus a Short.
const FEED = [
  video("8Y_ljIFRuJ4", "2026-11-05T21:00:00Z", true),
  video("o4kY44zLgig", "2026-11-01T11:00:00Z"),
  video("27T2ZaG26K4", "2026-10-25T11:00:00Z"),
];

// A database still holding the old placeholder episodes.
function staleContent() {
  const starter = seedHomeContent();
  return {
    ...starter,
    settings: { ...starter.settings, linktreeUrl: "https://linktr.ee/rounds.md" },
    episodes: [{ ...starter.episodes[0], key: "old", title: "ห้องฉุกเฉิน", youtubeUrl: "https://www.youtube.com/@roundsmed" }],
    myths: [],
    guests: [],
    latest: null,
  };
}

describe("withChannelVideos", () => {
  test("replaces stale placeholder episodes with EP.1 and EP.0", () => {
    const result = withChannelVideos(staleContent(), seedHomeContent(), FEED);
    expect(result.episodes.map((e) => e.slug)).toEqual(["cardiology", "what-is-rounds"]);
    expect(result.latest?.slug).toBe("cardiology");
    expect(result.myths).toHaveLength(seedMyths.length);
    expect(result.settings.linktreeUrl).toBe("https://linktr.ee/rounds.med");
  });

  test("adds a new upload first, skipping Shorts", () => {
    const feed = [video("NeWVide0_01", "2026-11-15T11:00:00Z"), ...FEED];
    const result = withChannelVideos(seedHomeContent(), seedHomeContent(), feed);
    expect(result.episodes.map((e) => e.youtubeUrl)).toEqual([
      "https://www.youtube.com/watch?v=NeWVide0_01",
      "https://www.youtube.com/watch?v=o4kY44zLgig",
      "https://www.youtube.com/watch?v=27T2ZaG26K4",
    ]);
    expect(result.episodes[0]).toMatchObject({
      title: "Video NeWVide0_01 | The Consult EP.9",
      status: "published",
      summary: "First paragraph.",
      seriesName: "The Consult",
      meta: "15 พ.ย. 2026",
    });
    // EP.1 is still featured, so it stays the latest until the sync features the new one.
    expect(result.latest?.slug).toBe("cardiology");
  });

  test("leaves content alone when YouTube can't be reached", () => {
    const content = staleContent();
    expect(withChannelVideos(content, seedHomeContent(), [])).toBe(content);
  });
});
