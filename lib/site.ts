import { filled } from "./placeholders";

// The public address of the site. Vercel sets the production one.
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

// The built-in media kit, unless another link is set in the admin.
export function mediaKitHref(mediaKitUrl: string): string {
  return filled(mediaKitUrl) ?? "/media-kit";
}
