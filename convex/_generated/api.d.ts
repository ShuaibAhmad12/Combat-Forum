/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as clerk from "../clerk.js";
import type * as ConvexClientProvider from "../ConvexClientProvider.js";
import type * as notifications from "../notifications.js";
import type * as replies from "../replies.js";
import type * as seed from "../seed.js";
import type * as threads from "../threads.js";
import type * as topics from "../topics.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  clerk: typeof clerk;
  ConvexClientProvider: typeof ConvexClientProvider;
  notifications: typeof notifications;
  replies: typeof replies;
  seed: typeof seed;
  threads: typeof threads;
  topics: typeof topics;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
