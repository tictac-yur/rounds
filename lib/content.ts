import "server-only";
import { cacheLife } from "next/cache";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { HomeContent } from "@/convex/contentTypes";
import { seedHomeContent } from "./seedContent";

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  // Edits made in the admin portal show up on the site within a minute.
  cacheLife("minutes");
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return seedHomeContent();
  }
  try {
    return await fetchQuery(api.content.home, {});
  } catch (error) {
    console.error("Failed to load site content from Convex; using starter content.", error);
    return seedHomeContent();
  }
}
