import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

// Deletes a stored file that a document no longer references.
export async function releaseFile(
  ctx: MutationCtx,
  previous: Id<"_storage"> | undefined,
  next?: Id<"_storage">,
) {
  if (previous !== undefined && previous !== next) {
    await ctx.storage.delete(previous);
  }
}
