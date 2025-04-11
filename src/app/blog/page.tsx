"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { BlogContentPreview } from "../../components/blog-content-preview"

export default function BlogPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch posts from Convex
  const posts = useQuery(api.posts.getAll)

  // Debug posts data
  useEffect(() => {
    console.log("Posts data:", posts)
    if (posts !== undefined) {
      setIsLoading(false)
    }
  }, [posts])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blog</h1>
                <p className="max-w-[700px] text-muted-foreground">
                  The latest news, updates, and insights from the world of combat sports.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">Latest</Button>
                <Button variant="ghost">Popular</Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Posts</h2>
                <p>{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-10">
                <h2 className="text-2xl font-bold mb-4">No Posts Found</h2>
                <p>There are currently no blog posts available.</p>
              </div>
            ) : (
              <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogPostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function BlogPostCard({ post }: { post: any }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-48">
        <Image src="/placeholder.svg?height=200&width=400" alt={post.title} fill className="object-cover" />
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded">
          {post.category}
        </div>
      </div>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Replace the plain text paragraph with BlogContentPreview */}
        <BlogContentPreview content={post.description} lineClamp={2} />
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{post.commentCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs">{post.likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
          </div>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <Button variant="ghost" size="sm">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
