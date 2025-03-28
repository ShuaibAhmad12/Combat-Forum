import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Define the Reply type
type Reply = {
  _id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImageUrl?: string;
  likes: number;
  createdAt: number;
  isDeleted: boolean;
};

export const list = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("replies")
      .filter((q) => 
        q.eq(q.field("threadId"), args.threadId)
      )
      .order("asc")
      .collect() as Reply[];
  },
});

export const create = mutation({
  args: {
    threadId: v.id("threads"),
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const replyId = await ctx.db.insert("replies", {
      threadId: args.threadId,
      content: args.content,
      authorId: args.authorId,
      authorName: args.authorName,
      authorImageUrl: args.authorImageUrl,
      likes: 0,
      createdAt: Date.now(),
      isDeleted: false,
    });

    // Update the reply count for the thread
    const thread = await ctx.db.get(args.threadId);
    if (thread) {
      await ctx.db.patch(args.threadId, {
        replyCount: thread.replyCount + 1,
        updatedAt: Date.now(),
      });

      // Update the topic's last post time
      const topic = await ctx.db.get(thread.topicId);
      if (topic) {
        await ctx.db.patch(thread.topicId, {
          lastPostAt: Date.now(),
        });
      }
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

    return replyId;
  },
});