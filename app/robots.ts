import type { MetadataRoute } from "next";

// The public site can be found by search engines; the admin cannot.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] } };
}
