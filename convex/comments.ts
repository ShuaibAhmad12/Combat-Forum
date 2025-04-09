import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    console.log("Fetching comments for post:", args.postId)
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("asc")
      .collect()

    console.log(`Found ${comments.length} comments`)
    return comments
  },
})

export const create = mutation({
  args: {
    postId: v.id("posts"),
    parentId: v.optional(v.id("comments")),
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const commentId = await ctx.db.insert("comments", {
      ...args,
      likeCount: 0,
      createdAt: Date.now(),
    })

    // Update comment count on the post
    const post = await ctx.db.get(args.postId)
    if (post) {
      await ctx.db.patch(args.postId, {
        commentCount: post.commentCount + 1,
      })
    }

    return commentId
  },
})

export const like = mutation({
  args: { commentId: v.id("comments"), userId: v.string() },
  handler: async (ctx, args) => {
    // Check if user already liked this comment
    const existingLike = await ctx.db
      .query("like")
      .withIndex("by_comment_user", (q) => q.eq("commentId", args.commentId).eq("userId", args.userId))
      .first()

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id)
      await ctx.db.patch(args.commentId, {
        likeCount: Math.max(0, ((await ctx.db.get(args.commentId))?.likeCount ?? 0) - 1),
      })
      return false
    } else {
      // Like
      await ctx.db.insert("like", {
        commentId: args.commentId,
        userId: args.userId,
        createdAt: Date.now(),
      })
      await ctx.db.patch(args.commentId, {
        likeCount: ((await ctx.db.get(args.commentId))?.likeCount ?? 0) + 1,
      })
      return true
    }
  },
})

