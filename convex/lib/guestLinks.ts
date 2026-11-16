import type { MutationCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";
import { guestsByVideoId } from "../seedData";

// Puts the right guest (and specialty) on an episode the sync imported, if the
// episode has neither yet. Anything set in the admin is left alone.
export async function linkKnownGuest(ctx: MutationCtx, episode: Doc<"episodes">) {
  const link = episode.youtubeVideoId ? guestsByVideoId[episode.youtubeVideoId] : undefined;
  if (!link || episode.guestId) return;
  const guests = await ctx.db.query("guests").withIndex("by_order").take(200);
  const guest = guests.find((g) => g.name.trim() === link.guest);
  if (!guest) return;
  await ctx.db.patch("episodes", episode._id, {
    guestId: guest._id,
    ...(episode.specialty ? {} : { specialty: link.specialty }),
  });
}
