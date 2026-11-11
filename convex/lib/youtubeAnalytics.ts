// Helpers for the YouTube Data and Analytics APIs (convex/youtubeStats.ts).

export const ANALYTICS_SCOPE = "https://www.googleapis.com/auth/yt-analytics.readonly";
export const CALLBACK_PATH = "/youtube/oauth/callback";
export const AUDIENCE_DAYS = 90;

export function googleAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: ANALYTICS_SCOPE,
    // offline + consent: Google returns a refresh token, so the site can keep
    // reading the numbers after this one sign-in.
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// YYYY-MM-DD in UTC, `daysAgo` days before `now`.
export function isoDate(now: number, daysAgo = 0): string {
  return new Date(now - daysAgo * 86_400_000).toISOString().slice(0, 10);
}

type Row = (string | number)[];

const round1 = (n: number) => Math.round(n * 10) / 10;

// Rows of [ageGroup, gender, viewerPercentage] → totals per age group and per gender.
export function splitAgeGender(rows: Row[]) {
  const ages = new Map<string, number>();
  const genders = new Map<string, number>();
  for (const [age, gender, pct] of rows) {
    ages.set(String(age), (ages.get(String(age)) ?? 0) + Number(pct));
    genders.set(String(gender), (genders.get(String(gender)) ?? 0) + Number(pct));
  }
  return {
    // YouTube's own order: age13-17, age18-24, …
    ageGroups: [...ages]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([group, percent]) => ({ group: group.replace(/^age/, ""), percent: round1(percent) })),
    genders: [...genders]
      .sort(([, a], [, b]) => b - a)
      .map(([gender, percent]) => ({ gender, percent: round1(percent) })),
  };
}

// Rows of [countryCode, views], the channel's total views → top countries' shares.
export function countryShares(rows: Row[], totalViews: number, limit = 5) {
  if (totalViews <= 0) return [];
  return rows
    .slice(0, limit)
    .map(([country, views]) => ({ country: String(country), percent: round1((Number(views) / totalViews) * 100) }));
}

export function parseCount(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
