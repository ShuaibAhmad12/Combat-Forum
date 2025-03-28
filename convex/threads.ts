import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Define the Thread type
type Thread = {
  _id: string;
  title: string;
  content: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorImageUrl?: string;
  views: number;
  likes: number;
  replyCount: number;
  createdAt: number;
  isPinned: boolean;
  isLocked: boolean;
};

export const list = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .filter((q) => 
        q.eq(q.field("topicId"), args.topicId)
      )
      .order("desc")
      .collect() as Thread[];
  },
});

export const getById = query({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

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
    });

    // Update the thread count for the topic
    const topic = await ctx.db.get(args.topicId);
    if (topic) {
      await ctx.db.patch(args.topicId, {
        threadCount: topic.threadCount + 1,
        lastPostAt: Date.now(),
      });
    }

    // Update the user's post count
    const userProfiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.authorId))
      .collect();
    
    if (userProfiles.length > 0) {
      const userProfile = userProfiles[0];
      await ctx.db.patch(userProfile._id, {
        postCount: userProfile.postCount + 1,
        lastActiveAt: Date.now(),
      });
    }

    return threadId;
  },
});

export const incrementViews = mutation({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.id);
    if (thread) {
      await ctx.db.patch(args.id, {
        views: thread.views + 1,
      });
    }
  },
});

// Add this to your convex/threads.ts file if you haven't already

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("threads")
      .order("desc") // ✅ Correct: only pass "desc" or "asc"
      .collect();
  },
});

