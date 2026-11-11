/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import schema from "./schema";
import { internal } from "./_generated/api";
import { ep1TranscriptFlags, seedGuests } from "./seedData";

const modules = import.meta.glob("./**/*.ts");

// A live database as it was before: EP.1, อ.กานต์ without bio or English
// name, and the two original flags.
async function liveDatabase(guestFields: { bio?: string; nameAlt?: string } = {}) {
  const t = convexTest(schema, modules);
  await t.run(async (ctx) => {
    await ctx.db.insert("youtubeSync", { lastAddedCount: 0, contentVersion: 1 });
    const guestId = await ctx.db.insert("guests", {
      name: "ผศ.นพ.กานต์ วิฑูรชาติ",
      nameLang: "th",
      field: "อายุรศาสตร์โรคหัวใจ",
      order: 0,
      ...guestFields,
    });
    const episodeId = await ctx.db.insert("episodes", {
      slug: "cardiology",
      title: "คุยกับหมอหัวใจ",
      status: "published",
      featured: true,
      guestId,
      specialty: "โรคหัวใจ",
      summary: "",
      thumbLabel: "",
      thumbVariant: 0,
      youtubeVideoId: "o4kY44zLgig",
      order: 0,
    });
    for (const [order, claim] of ["กินไข่วันละ 1–2 ฟอง ทำให้ไขมันอุดตันเส้นเลือด", "อกหักจนหัวใจพังได้จริง"].entries()) {
      await ctx.db.insert("myths", { claim, answer: "…", verdict: "red", episodeId, published: true, order });
    }
  });
  return t;
}

describe("one-time content updates", () => {
  test("adds อ.กานต์'s English name, bio and the five transcript flags, once", async () => {
    const t = await liveDatabase();
    await t.mutation(internal.contentUpdates.apply, {});
    await t.mutation(internal.contentUpdates.apply, {});
    const { guest, myths } = await t.run(async (ctx) => ({
      guest: await ctx.db.query("guests").first(),
      myths: await ctx.db.query("myths").withIndex("by_order").collect(),
    }));
    expect(guest?.nameAlt).toBe("Asst. Prof. Dr. Kan Witoonchart");
    expect(guest?.bio).toBe(seedGuests[0].bio);
    expect(myths).toHaveLength(2 + ep1TranscriptFlags.length);
    expect(myths.slice(2).map((m) => m.claim)).toEqual(ep1TranscriptFlags.map((f) => f.claim));
    expect(myths.every((m) => m.published && m.episodeId === myths[0].episodeId)).toBe(true);
  });

  test("keeps what was already written in the admin", async () => {
    const t = await liveDatabase({ bio: "Written by hand", nameAlt: "Dr. Kan" });
    await t.run(async (ctx) => {
      const episode = await ctx.db.query("episodes").first();
      await ctx.db.insert("myths", {
        claim: ep1TranscriptFlags[0].claim,
        answer: "Edited answer",
        verdict: "red",
        episodeId: episode!._id,
        published: false,
        order: 5,
      });
    });
    await t.mutation(internal.contentUpdates.apply, {});
    const { guest, myths } = await t.run(async (ctx) => ({
      guest: await ctx.db.query("guests").first(),
      myths: await ctx.db.query("myths").collect(),
    }));
    expect(guest).toMatchObject({ bio: "Written by hand", nameAlt: "Dr. Kan" });
    expect(myths.filter((m) => m.claim === ep1TranscriptFlags[0].claim)).toHaveLength(1);
    expect(myths).toHaveLength(3 + ep1TranscriptFlags.length - 1);
  });

  test("gives the hosts page addresses, without redoing version 1", async () => {
    const t = await liveDatabase();
    await t.run(async (ctx) => {
      const state = await ctx.db.query("youtubeSync").first();
      await ctx.db.patch("youtubeSync", state!._id, { contentUpdates: 1 });
      await ctx.db.insert("hosts", { name: "ตีตี้", role: "พิธีกร", order: 0 });
      await ctx.db.insert("hosts", { name: "ปั๊บ", role: "พิธีกร", slug: "pup-custom", order: 1 });
    });
    await t.mutation(internal.contentUpdates.apply, {});
    const { hosts, myths } = await t.run(async (ctx) => ({
      hosts: await ctx.db.query("hosts").withIndex("by_order").collect(),
      myths: await ctx.db.query("myths").collect(),
    }));
    expect(hosts.map((h) => h.slug)).toEqual(["titi", "pup-custom"]);
    // A flag deleted after version 1 isn't brought back.
    expect(myths).toHaveLength(2);
  });
});
