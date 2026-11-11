/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_audienceSegments from "../admin/audienceSegments.js";
import type * as admin_dashboard from "../admin/dashboard.js";
import type * as admin_episodes from "../admin/episodes.js";
import type * as admin_files from "../admin/files.js";
import type * as admin_guests from "../admin/guests.js";
import type * as admin_hosts from "../admin/hosts.js";
import type * as admin_myths from "../admin/myths.js";
import type * as admin_seed from "../admin/seed.js";
import type * as admin_series from "../admin/series.js";
import type * as admin_settings from "../admin/settings.js";
import type * as admin_sponsorPackages from "../admin/sponsorPackages.js";
import type * as admin_youtube from "../admin/youtube.js";
import type * as auth from "../auth.js";
import type * as channelContent from "../channelContent.js";
import type * as content from "../content.js";
import type * as contentTypes from "../contentTypes.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as lib_access from "../lib/access.js";
import type * as lib_files from "../lib/files.js";
import type * as lib_placeholder from "../lib/placeholder.js";
import type * as lib_starter from "../lib/starter.js";
import type * as lib_youtube from "../lib/youtube.js";
import type * as lib_youtubeAnalytics from "../lib/youtubeAnalytics.js";
import type * as seedData from "../seedData.js";
import type * as users from "../users.js";
import type * as youtube from "../youtube.js";
import type * as youtubeStats from "../youtubeStats.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/audienceSegments": typeof admin_audienceSegments;
  "admin/dashboard": typeof admin_dashboard;
  "admin/episodes": typeof admin_episodes;
  "admin/files": typeof admin_files;
  "admin/guests": typeof admin_guests;
  "admin/hosts": typeof admin_hosts;
  "admin/myths": typeof admin_myths;
  "admin/seed": typeof admin_seed;
  "admin/series": typeof admin_series;
  "admin/settings": typeof admin_settings;
  "admin/sponsorPackages": typeof admin_sponsorPackages;
  "admin/youtube": typeof admin_youtube;
  auth: typeof auth;
  channelContent: typeof channelContent;
  content: typeof content;
  contentTypes: typeof contentTypes;
  crons: typeof crons;
  http: typeof http;
  "lib/access": typeof lib_access;
  "lib/files": typeof lib_files;
  "lib/placeholder": typeof lib_placeholder;
  "lib/starter": typeof lib_starter;
  "lib/youtube": typeof lib_youtube;
  "lib/youtubeAnalytics": typeof lib_youtubeAnalytics;
  seedData: typeof seedData;
  users: typeof users;
  youtube: typeof youtube;
  youtubeStats: typeof youtubeStats;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
