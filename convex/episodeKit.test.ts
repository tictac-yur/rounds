/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";
import type { EpisodeKit } from "./lib/episodeKit";

const modules = import.meta.glob("./**/*.ts");

const kit: EpisodeKit = {
  guest: {
    name: "ผศ.พญ.ตัวอย่าง ทดสอบ",
    nameAlt: "Asst. Prof. Dr. Example Test",
    nameLang: "th",
    slug: "example-test",
    field: "ตจวิทยา",
    bio: "อาจารย์แพทย์ผิวหนัง",
  },
  specialty: "ผิวหนัง",
  flags: [
    { claim: "ทาครีมกันแดดเฉพาะวันที่แดดจัดก็พอ", answer: "ควรทาทุกวัน", verdict: "red" },
    { claim: "ล้างหน้าวันละสองครั้งเพียงพอ", answer: "เพียงพอสำหรับคนส่วนใหญ่", verdict: "green" },
  ],
};

async function setup() {
  const t = convexTest(schema, modules);
  const ids = await t.run(async (ctx) => {
    const admin = await ctx.db.insert("users", { email: "a@example.com", role: "admin" });
    const visitor = await ctx.db.insert("users", { email: "v@example.com" });
    const episodeId = await ctx.db.insert("episodes", {
      slug: "ep3",
      title: "คุยกับหมอผิวหนัง | The Consult EP.3",
      status: "published",
      featured: true,
      specialty: "",
      summary: "",
      thumbLabel: "",
      thumbVariant: 0,
      chapters: [{ seconds: 0, title: "Intro" }],
      order: -2,
    });
    return { admin, visitor, episodeId };
  });
  const asAdmin = t.withIdentity({ subject: `${ids.admin}|s1` });
  return { t, asAdmin, ...ids };
}

describe("episode kit", () => {
  test("adds the guest, links the episode and adds the flags, once", async () => {
    const { t, asAdmin, episodeId } = await setup();
    const first = await asAdmin.mutation(api.admin.episodeKit.apply, { episodeId, kit });
    expect(first).toEqual({ guest: "created", linked: true, flagsAdded: 2, flagsSkipped: 0 });
    const again = await asAdmin.mutation(api.admin.episodeKit.apply, { episodeId, kit });
    expect(again).toEqual({ guest: "unchanged", linked: true, flagsAdded: 0, flagsSkipped: 2 });

    const { guests, episode, myths } = await t.run(async (ctx) => ({
      guests: await ctx.db.query("guests").collect(),
      episode: await ctx.db.get("episodes", episodeId),
      myths: await ctx.db.query("myths").collect(),
    }));
    expect(guests).toHaveLength(1);
    expect(guests[0]).toMatchObject({ name: kit.guest.name, slug: "example-test", bio: "อาจารย์แพทย์ผิวหนัง" });
    expect(episode).toMatchObject({ guestId: guests[0]._id, specialty: "ผิวหนัง" });
    expect(myths.map((m) => [m.claim, m.verdict, m.episodeId, m.published])).toEqual([
      [kit.flags[0].claim, "red", episodeId, true],
      [kit.flags[1].claim, "green", episodeId, true],
    ]);

    const rows = await asAdmin.query(api.admin.episodeKit.checklist, {});
    expect(rows[0]).toMatchObject({ guest: kit.guest.name, guestBio: true, flags: 2, chapters: 1, photo: false });
  });

  test("keeps details already edited in the admin", async () => {
    const { t, asAdmin, episodeId } = await setup();
    await t.run((ctx) =>
      ctx.db.insert("guests", { name: kit.guest.name, nameLang: "th", field: "ผิวหนัง (แก้เอง)", bio: "เขียนเอง", order: 0 }),
    );
    const result = await asAdmin.mutation(api.admin.episodeKit.apply, { episodeId, kit });
    expect(result.guest).toBe("updated"); // only the blanks: nameAlt and slug
    const guest = await t.run(async (ctx) => (await ctx.db.query("guests").collect())[0]);
    expect(guest).toMatchObject({ field: "ผิวหนัง (แก้เอง)", bio: "เขียนเอง", nameAlt: kit.guest.nameAlt, slug: "example-test" });
  });

  test("only admins can apply a kit", async () => {
    const { t, visitor, episodeId } = await setup();
    await expect(t.mutation(api.admin.episodeKit.apply, { episodeId, kit })).rejects.toThrow();
    await expect(
      t.withIdentity({ subject: `${visitor}|s2` }).mutation(api.admin.episodeKit.apply, { episodeId, kit }),
    ).rejects.toThrow();
  });
});
