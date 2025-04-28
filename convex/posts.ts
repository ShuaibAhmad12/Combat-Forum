import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    
    // Get the deployment URL for HTTP actions
    const deploymentUrl = process.env.CONVEX_SITE_URL || "https://your-deployment.convex.site";
    
    // Map over posts to add image URLs
    return posts.map((post) => {
      let imageUrl = null;
      if (post.imageId) {
        // Format the URL to include the file extension
        imageUrl = `${deploymentUrl}/getImage/${post.imageId}/image.jpg`;
      }
      
      return {
        ...post,
        imageUrl
      };
    });
  },
});


export const getPostsWithImageUrls = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();
    
    return Promise.all(posts.map(async (post) => {
      let imageUrl = null;
      if (post.imageId) {
        imageUrl = await ctx.storage.getUrl(post.imageId);
      }
      
      return {
        ...post,
        imageUrl
      };
    }));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    console.log("Fetching post with slug:", args.slug);

    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    console.log("Post found:", post);

    if (!post) return null;

    const deploymentUrl = process.env.CONVEX_SITE_URL || "https://beloved-leopard-310.convex.site.convex.site";

    let imageUrl = null;
    if (post.imageId) {
      imageUrl = `${deploymentUrl}/getImage/${post.imageId}/image.jpg`;
    }

    return {
      ...post,
      imageUrl,
    };
  },
});


export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    content: v.string(),
    category: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorImageUrl: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const slug = args.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    const now = Date.now()

    return await ctx.db.insert("posts", {
      ...args,
      slug,
      published: true,
      likeCount: 0,
      commentCount: 0,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args

    const post = await ctx.db.get(id)
    if (!post) {
      throw new Error("Post not found")
    }

    const updates: {
      updatedAt: number;
      title?: string;
      description?: string;
      content?: string;
      category?: string;
      published?: boolean;
      slug?: string;
    } = {
      ...rest,
      updatedAt: Date.now(),
    }

    // Update slug if title changed
    if (args.title) {
      updates.slug = args.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }

    return await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    // In a production app, you would also delete related comments and likes
    return await ctx.db.delete(args.id)
  },
})

export const like = mutation({
  args: { postId: v.id("posts"), userId: v.string() },
  handler: async (ctx, args) => {
    // Check if user already liked this post
    const existingLike = await ctx.db
      .query("like")
      .withIndex("by_post_user", (q) => q.eq("postId", args.postId).eq("userId", args.userId))
      .first()

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id)
      await ctx.db.patch(args.postId, {
        likeCount: Math.max(0, ((await ctx.db.get(args.postId))?.likeCount ?? 0) - 1),
      })
      return false
    } else {
      // Like
      await ctx.db.insert("like", {
        postId: args.postId,
        userId: args.userId,
        createdAt: Date.now(),
      })
      await ctx.db.patch(args.postId, {
        likeCount: ((await ctx.db.get(args.postId))?.likeCount ?? 0) + 1,
      })
      return true
    }
  },
})

export const getCategories = query({
  handler: async (ctx) => {
    // Get all posts
    const posts = await ctx.db.query("posts").collect()

    // Count posts by category
    const categoryMap = new Map<string, number>()

    for (const post of posts) {
      if (post.category) {
        const count = categoryMap.get(post.category) || 0
        categoryMap.set(post.category, count + 1)
      }
    }

    // Convert to array of objects
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count) // Sort by count descending
  },
})

export const getMostVisited = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.query("posts").order("desc").take(args.limit)
  },
})

export const recordView = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId)
    if (!post) {
      throw new Error("Post not found")
    }

    // Increment view count
    return await ctx.db.patch(args.postId, {
      viewCount: (post.viewCount || 0) + 1,
    })
  },
})

export const getTags = query({
  handler: async (ctx) => {
    // Get all posts
    const posts = await ctx.db.query("posts").collect()

    // Count posts by tag
    const tagMap = new Map<string, number>()

    for (const post of posts) {
      if (post.tags && Array.isArray(post.tags)) {
        for (const tag of post.tags) {
          const count = tagMap.get(tag) || 0
          tagMap.set(tag, count + 1)
        }
      }
    }

    // Convert to array of objects
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count) // Sort by count descending
  },
})

