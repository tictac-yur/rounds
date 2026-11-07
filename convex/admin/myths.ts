import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import schema from "../schema";
import { requireAdmin } from "../lib/access";


const fields = schema.tables.myths.validator.fields;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("myths").withIndex("by_order").take(200);
    return docs;
  },
});

export const create = mutation({
  args: fields,
  returns: v.id("myths"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("myths", args);
  },
});

export const update = mutation({
  args: { id: v.id("myths"), ...fields },
  returns: v.null(),
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("myths", id);
    if (existing === null) throw new ConvexError("Not found");
    await ctx.db.replace("myths", id, fields);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("myths") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("myths", id);
    if (existing === null) return null;
    await ctx.db.delete("myths", id);
    return null;
  },
});
