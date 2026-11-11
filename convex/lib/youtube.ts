// Helpers for reading the channel's public YouTube feed. No API key needed:
// https://www.youtube.com/feeds/videos.xml?channel_id=UC… lists the latest
// 15 uploads (videos and Shorts).

export type FeedVideo = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  isShort: boolean;
  // From the YouTube Data API only.
  views?: number;
  thumbnailUrl?: string;
  wideThumbnailUrl?: string;
};

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

// "https://www.youtube.com/watch?v=ID", "https://youtu.be/ID",
// "https://www.youtube.com/shorts/ID" or "…/live/ID" → "ID". A channel link → null.
export function videoIdFromUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www\.|m\.)/, "");
  let id: string | null = null;
  if (host === "youtu.be") {
    id = parsed.pathname.slice(1);
  } else if (host === "youtube.com") {
    id = parsed.searchParams.get("v") ?? parsed.pathname.match(/^\/(?:shorts|live|embed)\/([^/?]+)/)?.[1] ?? null;
  }
  return id && VIDEO_ID.test(id) ? id : null;
}

export function watchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function channelIdFromUrl(url: string): string | null {
  return url.match(/youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})/)?.[1] ?? null;
}

// The channel id from a channel page such as https://www.youtube.com/@roundsmed.
export function channelIdFromPage(html: string): string | null {
  return (
    html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})"/)?.[1] ??
    html.match(/"externalId":"(UC[A-Za-z0-9_-]{22})"/)?.[1] ??
    null
  );
}

function decodeXml(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");
}

function tag(entry: string, name: string): string | null {
  const match = entry.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return match ? decodeXml(match[1]).trim() : null;
}

export function parseFeed(xml: string): FeedVideo[] {
  return xml
    .split("<entry>")
    .slice(1)
    .flatMap((entry) => {
      const videoId = tag(entry, "yt:videoId");
      const title = tag(entry, "title");
      if (!videoId || !VIDEO_ID.test(videoId) || !title) return [];
      const link = entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1] ?? "";
      return [
        {
          videoId,
          title,
          description: tag(entry, "media:description") ?? "",
          publishedAt: tag(entry, "published") ?? "",
          isShort: link.includes("/shorts/"),
        },
      ];
    });
}

// "คุยกับหมอหัวใจ "ถอดรหัสโรคหัวใจ" | The Consult EP.1 #tag" → without the hashtags.
export function cleanTitle(title: string): string {
  return title.replace(/(^|\s)#[^\s#]+/g, "").replace(/\s+/g, " ").trim();
}

// The description's opening paragraph, before links and hashtags.
export function summaryFrom(description: string): string {
  const first = description.split(/\n\s*\n/)[0] ?? "";
  const text = first.replace(/(^|\s)#[^\s#]+/g, "").replace(/\s+/g, " ").trim();
  return text.length > 400 ? `${text.slice(0, 397)}…` : text;
}

// Short label for the stand-in artwork: the title before " | ", trimmed.
export function thumbLabelFrom(title: string): string {
  const head = cleanTitle(title).split(" | ")[0].replace(/["“”]/g, "");
  return head.length > 28 ? `${head.slice(0, 27)}…` : head;
}

const TH_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

// "2026-11-01T…" → "1 พ.ย. 2026" (Bangkok time).
export function thaiDate(iso: string): string | undefined {
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return undefined;
  const d = new Date(time + 7 * 60 * 60 * 1000);
  return `${d.getUTCDate()} ${TH_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function slugFor(videoId: string): string {
  const base = `yt-${videoId.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return base.replace(/-+/g, "-").replace(/-$/, "");
}

export type Chapter = { seconds: number; title: string };

// The chapter list in a video description: lines like "00:37 - Welcome"
// or "1:02:03 Outro". YouTube needs at least two, starting at 0:00.
export function parseChapters(description: string): Chapter[] {
  const chapters: Chapter[] = [];
  for (const line of description.split("\n")) {
    const m = line.trim().match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*[-–—:|]?\s*(.+)$/);
    if (!m) continue;
    const seconds = Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]);
    chapters.push({ seconds, title: m[4].trim() });
  }
  return chapters.length >= 2 && chapters[0].seconds === 0 ? chapters : [];
}

export function timestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

// "PT1H2M3S" → 3723.
export function isoDurationSeconds(duration: string): number {
  const m = duration.match(/^P(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

// Shorts are up to 3 minutes; full episodes are much longer.
export const SHORT_MAX_SECONDS = 180;

// The channel's latest 50 uploads from the YouTube Data API (the public feed
// stopped working): title, description, date, length and views.
export async function fetchUploads(channelId: string, key: string): Promise<FeedVideo[]> {
  const get = async (path: string, params: Record<string, string>) => {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${new URLSearchParams({ ...params, key })}`);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`YouTube API: ${body?.error?.message ?? `HTTP ${res.status}`}`);
    return body;
  };
  // Every channel's uploads playlist is its id with "UC" swapped for "UU".
  const list = await get("playlistItems", {
    part: "snippet",
    maxResults: "50",
    playlistId: `UU${channelId.slice(2)}`,
  });
  type Item = { snippet: { title: string; description: string; publishedAt: string; resourceId: { videoId: string }; thumbnails?: Record<string, { url: string }> } };
  const items: Item[] = (list.items ?? []).filter((i: Item) => VIDEO_ID.test(i.snippet?.resourceId?.videoId ?? ""));
  if (items.length === 0) return [];
  const details = await get("videos", {
    part: "contentDetails,statistics",
    id: items.map((i) => i.snippet.resourceId.videoId).join(","),
  });
  const byId = new Map<string, { contentDetails?: { duration?: string }; statistics?: { viewCount?: string } }>(
    (details.items ?? []).map((d: { id: string }) => [d.id, d]),
  );
  return items.map(({ snippet }) => {
    const videoId = snippet.resourceId.videoId;
    const d = byId.get(videoId);
    const t = snippet.thumbnails ?? {};
    return {
      videoId,
      title: snippet.title,
      description: snippet.description,
      publishedAt: snippet.publishedAt,
      isShort: isoDurationSeconds(d?.contentDetails?.duration ?? "") <= SHORT_MAX_SECONDS,
      views: Number(d?.statistics?.viewCount ?? 0),
      thumbnailUrl: (t.maxres ?? t.standard ?? t.high ?? t.medium)?.url,
      // Only the widescreen sizes have no black bars, so a Short's upright
      // design can be cut from their middle.
      wideThumbnailUrl: (t.maxres ?? t.medium)?.url,
    };
  });
}

// A Short's own thumbnail, as chosen in YouTube Studio. YouTube stores it
// widescreen with the upright design in the middle (the site crops to that);
// its upright oar2.jpg is a frame YouTube picks, not the chosen thumbnail.
export function shortThumbnail(videoId: string, wideUrl?: string): string {
  return wideUrl ?? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}
