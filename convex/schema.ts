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

  posts: defineTable({
    title: v.string(),
    description: v.string(),
    content: v.string(),
    category: v.string(),
    slug: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorImageUrl: v.optional(v.string()),
    published: v.boolean(),
    likeCount: v.number(),
    commentCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    imageId: v.optional(v.id("_storage")),
    
  })
    .index("by_slug", ["slug"])
    .index("by_author", ["authorId"]),

  comments: defineTable({
    postId: v.id("posts"),
    parentId: v.optional(v.id("comments")),
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorImageUrl: v.optional(v.string()),
    likeCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_parent", ["parentId"]),

  like: defineTable({
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
    userId: v.string(),
    createdAt: v.number(),
  })
    .index("by_post_user", ["postId", "userId"])
    .index("by_comment_user", ["commentId", "userId"])
    .index("by_user", ["userId"]),
    
    images: defineTable({
      storageId: v.id("_storage"),
      fileName: v.string(),
      fileSize: v.number(),
      fileType: v.string(),
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      altText: v.string(),
      uploadedAt: v.number(),
    }).index("by_storageId", ["storageId"]),
  

});
