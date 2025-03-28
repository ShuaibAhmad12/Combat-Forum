import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { api } from "./_generated/api"; // Import the generated API

export const getUser = query({
  args: { userId: v.string() },
  async handler(ctx, args) {
    // Check if user exists in our userProfiles table
    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    
    if (profiles.length > 0) {
      return profiles[0];
    }
    
    return null;
  },
});

export const createUser = mutation({
  args: { userId: v.string(), username: v.string() },
  async handler(ctx, args) {
    // Check if user already exists
    const existingProfiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    
    if (existingProfiles.length > 0) {
      return existingProfiles[0]._id;
    }

    // Create new user profile
    return await ctx.db.insert("userProfiles", {
      userId: args.userId,
      username: args.username,
      bio: "",
      joinedAt: Date.now(),
      postCount: 0,
      role: "user", // Default role
      lastActiveAt: Date.now(),
    });
  },
});

export const syncClerkUser = action({
  args: { userId: v.string() },
  async handler(ctx, args) {
    try {
      // Get user from Clerk
      const user = await clerkClient.users.getUser(args.userId);
      
      if (!user) {
        throw new Error("User not found in Clerk");
      }

      // Get or create user profile
      const profiles = await ctx.runQuery(api.auth.getUser, { userId: args.userId });
      
      if (!profiles) {
        // Create new user profile
        const username = user.username || 
          `${user.firstName || ""}${user.lastName || ""}` || 
          "User" + Math.floor(Math.random() * 10000);
        
        await ctx.runMutation(api.auth.createUser, { 
          userId: args.userId,
          username: username
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error syncing Clerk user:", error);
      return { success: false, error: String(error) };
    }
  },
});