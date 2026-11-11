import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const episodeStatus = v.union(
  v.literal("draft"),
  v.literal("coming_soon"),
  v.literal("published"),
);

export const textLang = v.union(v.literal("en"), v.literal("th"));

export const flagVerdict = v.union(v.literal("red"), v.literal("green"));

// Who watches, from YouTube Analytics: shares of viewers (0–100) over the
// last `days` days. Empty lists when YouTube withholds small numbers.
export const audienceData = v.object({
  days: v.number(),
  ageGroups: v.array(v.object({ group: v.string(), percent: v.number() })),
  genders: v.array(v.object({ gender: v.string(), percent: v.number() })),
  countries: v.array(v.object({ country: v.string(), percent: v.number() })),
});

export default defineSchema({
  ...authTables,

  // Overrides the Convex Auth users table to add an admin role.
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.literal("admin")),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  // Singleton: global copy, links and hero content.
  siteSettings: defineTable({
    heroKicker: v.string(),
    heroHeadline: v.string(),
    // Thai line under the (English) hero headline.
    heroHeadlineTh: v.optional(v.string()),
    // No longer shown on the site; kept optional for existing data.
    heroIntro: v.optional(v.string()),
    heroIntroTh: v.string(),
    heroImageId: v.optional(v.id("_storage")),
    heroImageCaption: v.optional(v.string()),
    stats: v.array(v.object({ value: v.string(), label: v.string() })),
    audienceIntro: v.string(),
    platformHandles: v.optional(v.array(v.string())),
    contactEmail: v.string(),
    mediaKitUrl: v.string(),
    youtubeUrl: v.string(),
    spotifyUrl: v.string(),
    appleUrl: v.string(),
    instagramUrl: v.string(),
    tiktokUrl: v.string(),
    linktreeUrl: v.string(),
  }),

  series: defineTable({
    name: v.string(),
    kicker: v.string(),
    description: v.string(),
    accentColor: v.optional(v.string()),
    order: v.number(),
  }).index("by_order", ["order"]),

  // Guest doctors. A guest with a slug gets a profile page at /doctors/<slug>.
  guests: defineTable({
    name: v.string(),
    nameLang: textLang,
    // The name in the other language, e.g. the Thai name of an English-named guest.
    nameAlt: v.optional(v.string()),
    slug: v.optional(v.string()),
    field: v.string(),
    affiliation: v.optional(v.string()),
    bio: v.optional(v.string()),
    profileUrl: v.optional(v.string()),
    photoId: v.optional(v.id("_storage")),
    order: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_slug", ["slug"]),

  episodes: defineTable({
    slug: v.string(),
    title: v.string(),
    status: episodeStatus,
    featured: v.boolean(),
    seriesId: v.optional(v.id("series")),
    guestId: v.optional(v.id("guests")),
    specialty: v.string(),
    summary: v.string(),
    thumbLabel: v.string(),
    thumbVariant: v.number(),
    // Photo of Titi, Pup and the guest doctor.
    thumbnailId: v.optional(v.id("_storage")),
    photoCaption: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    runtime: v.optional(v.string()),
    metaNote: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    spotifyUrl: v.optional(v.string()),
    appleUrl: v.optional(v.string()),
    // Set from youtubeUrl; used to match uploads found by the YouTube sync.
    youtubeVideoId: v.optional(v.string()),
    // Best YouTube thumbnail found by the sync, used when no photo is uploaded.
    youtubeThumbnailUrl: v.optional(v.string()),
    // Chapters from the video's YouTube description (the sync fills them in).
    chapters: v.optional(v.array(v.object({ seconds: v.number(), title: v.string() }))),
    order: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_slug", ["slug"])
    .index("by_youtubeVideoId", ["youtubeVideoId"])
    .index("by_status_and_order", ["status", "order"])
    .index("by_seriesId", ["seriesId"])
    .index("by_guestId", ["guestId"]),

  // Red flag / Green flag: a belief, and the guest doctor's verdict on it.
  myths: defineTable({
    claim: v.string(),
    answer: v.string(),
    verdict: v.optional(flagVerdict),
    episodeId: v.optional(v.id("episodes")),
    published: v.boolean(),
    order: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_published_and_order", ["published", "order"])
    .index("by_episodeId", ["episodeId"]),

  audienceSegments: defineTable({
    stat: v.string(),
    title: v.string(),
    description: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  sponsorPackages: defineTable({
    letter: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  // Singleton: state of the hourly YouTube sync (convex/youtube.ts).
  youtubeSync: defineTable({
    channelId: v.optional(v.string()),
    // The channel link the id was looked up from, so a new link is looked up again.
    channelUrl: v.optional(v.string()),
    lastCheckedAt: v.optional(v.number()),
    lastAddedCount: v.number(),
    lastError: v.optional(v.string()),
    // Version of the one-time switch to the channel's real content
    // (convex/channelContent.ts) applied to this database.
    contentVersion: v.optional(v.number()),
    // Version of the one-time additions in convex/contentUpdates.ts.
    contentUpdates: v.optional(v.number()),
  }),

  // Singleton: the channel's numbers, refreshed hourly (convex/youtubeStats.ts).
  channelStats: defineTable({
    subscribers: v.optional(v.number()),
    views: v.optional(v.number()),
    videos: v.optional(v.number()),
    statsUpdatedAt: v.optional(v.number()),
    statsError: v.optional(v.string()),
    audience: v.optional(audienceData),
    audienceUpdatedAt: v.optional(v.number()),
    audienceError: v.optional(v.string()),
    // The channel's most-watched Shorts, newest sync first (convex/youtube.ts).
    topShorts: v.optional(v.array(v.object({ videoId: v.string(), title: v.string(), thumbnailUrl: v.string() }))),
  }),

  // Singleton, never returned to clients: the channel owner's permission to
  // read YouTube Analytics, from "Connect YouTube" in the admin.
  youtubeAuth: defineTable({
    refreshToken: v.string(),
    connectedAt: v.number(),
    connectedBy: v.id("users"),
  }),

  // One-time values tying a Google sign-in back to the admin who started it.
  youtubeOAuthStates: defineTable({
    state: v.string(),
    userId: v.id("users"),
    expiresAt: v.number(),
  }).index("by_state", ["state"]),

  hosts: defineTable({
    name: v.string(),
    role: v.string(),
    // URL of their page, e.g. "titi" for /hosts/titi.
    slug: v.optional(v.string()),
    bio: v.optional(v.string()),
    photoId: v.optional(v.id("_storage")),
    order: v.number(),
  }).index("by_order", ["order"]),
});
