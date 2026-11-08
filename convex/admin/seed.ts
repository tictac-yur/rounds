import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../lib/access";
import { insertStarterContent } from "../lib/starter";

export const status = query({
  args: {},
  returns: v.object({ isEmpty: v.boolean() }),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [settings, episode] = await Promise.all([
      ctx.db.query("siteSettings").first(),
      ctx.db.query("episodes").first(),
    ]);
    return { isEmpty: settings === null && episode === null };
  },
});

// Loads the original landing-page copy into an empty database.
export const loadStarterContent = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [settings, episode] = await Promise.all([
      ctx.db.query("siteSettings").first(),
      ctx.db.query("episodes").first(),
    ]);
    if (settings !== null || episode !== null) {
      throw new ConvexError("Starter content can only be loaded into an empty site.");
    }

    await insertStarterContent(ctx);
    return null;
  },
});
