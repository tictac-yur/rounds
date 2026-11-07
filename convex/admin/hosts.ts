import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import schema from "../schema";
import { requireAdmin } from "../lib/access";
import { releaseFile } from "../lib/files";

const fields = schema.tables.hosts.validator.fields;

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
