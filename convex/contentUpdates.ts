import { v } from "convex/values";
import { internalMutation, MutationCtx } from "./_generated/server";
import {
  ep1TranscriptFlags,
  previousSponsorPackages,
  seedEpisodes,
  seedGuests,
  seedHosts,
  seedSponsorPackages,
  episodeKitsByVideoId,
} from "./seedData";
import { applyEpisodeKit } from "./lib/episodeKit";

// One-time additions to a live database, run at the start of the YouTube sync
// (like convex/channelContent.ts). Each only fills what's missing, so nothing
// edited in the admin is overwritten. Add a step and bump UPDATES_VERSION.
export const UPDATES_VERSION = 6;

export const apply = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const state = await ctx.db.query("youtubeSync").first();
    const done = state?.contentUpdates ?? 0;
    if (state === null || done >= UPDATES_VERSION) return null;

    if (done < 1) await addKanContent(ctx);
    if (done < 2) await addHostSlugs(ctx);
    if (done < 3) await addHostNames(ctx);
    if (done < 4) await replaceStarterPackages(ctx);
    if (done < 5) await addSombat(ctx);
    if (done < 6) await applyKnownKits(ctx);

    await ctx.db.patch("youtubeSync", state._id, {
      contentUpdates: UPDATES_VERSION,
    });
    return null;
  },
});

// Version 1. อ.กานต์: English name and bio from the EP.1 transcript, if
// still blank, and his Red/Green flags from the transcript not already there.
async function addKanContent(ctx: MutationCtx) {
  const seedGuest = seedGuests[0];
  const guests = await ctx.db.query("guests").withIndex("by_order").take(200);
  const guest = guests.find((g) => g.name.trim() === seedGuest.name);
  if (guest) {
    await ctx.db.patch("guests", guest._id, {
      ...(guest.nameAlt ? {} : { nameAlt: seedGuest.nameAlt }),
      ...(guest.bio ? {} : { bio: seedGuest.bio }),
    });
  }

  const ep1 = seedEpisodes[0];
  const episode = await ctx.db
    .query("episodes")
    .withIndex("by_youtubeVideoId", (q) => q.eq("youtubeVideoId", ep1.youtubeVideoId))
    .first();
  if (episode) {
    const myths = await ctx.db.query("myths").withIndex("by_order").take(500);
    const claims = new Set(myths.map((m) => m.claim.trim()));
    let order = Math.max(-1, ...myths.map((m) => m.order)) + 1;
    for (const { claim, answer, verdict } of ep1TranscriptFlags) {
      if (claims.has(claim)) continue;
      await ctx.db.insert("myths", {
        claim,
        answer,
        verdict,
        episodeId: episode._id,
        published: true,
        order: order++,
      });
    }
  }
}

// Version 2. Page addresses for the hosts (/hosts/titi, /hosts/pup), if not set.
async function addHostSlugs(ctx: MutationCtx) {
  const hosts = await ctx.db.query("hosts").withIndex("by_order").take(50);
  for (const seedHost of seedHosts) {
    const host = hosts.find((h) => h.name.trim() === seedHost.name);
    if (host && !host.slug) await ctx.db.patch("hosts", host._id, { slug: seedHost.slug });
  }
}

// Version 3. The hosts' real names, if not set.
async function addHostNames(ctx: MutationCtx) {
  const hosts = await ctx.db.query("hosts").withIndex("by_order").take(50);
  for (const seedHost of seedHosts) {
    const host = hosts.find((h) => h.name.trim() === seedHost.name);
    if (host && !host.fullName) {
      await ctx.db.patch("hosts", host._id, { fullName: seedHost.fullName, fullNameAlt: seedHost.fullNameAlt });
    }
  }
}

// Version 4. The three detailed sponsor packages, but only in place of the
// original two starter ones, untouched. Anything edited in the admin stays.
async function replaceStarterPackages(ctx: MutationCtx) {
  const packages = await ctx.db.query("sponsorPackages").withIndex("by_order").take(50);
  const untouched =
    packages.length === previousSponsorPackages.length &&
    packages.every(
      (p, i) => p.title === previousSponsorPackages[i].title && p.description === previousSponsorPackages[i].description,
    );
  if (!untouched) return;
  for (const p of packages) await ctx.db.delete("sponsorPackages", p._id);
  for (const [order, pkg] of seedSponsorPackages.entries()) {
    await ctx.db.insert("sponsorPackages", { ...pkg, order });
  }
}

// Version 5. ศ.นพ.สมบัติ (The Consult EP.2), if not there yet.
async function addSombat(ctx: MutationCtx) {
  const seed = seedGuests[1];
  const guests = await ctx.db.query("guests").withIndex("by_order").take(200);
  if (!guests.some((g) => g.name.trim() === seed.name)) {
    const order = Math.max(-1, ...guests.map((g) => g.order)) + 1;
    await ctx.db.insert("guests", { ...seed, order });
  }
}

// Version 6. Episodes already imported get their kit: guest, specialty and
// Red/Green flags (EP.2). Episodes not imported yet get it on import.
async function applyKnownKits(ctx: MutationCtx) {
  for (const [videoId, kit] of Object.entries(episodeKitsByVideoId)) {
    const episode = await ctx.db
      .query("episodes")
      .withIndex("by_youtubeVideoId", (q) => q.eq("youtubeVideoId", videoId))
      .first();
    if (episode) await applyEpisodeKit(ctx, episode, kit);
  }
}
