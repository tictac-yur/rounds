import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";
import { CALLBACK_PATH } from "./lib/youtubeAnalytics";
import { callbackUrl } from "./youtubeStats";

const http = httpRouter();

auth.addHttpRoutes(http);

// Google sends the channel owner back here after "Connect YouTube".
http.route({
  path: CALLBACK_PATH,
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const back = (result: string) =>
      Response.redirect(`${process.env.SITE_URL ?? ""}/admin?youtube=${result}`, 302);

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code || !state) return back("cancelled");
    const userId = await ctx.runMutation(internal.youtubeStats.consumeState, { state });
    if (userId === null) return back("expired");

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: callbackUrl(),
        grant_type: "authorization_code",
      }),
    });
    if (!res.ok) return back("failed");
    const token = (await res.json()) as { refresh_token?: string };
    if (!token.refresh_token) return back("failed");
    await ctx.runMutation(internal.youtubeStats.storeGrant, { refreshToken: token.refresh_token, userId });
    return back("connected");
  }),
});

export default http;
