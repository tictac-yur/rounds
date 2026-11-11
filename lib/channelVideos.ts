import type { EpisodeView, HomeContent } from "@/convex/contentTypes";
import { cleanTitle, parseChapters, summaryFrom, thaiDate, thumbLabelFrom, videoIdFromUrl, watchUrl, type FeedVideo } from "@/convex/lib/youtube";

// Makes sure the home page shows the channel's real videos, whatever state the
// database is in:
// - Database not switched to the channel's content yet (none of its published
//   episodes is one of the channel's videos): the episodes, guests and flags
//   come from the starter content, which is EP.0 / EP.1.
// - Any full-length upload not in the episode list yet is added; channel
//   videos are listed newest first.
// The hourly sync (convex/youtube.ts) does the same in the database; this
// covers the time before it has run.
export function withChannelVideos(content: HomeContent, starter: HomeContent, feed: FeedVideo[]): HomeContent {
  const videos = feed.filter((v) => !v.isShort);
  if (videos.length === 0) return content;
  const feedIds = new Set(videos.map((v) => v.videoId));
  const idOf = (ep: EpisodeView) => videoIdFromUrl(ep.youtubeUrl);

  const isStale = !content.episodes.some((ep) => ep.status === "published" && feedIds.has(idOf(ep) ?? ""));
  const base: HomeContent = isStale
    ? {
        ...content,
        settings: {
          ...content.settings,
          linktreeUrl: content.settings.linktreeUrl.includes("linktr.ee/rounds.md")
            ? starter.settings.linktreeUrl
            : content.settings.linktreeUrl,
        },
        episodes: starter.episodes,
        myths: starter.myths,
        guests: starter.guests,
      }
    : content;

  const known = new Set(base.episodes.map(idOf).filter((id): id is string => id !== null));
  const seriesNames = base.series.map((s) => s.name);
  const added: EpisodeView[] = videos
    .filter((v) => !known.has(v.videoId))
    .map((v) => {
      const title = cleanTitle(v.title);
      return {
        key: `yt-${v.videoId}`,
        slug: `yt-${v.videoId.toLowerCase()}`,
        title,
        status: "published",
        featured: false,
        specialty: "",
        summary: summaryFrom(v.description),
        thumbLabel: thumbLabelFrom(v.title),
        thumbVariant: 0,
        thumbnailUrl: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        photoCaption: null,
        meta: thaiDate(v.publishedAt) ?? "",
        seriesName: seriesNames.find((name) => title.toLowerCase().includes(name.toLowerCase())) ?? null,
        guestName: null,
        guestPath: null,
        guestLang: "en",
        guestAffiliation: null,
        youtubeUrl: watchUrl(v.videoId),
        spotifyUrl: null,
        appleUrl: null,
        chapters: parseChapters(v.description),
      };
    });

  // Channel videos newest first (feed order), then everything else as ordered in the admin.
  const rank = (ep: EpisodeView) => {
    const index = videos.findIndex((v) => v.videoId === idOf(ep));
    return index === -1 ? videos.length : index;
  };
  const episodes = [...added, ...base.episodes]
    .map((ep, i) => ({ ep, i }))
    .sort((a, b) => rank(a.ep) - rank(b.ep) || a.i - b.i)
    .map(({ ep }) => ep);

  // The featured episode stays the latest (the sync features each new upload);
  // without one, the newest published episode.
  const latest =
    episodes.find((ep) => ep.status === "published" && ep.featured) ??
    episodes.find((ep) => ep.status === "published") ??
    null;

  return { ...base, episodes, latest };
}
