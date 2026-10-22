import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import schema from "../schema";
import { requireAdmin } from "../lib/access";


const fields = schema.tables.sponsorPackages.validator.fields;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("sponsorPackages").withIndex("by_order").take(200);
    return docs;
  },
});

export const create = mutation({
  args: fields,
  returns: v.id("sponsorPackages"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("sponsorPackages", args);
  },
});

export const update = mutation({
  args: { id: v.id("sponsorPackages"), ...fields },
  returns: v.null(),
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("sponsorPackages", id);
    if (existing === null) throw new ConvexError("Not found");
    await ctx.db.replace("sponsorPackages", id, fields);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("sponsorPackages") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("sponsorPackages", id);
    if (existing === null) return null;
    await ctx.db.delete("sponsorPackages", id);
    return null;
  },
});
