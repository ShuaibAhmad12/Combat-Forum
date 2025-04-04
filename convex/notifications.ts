import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc") 
      .collect();
  },
});

export const createNotification = mutation({
    args: {
      userId: v.string(), 
      fromUserId: v.string(), 
      fromUserName: v.string(), 
      threadId: v.id("threads"),
      message: v.string(),
      type: v.string(),
    },
    handler: async (ctx, args) => {
      await ctx.db.insert("notifications", {
        userId: args.userId, 
        fromUserId: args.fromUserId, 
        fromUserName: args.fromUserName, 
        threadId: args.threadId, 
        message: args.message,
        type: args.type, 
        isRead: false,
        createdAt: Date.now(),
      });
    },
  });
  

export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });
  },
});

export const markAllAsRead = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, { isRead: true });
    }
  },
});
