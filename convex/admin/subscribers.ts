import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../lib/access";

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.query("subscribers").order("desc").paginate(args.paginationOpts);
  },
});

export const remove = mutation({
  args: { id: v.id("subscribers") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    if ((await ctx.db.get("subscribers", id)) !== null) {
      await ctx.db.delete("subscribers", id);
    }
    return null;
  },
});
