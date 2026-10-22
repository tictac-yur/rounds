import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import schema from "../schema";
import { requireAdmin } from "../lib/access";


const fields = schema.tables.audienceSegments.validator.fields;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("audienceSegments").withIndex("by_order").take(200);
    return docs;
  },
});

export const create = mutation({
  args: fields,
  returns: v.id("audienceSegments"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("audienceSegments", args);
  },
});

export const update = mutation({
  args: { id: v.id("audienceSegments"), ...fields },
  returns: v.null(),
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("audienceSegments", id);
    if (existing === null) throw new ConvexError("Not found");
    await ctx.db.replace("audienceSegments", id, fields);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("audienceSegments") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("audienceSegments", id);
    if (existing === null) return null;
    await ctx.db.delete("audienceSegments", id);
    return null;
  },
});
