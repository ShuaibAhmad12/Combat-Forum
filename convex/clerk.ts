import { v } from "convex/values";
import { action } from "./_generated/server";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { api } from "./_generated/api";

export const processClerkWebhook = action({
  args: {
    payload: v.any(),
    headers: v.any(),
  },
  handler: async (ctx, args) => {
    const { payload } = args;
    const eventType = payload.type;
    const data = payload.data;

    if (eventType === "user.created") {
      // Create a new user profile when a user signs up with Clerk
      const userId = data.id;
      const username = data.username || 
        `${data.first_name || ""}${data.last_name || ""}` || 
        "User" + Math.floor(Math.random() * 10000);
      
      await ctx.runMutation(api.users.createProfile, {
        userId,
        username,
        bio: "",
      });
    } else if (eventType === "user.updated") {
      // Update user profile when user data changes in Clerk
      const userId = data.id;
      const username = data.username || 
        `${data.first_name || ""}${data.last_name || ""}` || 
        "User" + Math.floor(Math.random() * 10000);
      
      await ctx.runMutation(api.users.updateProfile, {
        userId,
        username,
      });
    } else if (eventType === "user.deleted") {
      // Handle user deletion (optional)
      // You might want to anonymize their content rather than delete it
      console.log("User deleted:", data.id);
    }

    return { success: true };
  },
});