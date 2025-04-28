import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect()

    // Get the deployment URL for HTTP actions
    const deploymentUrl = process.env.CONVEX_SITE_URL || "https://your-deployment.convex.site"

    // Map over posts to add image URLs
    return posts.map((post) => {
      let imageUrl = null
      if (post.imageId) {
        // Format the URL to include the file extension
        imageUrl = `${deploymentUrl}/getImage/${post.imageId}/image.jpg`
      }

      return {
        ...post,
        imageUrl,
      }
    })
  },
})

// Get filtered posts
export const getFiltered = query({
  args: {
    searchQuery: v.optional(v.string()),
    category: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    dateFrom: v.optional(v.number()),
    year: v.optional(v.string()), // Add year parameter
  },
  handler: async (ctx, args) => {
    // Start with a base query for published posts
    let postsQuery = ctx.db.query("posts").filter((q) => q.eq(q.field("published"), true))

    // Apply category filter
    if (args.category && args.category !== "all") {
      postsQuery = postsQuery.filter((q) => q.eq(q.field("category"), args.category))
    }

    // Apply date filter - only if dateFrom is defined
    if (args.dateFrom !== undefined) {
      postsQuery = postsQuery.filter((q) => q.gte(q.field("createdAt"), args.dateFrom as number))
    }

    // Collect all posts first (we'll sort them manually for some cases)
    const posts = await postsQuery.collect()

    // Get the deployment URL for HTTP actions
    const deploymentUrl = process.env.CONVEX_SITE_URL || "https://your-deployment.convex.site"

    // Add image URLs to posts
    const postsWithImages = posts.map((post) => {
      let imageUrl = null
      if (post.imageId) {
        imageUrl = `${deploymentUrl}/getImage/${post.imageId}/image.jpg`
      }

      return {
        ...post,
        imageUrl,
      }
    })

    // Apply search filter if provided
    let filteredPosts = postsWithImages
    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase()
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.description.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower),
      )
    }

    // Apply year filter if provided
    if (args.year) {
      filteredPosts = filteredPosts.filter((post) => {
        const postDate = new Date(post.createdAt)
        const postYear = postDate.getFullYear().toString()
        return postYear === args.year
      })
    }

    // Apply sorting
    if (args.sortBy === "oldest") {
      // Sort by creation date (oldest first)
      filteredPosts.sort((a, b) => a.createdAt - b.createdAt)
    } else if (args.sortBy === "popular") {
      // Sort by like count (highest first)
      filteredPosts.sort((a, b) => b.likeCount - a.likeCount)
    } else if (args.sortBy === "comments") {
      // Sort by comment count (highest first)
      filteredPosts.sort((a, b) => b.commentCount - a.commentCount)
    } else {
      // Default: sort by creation date (newest first)
      filteredPosts.sort((a, b) => b.createdAt - a.createdAt)
    }

    return filteredPosts
  },
})

// New query to get archive data
export const getArchiveData = query({
  handler: async (ctx) => {
    // Get all published posts
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("published"), true))
      .collect()

    // Group posts by year
    const postsByYear: Record<string, any[]> = {}
    const years = new Set<string>()

    posts.forEach((post) => {
      const postDate = new Date(post.createdAt)
      const year = postDate.getFullYear().toString()

      // Add year to set of years
      years.add(year)

      // Initialize array for year if it doesn't exist
      if (!postsByYear[year]) {
        postsByYear[year] = []
      }

      // Add post to year
      postsByYear[year].push({
        date: postDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        title: post.title,
        slug: post.slug,
      })
    })

    // Sort posts within each year by date (newest first)
    Object.keys(postsByYear).forEach((year) => {
      postsByYear[year].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
    })

    // Convert set to array and sort years in descending order
    const sortedYears = Array.from(years).sort((a, b) => Number.parseInt(b) - Number.parseInt(a))

    return {
      years: sortedYears,
      postsByYear,
    }
  },
})

// Get all unique categories
export const getCategories1 = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("published"), true))
      .collect()

    // Extract unique categories
    const categories = new Set<string>()
    posts.forEach((post) => {
      if (post.category) {
        categories.add(post.category)
      }
    })

    return Array.from(categories)
  },
})

export const getPostsWithImageUrls = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect()

    return Promise.all(
      posts.map(async (post) => {
        let imageUrl = null
        if (post.imageId) {
          imageUrl = await ctx.storage.getUrl(post.imageId)
        }

        return {
          ...post,
          imageUrl,
        }
      }),
    )
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    console.log("Fetching post with slug:", args.slug)

    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()

    console.log("Post found:", post)

    if (!post) return null

    const deploymentUrl = process.env.CONVEX_SITE_URL || "https://beloved-leopard-310.convex.site.convex.site"

    let imageUrl = null
    if (post.imageId) {
      imageUrl = `${deploymentUrl}/getImage/${post.imageId}/image.jpg`
    }

    return {
      ...post,
      imageUrl,
    }
  },
})

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
      updatedAt: number
      title?: string
      description?: string
      content?: string
      category?: string
      published?: boolean
      slug?: string
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


