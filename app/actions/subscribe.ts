"use server";

import { fetchMutation } from "convex/nextjs";
import { ConvexError } from "convex/values";
import { api } from "@/convex/_generated/api";

export type SubscribeState = { status: "idle" | "success" | "error"; message: string };

export async function subscribe(
  _previous: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return { status: "error", message: "Sign-ups aren't open yet." };
  }
  try {
    await fetchMutation(api.content.subscribe, { email: String(formData.get("email") ?? "") });
    return { status: "success", message: "You're on the list. See you next episode." };
  } catch (error) {
    const message =
      error instanceof ConvexError ? String(error.data) : "Something went wrong. Please try again.";
    return { status: "error", message };
  }
}
