import { describe, expect, test } from "vitest";
import type { EpisodeView } from "@/convex/contentTypes";
import { introEpisode } from "./episodes";

const ep = (key: string, url: string | null, status: EpisodeView["status"] = "published") =>
  ({ key, status, youtubeUrl: url }) as EpisodeView;

describe("introEpisode", () => {
  test("is always What is Rounds, wherever it sits and even if a newer episode has no guest", () => {
    const episodes = [
      ep("ep2", "https://www.youtube.com/watch?v=DU7cJK9NexU"),
      ep("ep1", "https://www.youtube.com/watch?v=o4kY44zLgig"),
      ep("ep0", "https://www.youtube.com/watch?v=27T2ZaG26K4"),
    ];
    expect(introEpisode(episodes)?.key).toBe("ep0");
  });

  test("falls back to the oldest published episode", () => {
    expect(introEpisode([ep("new", "https://youtu.be/a"), ep("old", "https://youtu.be/b"), ep("draft", null, "draft")])?.key).toBe("old");
    expect(introEpisode([])).toBeNull();
  });
});
