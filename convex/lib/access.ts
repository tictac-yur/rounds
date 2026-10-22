import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "../_generated/server";

export async function getAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) return null;
  const user = await ctx.db.get(userId);
  if (user === null || user.role !== "admin") return null;
  return user;
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const admin = await getAdmin(ctx);
  if (admin === null) {
    throw new ConvexError("Not authorized");
  }
  return admin;
}
