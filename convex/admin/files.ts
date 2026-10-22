import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireAdmin } from "../lib/access";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
