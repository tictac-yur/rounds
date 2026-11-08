import "server-only";
import { channelIdFromPage, channelIdFromUrl, parseFeed, type FeedVideo } from "@/convex/lib/youtube";

// @roundsmed, so the usual case needs no extra request to look the id up.
const KNOWN_CHANNELS: Record<string, string> = {
  "https://www.youtube.com/@roundsmed": "UCEFU6rPDRcSFChIvvnYN3TQ",
};

// The channel's latest uploads from YouTube's public feed, or [] if YouTube
// can't be reached. Called from the cached home-page loader.
export async function fetchChannelVideos(channelUrl: string): Promise<FeedVideo[]> {
  try {
    let channelId: string | null = KNOWN_CHANNELS[channelUrl.replace(/\/+$/, "")] ?? channelIdFromUrl(channelUrl);
    if (!channelId) {
      const page = await fetch(channelUrl, { headers: { "Accept-Language": "en" } });
      if (!page.ok) return [];
      channelId = channelIdFromPage(await page.text());
      if (!channelId) return [];
    }
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    if (!res.ok) return [];
    return parseFeed(await res.text());
  } catch (error) {
    console.error("Couldn't read the YouTube feed.", error);
    return [];
  }
}
