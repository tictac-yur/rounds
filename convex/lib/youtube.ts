// Helpers for reading the channel's public YouTube feed. No API key needed:
// https://www.youtube.com/feeds/videos.xml?channel_id=UC… lists the latest
// 15 uploads (videos and Shorts).

export type FeedVideo = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  isShort: boolean;
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
