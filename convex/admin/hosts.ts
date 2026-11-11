import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import schema from "../schema";
import { requireAdmin } from "../lib/access";
import { releaseFile } from "../lib/files";

const fields = schema.tables.hosts.validator.fields;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function assertSlugAvailable(ctx: MutationCtx, slug: string | undefined, self?: Id<"hosts">) {
  if (slug === undefined) return;
  if (!SLUG_PATTERN.test(slug)) {
    throw new ConvexError("Page address must be lowercase English letters, numbers and dashes.");
  }
  const hosts = await ctx.db.query("hosts").withIndex("by_order").take(200);
  if (hosts.some((h) => h.slug === slug && h._id !== self)) {
    throw new ConvexError(`Another host already uses the address "${slug}".`);
  }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("hosts").withIndex("by_order").take(200);
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
  returns: v.id("hosts"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await assertSlugAvailable(ctx, args.slug);
    return await ctx.db.insert("hosts", args);
  },
});

export const update = mutation({
  args: { id: v.id("hosts"), ...fields },
  returns: v.null(),
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("hosts", id);
    if (existing === null) throw new ConvexError("Not found");
    await assertSlugAvailable(ctx, fields.slug, id);
    await releaseFile(ctx, existing.photoId, fields.photoId);
    await ctx.db.replace("hosts", id, fields);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("hosts") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("hosts", id);
    if (existing === null) return null;
    await releaseFile(ctx, existing.photoId);
    await ctx.db.delete("hosts", id);
    return null;
  },
});
