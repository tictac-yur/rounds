import "server-only";
import { cacheLife } from "next/cache";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { HomeContent } from "@/convex/contentTypes";
import { seedHomeContent } from "./seedContent";
import { withChannelVideos } from "./channelVideos";
import { fetchChannelVideos } from "./youtubeFeed";

// Vercel keeps cached data from one deployment to the next. Keying the cache
// by the deployed commit means a new version of the site never reads content
// cached by an older one, whose shape may differ (missing fields).
const VERSION = process.env.VERCEL_GIT_COMMIT_SHA ?? "local";

export async function getHomeContent(): Promise<HomeContent> {
  return withDefaults(await cachedHomeContent(VERSION));
}

// Safety net for content cached before a field existed: fill it with the
// value that means "nothing yet", so pages render instead of crashing.
function withDefaults(c: HomeContent): HomeContent {
  return {
    ...c,
    channel: c.channel ?? null,
    audience: c.audience ?? null,
    episodes: c.episodes.map((ep) => ({ ...ep, guestPath: ep.guestPath ?? null, chapters: ep.chapters ?? [] })),
    latest: c.latest ? { ...c.latest, guestPath: c.latest.guestPath ?? null, chapters: c.latest.chapters ?? [] } : null,
    myths: c.myths.map((m) => ({
      ...m,
      answeredByPath: m.answeredByPath ?? null,
      episodeTitle: m.episodeTitle ?? null,
      episodeUrl: m.episodeUrl ?? null,
    })),
    guests: c.guests.map((g) => ({
      ...g,
      path: g.path ?? g.key,
      nameAlt: g.nameAlt ?? null,
      affiliation: g.affiliation ?? null,
      bio: g.bio ?? null,
      profileUrl: g.profileUrl ?? null,
      photoUrl: g.photoUrl ?? null,
    })),
  };
}

async function cachedHomeContent(version: string): Promise<HomeContent> {
  "use cache";
  void version; // Part of the cache key only.
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
