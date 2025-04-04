import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Define the Thread type
type Thread = {
  _id: string
  title: string
  content: string
  topicId: string
  authorId: string
  authorName: string
  authorImageUrl?: string
  views: number
  likes: number
  replyCount: number
  createdAt: number
  isPinned: boolean
  isLocked: boolean
}

export const list = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    return (await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("topicId"), args.topicId))
      .order("desc")
      .collect()) as Thread[]
  },
})

export const getById = query({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    topicId: v.id("topics"),
    authorId: v.string(),
    authorName: v.string(),
    authorImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const threadId = await ctx.db.insert("threads", {
      title: args.title,
      content: args.content,
      topicId: args.topicId,
      authorId: args.authorId,
      authorName: args.authorName,
      authorImageUrl: args.authorImageUrl,
      views: 0,
      likes: 0,
      replyCount: 0,
      createdAt: Date.now(),
      isPinned: false,
      isLocked: false,
    })

    // Update the thread count for the topic
    const topic = await ctx.db.get(args.topicId)
    if (topic) {
      await ctx.db.patch(args.topicId, {
        threadCount: topic.threadCount + 1,
        lastPostAt: Date.now(),
      })
    }

    // Update the user's post count
    const userProfiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.authorId))
      .collect()

    if (userProfiles.length > 0) {
      const userProfile = userProfiles[0]
      await ctx.db.patch(userProfile._id, {
        postCount: userProfile.postCount + 1,
        lastActiveAt: Date.now(),
      })
    }

    return threadId
  },
})

export const incrementViews = mutation({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.id)
    if (thread) {
      await ctx.db.patch(args.id, {
        views: thread.views + 1,
      })
    }
  },
})

// Add this to your convex/threads.ts file if you haven't already
export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("threads")
      .order("desc") // ✅ Correct: only pass "desc" or "asc"
      .collect()
  },
})

// New functions for like functionality

// Check if a user has liked a thread
export const hasUserLiked = query({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("likes")
      .withIndex("by_user_and_target", (q) =>
        q.eq("userId", args.userId).eq("targetId", args.threadId).eq("targetType", "thread"),
      )
      .first()

    return !!like
  },
})

// Toggle like on a thread
export const toggleLike = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the user has already liked this thread
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_and_target", (q) =>
        q.eq("userId", args.userId).eq("targetId", args.threadId).eq("targetType", "thread"),
      )
      .first()

    // Get the current thread
    const thread = await ctx.db.get(args.threadId)
    if (!thread) {
      throw new Error("Thread not found")
    }

    if (existingLike) {
      // User already liked, so remove the like
      await ctx.db.delete(existingLike._id)

      // Decrement the likes count
      await ctx.db.patch(args.threadId, {
        likes: Math.max(0, thread.likes - 1),
      })

      return false // User no longer likes
    } else {
      // User hasn't liked, so add a like
      await ctx.db.insert("likes", {
        userId: args.userId,
        targetId: args.threadId,
        targetType: "thread",
        createdAt: Date.now(),
      })

      // Increment the likes count
      await ctx.db.patch(args.threadId, {
        likes: thread.likes + 1,
      })

      return true // User now likes
    }
  },
})

export const getThreadsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return (await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("authorId"), args.userId))
      .order("desc")
      .collect()) || [];
  },
});

export const getRecentThreads = query({
  args: { 
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    // Default limit to 5 if not provided
    const limit = args.limit || 5;
    
    return await ctx.db
      .query("threads")
      .order("desc") 
      .take(limit);
  },
});