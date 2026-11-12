import { describe, expect, test } from "vitest";
import nextConfig from "../next.config";

describe("security headers", () => {
  test("every page is sent with them", async () => {
    const rules = await nextConfig.headers!();
    expect(rules).toHaveLength(1);
    expect(rules[0].source).toBe("/(.*)");
    const headers = Object.fromEntries(rules[0].headers.map((h) => [h.key, h.value]));
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Content-Security-Policy"]).toBe("frame-ancestors 'none'");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("geolocation=()");
  });
});
