import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import schema from "../schema";
import { requireAdmin } from "../lib/access";


const fields = schema.tables.series.validator.fields;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("series").withIndex("by_order").take(200);
    return docs;
  },
});

export const create = mutation({
  args: fields,
  returns: v.id("series"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("series", args);
  },
});

export const update = mutation({
  args: { id: v.id("series"), ...fields },
  returns: v.null(),
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("series", id);
    if (existing === null) throw new ConvexError("Not found");
    await ctx.db.replace("series", id, fields);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("series") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("series", id);
    if (existing === null) return null;
    // Detach episodes that pointed at this record.
    for await (const episode of ctx.db
      .query("episodes")
      .withIndex("by_seriesId", (q) => q.eq("seriesId", id))) {
      await ctx.db.patch("episodes", episode._id, { seriesId: undefined });
    }
    await ctx.db.delete("series", id);
    return null;
  },
});
