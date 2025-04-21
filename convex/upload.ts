import { mutation } from "./_generated/server"
import { v } from "convex/values"

// Generate a URL for uploading a file to Convex storage
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

// Get a URL for a stored file by ID
export const getUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
})

// Store image metadata in a separate table (optional)
export const storeImageMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    altText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // You can create a separate table for image metadata if needed
    // This is optional but can be useful for managing images
    return await ctx.db.insert("images", {
      storageId: args.storageId,
      fileName: args.fileName,
      fileSize: args.fileSize,
      fileType: args.fileType,
      width: args.width,
      height: args.height,
      altText: args.altText || "",
      uploadedAt: Date.now(),
    })
  },
})
