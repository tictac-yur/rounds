import { v, type Infer } from "convex/values";
import type { MutationCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

// Everything an episode needs beyond what the YouTube sync brings in: its
// guest doctor, its specialty, and the Red/Green flags from the conversation.
// Claude drafts one from the transcript (see .claude/skills/rounds-new-episode)
// and it is pasted into Admin → Episode kit.
export const episodeKitValidator = v.object({
  guest: v.object({
    name: v.string(),
    nameAlt: v.optional(v.string()),
    nameLang: v.union(v.literal("th"), v.literal("en")),
    slug: v.optional(v.string()),
    field: v.string(),
    affiliation: v.optional(v.string()),
    bio: v.optional(v.string()),
  }),
  specialty: v.optional(v.string()),
  flags: v.array(
    v.object({
      claim: v.string(),
      answer: v.string(),
      verdict: v.union(v.literal("red"), v.literal("green")),
    }),
  ),
});
export type EpisodeKit = Infer<typeof episodeKitValidator>;

export const kitResultValidator = v.object({
  guest: v.union(v.literal("created"), v.literal("updated"), v.literal("unchanged")),
  linked: v.boolean(),
  flagsAdded: v.number(),
  flagsSkipped: v.number(),
});
export type KitResult = Infer<typeof kitResultValidator>;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const blank = (s: string | undefined) => !s || !s.trim();

// Applies a kit to one episode. Only fills what's empty: a guest's details,
// the episode's guest and specialty, and flags whose claim isn't there yet,
// so applying the same kit twice, or after edits in the admin, changes nothing.
// `replaceGuest` lets an explicit admin action swap the episode's guest.
export async function applyEpisodeKit(
  ctx: MutationCtx,
  episode: Doc<"episodes">,
  kit: EpisodeKit,
  { replaceGuest = false }: { replaceGuest?: boolean } = {},
): Promise<KitResult> {
  const name = kit.guest.name.trim();
  if (!name) throw new Error("The kit's guest needs a name.");

  // The guest: matched by name, created if new, blanks filled if not.
  const guests = await ctx.db.query("guests").withIndex("by_order").take(500);
  const slugFree = (slug: string | undefined, self?: Id<"guests">) =>
    slug && SLUG_PATTERN.test(slug) && !guests.some((g) => g.slug === slug && g._id !== self) ? slug : undefined;
  let guest = guests.find((g) => g.name.trim() === name);
  let guestResult: KitResult["guest"] = "unchanged";
  if (!guest) {
    const id = await ctx.db.insert("guests", {
      name,
      nameLang: kit.guest.nameLang,
      field: kit.guest.field,
      ...(kit.guest.nameAlt ? { nameAlt: kit.guest.nameAlt } : {}),
      ...(slugFree(kit.guest.slug) ? { slug: kit.guest.slug } : {}),
      ...(kit.guest.affiliation ? { affiliation: kit.guest.affiliation } : {}),
      ...(kit.guest.bio ? { bio: kit.guest.bio } : {}),
      order: Math.max(-1, ...guests.map((g) => g.order)) + 1,
    });
    guest = (await ctx.db.get("guests", id))!;
    guestResult = "created";
  } else {
    const fill: Partial<Doc<"guests">> = {};
    if (blank(guest.nameAlt) && kit.guest.nameAlt) fill.nameAlt = kit.guest.nameAlt;
    if (blank(guest.field) && kit.guest.field) fill.field = kit.guest.field;
    if (blank(guest.affiliation) && kit.guest.affiliation) fill.affiliation = kit.guest.affiliation;
    if (blank(guest.bio) && kit.guest.bio) fill.bio = kit.guest.bio;
    if (blank(guest.slug) && slugFree(kit.guest.slug, guest._id)) fill.slug = kit.guest.slug;
    if (Object.keys(fill).length > 0) {
      await ctx.db.patch("guests", guest._id, fill);
      guestResult = "updated";
    }
  }

  // The episode: its guest and specialty.
  const episodePatch: Partial<Doc<"episodes">> = {};
  if (!episode.guestId || (replaceGuest && episode.guestId !== guest._id)) episodePatch.guestId = guest._id;
  if (blank(episode.specialty) && kit.specialty) episodePatch.specialty = kit.specialty;
  if (Object.keys(episodePatch).length > 0) await ctx.db.patch("episodes", episode._id, episodePatch);
  const linked = (episodePatch.guestId ?? episode.guestId) === guest._id;

  // The flags: added after the existing ones, skipping claims already there.
  const myths = await ctx.db.query("myths").withIndex("by_order").take(1000);
  const claims = new Set(myths.map((m) => m.claim.trim()));
  let order = Math.max(-1, ...myths.map((m) => m.order)) + 1;
  let flagsAdded = 0;
  for (const flag of kit.flags) {
    const claim = flag.claim.trim();
    if (!claim || claims.has(claim)) continue;
    await ctx.db.insert("myths", {
      claim,
      answer: flag.answer.trim(),
      verdict: flag.verdict,
      episodeId: episode._id,
      published: true,
      order: order++,
    });
    claims.add(claim);
    flagsAdded += 1;
  }

  return { guest: guestResult, linked, flagsAdded, flagsSkipped: kit.flags.length - flagsAdded };
}
