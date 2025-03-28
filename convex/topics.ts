import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("topics").collect();
  },
});

export const getById = query({
  args: { id: v.id("topics") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("topics", {
      name: args.name,
      description: args.description,
      icon: args.icon,
      color: args.color,
      threadCount: 0,
      lastPostAt: Date.now(),
    });
  },
});