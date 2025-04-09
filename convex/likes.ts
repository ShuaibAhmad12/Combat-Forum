import { query } from "./_generated/server"
import { v } from "convex/values"

export const getUserLikes = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    console.log("Fetching likes for user:", args.userId)

    // Get all post likes by this user
    const postLikes = await ctx.db
      .query("like")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.neq(q.field("postId"), undefined))
      .collect()
      .then((likes) => likes.map((like) => like.postId))

    // Get all comment likes by this user
    const commentLikes = await ctx.db
      .query("like")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.neq(q.field("commentId"), undefined))
      .collect()
      .then((likes) => likes.map((like) => like.commentId))

    console.log("User likes found:", { postLikes, commentLikes })

    return {
      postLikes,
      commentLikes,
    }
  },
})

