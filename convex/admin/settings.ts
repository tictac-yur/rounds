import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import schema from "../schema";
import { requireAdmin } from "../lib/access";
import { releaseFile } from "../lib/files";
import { seedSettings } from "../seedData";

const fields = schema.tables.siteSettings.validator.fields;

export const get = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const doc = await ctx.db.query("siteSettings").first();
    const settings = doc ?? { ...seedSettings, heroImageId: undefined };
    return {
      ...settings,
      _id: doc?._id ?? null,
      imageUrl: settings.heroImageId ? await ctx.storage.getUrl(settings.heroImageId) : null,
    };
  },
});

export const save = mutation({
  args: fields,
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.query("siteSettings").first();
    if (existing === null) {
      await ctx.db.insert("siteSettings", args);
    } else {
      await releaseFile(ctx, existing.heroImageId, args.heroImageId);
      await ctx.db.replace("siteSettings", existing._id, args);
    }
    return null;
  },
});
