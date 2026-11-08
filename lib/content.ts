import "server-only";
import { cacheLife } from "next/cache";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { HomeContent } from "@/convex/contentTypes";
import { seedHomeContent } from "./seedContent";
import { withChannelVideos } from "./channelVideos";
import { fetchChannelVideos } from "./youtubeFeed";

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  // Edits made in the admin portal show up on the site within a minute.
  cacheLife("minutes");
  const content = await loadContent();
  // The channel's videos always show, even before the hourly sync has run.
  const videos = await fetchChannelVideos(content.settings.youtubeUrl);
  return withChannelVideos(content, seedHomeContent(), videos);
}

async function loadContent(): Promise<HomeContent> {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return seedHomeContent();
  }
  try {
    const content = await fetchQuery(api.content.home, {});
    // A fresh deployment (e.g. a branch preview) has no content yet: show the
    // starter content until it is loaded from the admin dashboard.
    const isEmpty = content.episodes.length === 0 && content.series.length === 0 && content.hosts.length === 0;
    return isEmpty ? seedHomeContent() : content;
  } catch (error) {
    console.error("Failed to load site content from Convex; using starter content.", error);
    return seedHomeContent();
  }
}
