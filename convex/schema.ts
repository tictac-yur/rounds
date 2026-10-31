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
    heroIntro: v.string(),
    heroIntroTh: v.string(),
    heroImageId: v.optional(v.id("_storage")),
    heroImageCaption: v.string(),
    stats: v.array(v.object({ value: v.string(), label: v.string() })),
    audienceIntro: v.string(),
    platformHandles: v.array(v.string()),
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
    accentColor: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  guests: defineTable({
    name: v.string(),
    nameLang: textLang,
    field: v.string(),
    affiliation: v.optional(v.string()),
    photoId: v.optional(v.id("_storage")),
    order: v.number(),
  }).index("by_order", ["order"]),

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
    // Polaroid photo of Titi, Pup and the guest doctor.
    thumbnailId: v.optional(v.id("_storage")),
    photoCaption: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    runtime: v.optional(v.string()),
    metaNote: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    spotifyUrl: v.optional(v.string()),
    appleUrl: v.optional(v.string()),
    order: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_slug", ["slug"])
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
    letter: v.string(),
    title: v.string(),
    description: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  hosts: defineTable({
    name: v.string(),
    role: v.string(),
    photoId: v.optional(v.id("_storage")),
    order: v.number(),
  }).index("by_order", ["order"]),
});
