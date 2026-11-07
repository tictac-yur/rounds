import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import schema from "../schema";
import { requireAdmin } from "../lib/access";
import { releaseFile } from "../lib/files";

const fields = schema.tables.episodes.validator.fields;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function assertSlugAvailable(ctx: MutationCtx, slug: string, self?: Id<"episodes">) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new ConvexError("Slug must be lowercase letters, numbers and dashes.");
  }
  const clash = await ctx.db
    .query("episodes")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first();
  if (clash !== null && clash._id !== self) {
    throw new ConvexError(`Another episode already uses the slug "${slug}".`);
  }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("episodes").withIndex("by_order").take(200);
    return await Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        imageUrl: doc.thumbnailId ? await ctx.storage.getUrl(doc.thumbnailId) : null,
      })),
    );
  },
});

export const create = mutation({
  args: fields,
  returns: v.id("episodes"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await assertSlugAvailable(ctx, args.slug);
    return await ctx.db.insert("episodes", args);
  },
});

export const update = mutation({
  args: { id: v.id("episodes"), ...fields },
  returns: v.null(),
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("episodes", id);
    if (existing === null) throw new ConvexError("Not found");
    await assertSlugAvailable(ctx, fields.slug, id);
    await releaseFile(ctx, existing.thumbnailId, fields.thumbnailId);
    await ctx.db.replace("episodes", id, fields);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("episodes") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("episodes", id);
    if (existing === null) return null;
    await releaseFile(ctx, existing.thumbnailId);
    for await (const myth of ctx.db
      .query("myths")
      .withIndex("by_episodeId", (q) => q.eq("episodeId", id))) {
      await ctx.db.patch("myths", myth._id, { episodeId: undefined });
    }
    await ctx.db.delete("episodes", id);
    return null;
  },
});
