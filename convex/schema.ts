import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  topics: defineTable({
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    color: v.string(),
    threadCount: v.number(),
    lastPostAt: v.optional(v.number()),
  }),

  threads: defineTable({
    title: v.string(),
    content: v.string(),
    topicId: v.id("topics"),
    authorId: v.string(),
    authorName: v.string(),
    authorImageUrl: v.optional(v.string()),
    views: v.number(),
    likes: v.number(),
    replyCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    isPinned: v.optional(v.boolean()),
    isLocked: v.optional(v.boolean()),
  }),

  replies: defineTable({
    threadId: v.id("threads"),
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorImageUrl: v.optional(v.string()),
    likes: v.number(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
  }),

  userProfiles: defineTable({
    userId: v.string(),
    username: v.string(),
    bio: v.optional(v.string()),
    joinedAt: v.number(),
    postCount: v.number(),
    role: v.string(), 
    lastActiveAt: v.optional(v.number()),
  }),

  likes: defineTable({
    userId: v.string(),
    targetId: v.string(), 
    targetType: v.string(), 
    createdAt: v.number(),
  }).index("by_user_and_target", ["userId", "targetId", "targetType"]),

  notifications: defineTable({
    userId: v.string(),
    type: v.string(), 
    threadId: v.id("threads"),
    fromUserId: v.string(),
    fromUserName: v.string(),
    message: v.string(),
    createdAt: v.number(),
    isRead: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),
});
