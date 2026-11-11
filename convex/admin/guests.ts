import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import schema from "../schema";
import { requireAdmin } from "../lib/access";
import { releaseFile } from "../lib/files";

const fields = schema.tables.guests.validator.fields;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function assertSlugAvailable(ctx: MutationCtx, slug: string | undefined, self?: Id<"guests">) {
  if (slug === undefined) return;
  if (!SLUG_PATTERN.test(slug)) {
    throw new ConvexError("Profile address must be lowercase English letters, numbers and dashes.");
  }
  const clash = await ctx.db
    .query("guests")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first();
  if (clash !== null && clash._id !== self) {
    throw new ConvexError(`Another guest already uses the address "${slug}".`);
  }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("guests").withIndex("by_order").take(200);
    return await Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        imageUrl: doc.photoId ? await ctx.storage.getUrl(doc.photoId) : null,
      })),
    );
  },
});

export const create = mutation({
  args: fields,
  returns: v.id("guests"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await assertSlugAvailable(ctx, args.slug);
    return await ctx.db.insert("guests", args);
  },
});

export const update = mutation({
  args: { id: v.id("guests"), ...fields },
  returns: v.null(),
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("guests", id);
    if (existing === null) throw new ConvexError("Not found");
    await assertSlugAvailable(ctx, fields.slug, id);
    await releaseFile(ctx, existing.photoId, fields.photoId);
    await ctx.db.replace("guests", id, fields);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("guests") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("guests", id);
    if (existing === null) return null;
    await releaseFile(ctx, existing.photoId);
    // Detach episodes that pointed at this record.
    for await (const episode of ctx.db
      .query("episodes")
      .withIndex("by_guestId", (q) => q.eq("guestId", id))) {
      await ctx.db.patch("episodes", episode._id, { guestId: undefined });
    }
    await ctx.db.delete("guests", id);
    return null;
  },
});
