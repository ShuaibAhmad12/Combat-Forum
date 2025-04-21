// app/api/storage/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../../../convex/_generated/api"

// Define the Id type locally
type Id<TableName extends string> = string & { __tableName: TableName }

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  try {
    // Extract storage ID from the URL path
    const url = new URL(request.url)
    const pathname = url.pathname
    
    // Extract the ID from the pathname (assuming format /api/storage/[id])
    const storageId = pathname.split('/').pop()
    
    if (!storageId) {
      return NextResponse.json({ error: "Storage ID is required" }, { status: 400 })
    }

    console.log("Fetching storage ID:", storageId)

    const fileUrl = await convex.mutation(api.upload.getUrl, { 
      storageId: storageId as Id<"_storage"> 
    })
    
    if (!fileUrl) {
      console.error("File URL not found for ID:", storageId)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Fetch the actual image data
    const res = await fetch(fileUrl)
    
    if (!res.ok) {
      console.error("Failed to fetch image from storage, status:", res.status)
      return NextResponse.json({ error: "Failed to fetch image from storage" }, { status: res.status })
    }
    
    const contentType = res.headers.get("content-type") || "image/jpeg"
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("Error fetching image:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
  }
}