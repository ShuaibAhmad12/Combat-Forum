import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    
    return profiles.length > 0 ? profiles[0] : null;
  },
});

export const createProfile = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existingProfiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    
    if (existingProfiles.length > 0) {
      return existingProfiles[0]._id;
    }

    return await ctx.db.insert("userProfiles", {
      userId: args.userId,
      username: args.username,
      bio: args.bio,
      joinedAt: Date.now(),
      postCount: 0,
      role: "user", // Default role
      lastActiveAt: Date.now(),
    });
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.string(),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    
    if (profiles.length === 0) {
      throw new Error("Profile not found");
    }

    const profile = profiles[0];
    const updates: any = { lastActiveAt: Date.now() };
    
    if (args.username !== undefined) {
      updates.username = args.username;
    }
    
    if (args.bio !== undefined) {
      updates.bio = args.bio;
    }

    await ctx.db.patch(profile._id, updates);
    return profile._id;
  },
});

export const setRole = mutation({
  args: {
    userId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    
    if (profiles.length === 0) {
      throw new Error("Profile not found");
    }

    const profile = profiles[0];
    await ctx.db.patch(profile._id, {
      role: args.role,
    });
    
    return profile._id;
  },
});