"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageSquare, Share2, Reply, Check, Copy, Twitter, Facebook, Linkedin } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"

export default function BlogPostPage() {
  const params = useParams()
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ""
  const { isSignedIn, user } = useUser()
  const [commentText, setCommentText] = useState("")
  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debug params
  useEffect(() => {
    console.log("Slug parameter:", slug)
  }, [slug])

  // Fetch post data
  const post = useQuery(api.posts.getBySlug, { slug })

  // Debug post data
  useEffect(() => {
    console.log("Post data:", post)
    if (post) {
      setIsLoading(false)
    }
  }, [post])

  // Fetch comments only when we have a post
  const comments = useQuery(api.comments.getByPostId, post?._id ? { postId: post._id } : "skip")

  // Debug comments
  useEffect(() => {
    console.log("Comments:", comments)
  }, [comments])

  // Check if user has liked the post
  const userLikes = useQuery(api.likes.getUserLikes, user?.id ? { userId: user.id } : "skip")

  const hasLikedPost = post && userLikes?.postLikes?.includes(post._id)

  // Mutations
  const createComment = useMutation(api.comments.create)
  const likePost = useMutation(api.posts.like)
  const likeComment = useMutation(api.comments.like)

  // Group comments by parent
  const topLevelComments = comments?.filter((comment) => !comment.parentId) || []
  const commentReplies =
    comments?.reduce(
      (acc, comment) => {
        if (comment.parentId) {
          if (!acc[comment.parentId]) {
            acc[comment.parentId] = []
          }
          acc[comment.parentId].push(comment)
        }
        return acc
      },
      {} as Record<string, typeof comments>,
    ) || {}

  const handleCommentSubmit = async () => {
    if (!isSignedIn || !user || !post) return

    try {
      await createComment({
        postId: post._id,
        content: commentText,
        authorId: user.id,
        authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Anonymous",
        authorImageUrl: user.imageUrl,
      })

      setCommentText("")
      toast("Your comment has been posted successfully.")
    } catch (error) {
      toast("Failed to post comment. Please try again.")
      console.error("Error posting comment:", error)
    }
  }

  const handleReplySubmit = async (commentId: Id<"comments">) => {
    if (!isSignedIn || !user || !post) return

    try {
      await createComment({
        postId: post._id,
        parentId: commentId,
        content: replyText,
        authorId: user.id,
        authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Anonymous",
        authorImageUrl: user.imageUrl,
      })

      setReplyText("")
      setReplyingTo(null)
      toast("Your reply has been posted successfully.")
    } catch (error) {
      toast("Failed to post reply. Please try again.")
      console.error("Error posting reply:", error)
    }
  }

  const handleLikePost = async () => {
    if (!isSignedIn || !user || !post) return

    try {
      await likePost({
        postId: post._id,
        userId: user.id,
      })
    } catch (error) {
      toast("Failed to like post. Please try again.")
      console.error("Error liking post:", error)
    }
  }

  const handleLikeComment = async (commentId: Id<"comments">) => {
    if (!isSignedIn || !user) return

    try {
      await likeComment({
        commentId,
        userId: user.id,
      })
    } catch (error) {
      toast("Failed to like comment. Please try again.")
      console.error("Error liking comment:", error)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)

    toast("The link has been copied to your clipboard.")

    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnSocialMedia = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(post?.title || "Check out this blog post")

    let shareUrl = ""

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
    }

    window.open(shareUrl, "_blank")
  }

  // Show loading state
  if (isLoading && !post && !error) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="container max-w-3xl py-10">
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full rounded-lg" />
              <Skeleton className="h-12 w-3/4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="container max-w-3xl py-10">
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Post</h2>
              <p className="mb-6">{error}</p>
              <Link href="/blog">
                <Button>Return to Blog</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Show not found state
  if (!isLoading && !post) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="container max-w-3xl py-10">
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
              <p className="mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
              <Link href="/blog">
                <Button>Return to Blog</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <article className="container max-w-3xl py-10">
          <div className="relative h-[300px] w-full mb-8">
            <Image
              src={post?.imageUrl || "/placeholder.svg"}
              alt={post?.title || "Blog post"}
              fill
              className="object-cover rounded-lg"
            />
            {post?.category && (
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded">
                {post.category}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">{post?.title}</h1>

          <div className="flex items-center gap-4 mb-8">
            <Avatar>
              <AvatarImage
                src={post?.authorImageUrl || "/placeholder.svg?height=40&width=40"}
                alt={post?.authorName || "Author"}
              />
              <AvatarFallback>{post?.authorName?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post?.authorName}</p>
              <p className="text-sm text-muted-foreground">
                {post?.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </p>
            </div>
          </div>

          <div
            className="prose dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post?.content || "" }}
          />

          <div className="flex items-center gap-6 py-4 border-t border-b">
            <Button
              variant={hasLikedPost ? "default" : "ghost"}
              size="sm"
              onClick={handleLikePost}
              className="flex items-center gap-2"
              disabled={!isSignedIn}
            >
              <ThumbsUp className={`h-4 w-4 ${hasLikedPost ? "fill-current" : ""}`} />
              <span>{post?.likeCount || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>{post?.commentCount || 0}</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="start">
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleShare}>
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy link
                    </Button>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="icon" onClick={() => shareOnSocialMedia("twitter")}>
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => shareOnSocialMedia("facebook")}>
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => shareOnSocialMedia("linkedin")}>
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Comments ({post?.commentCount || 0})</h2>

            {isSignedIn ? (
              <div className="mb-8">
                <Textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={handleCommentSubmit} disabled={!commentText.trim()}>
                  Post Comment
                </Button>
              </div>
            ) : (
              <Card className="mb-8">
                <CardContent className="pt-6 flex flex-col items-center gap-4">
                  <p>Sign in to join the conversation</p>
                  <SignInButton mode="modal">
                    <Button>Sign In</Button>
                  </SignInButton>
                </CardContent>
              </Card>
            )}

            {!comments ? (
              <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
            ) : (
              <div className="space-y-6">
                {topLevelComments.map((comment) => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    replies={commentReplies[comment._id] || []}
                    isSignedIn={!!isSignedIn}
                    userLikes={userLikes}
                    onReply={(commentId) => {
                      setReplyingTo(replyingTo === commentId ? null : commentId)
                      setReplyText("")
                    }}
                    replyingTo={replyingTo}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    onSubmitReply={handleReplySubmit}
                    onLike={handleLikeComment}
                  />
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  )
}

interface CommentCardProps {
  comment: any
  replies: any[]
  isSignedIn: boolean
  userLikes: any
  onReply: (commentId: string) => void
  replyingTo: string | null
  replyText: string
  setReplyText: (text: string) => void
  onSubmitReply: (commentId: Id<"comments">) => void
  onLike: (commentId: Id<"comments">) => void
}

function CommentCard({
  comment,
  replies,
  isSignedIn,
  userLikes,
  onReply,
  replyingTo,
  replyText,
  setReplyText,
  onSubmitReply,
  onLike,
}: CommentCardProps) {
  const hasLikedComment = userLikes?.commentLikes?.includes(comment._id)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
          <Avatar>
            <AvatarImage
              src={comment.authorImageUrl || "/placeholder.svg?height=40&width=40"}
              alt={comment.authorName}
            />
            <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{comment.authorName}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <p>{comment.content}</p>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant={hasLikedComment ? "default" : "ghost"}
              size="sm"
              className="flex items-center gap-1 h-auto p-1"
              onClick={() => onLike(comment._id)}
              disabled={!isSignedIn}
            >
              <ThumbsUp className={`h-3 w-3 ${hasLikedComment ? "fill-current" : ""}`} />
              <span className="text-xs">{comment.likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 h-auto p-1"
              onClick={() => onReply(comment._id)}
              disabled={!isSignedIn}
            >
              <Reply className="h-3 w-3" />
              <span className="text-xs">Reply</span>
            </Button>
          </div>

          {replyingTo === comment._id && isSignedIn && (
            <div className="mt-4 pl-10">
              <Textarea
                placeholder="Write a reply..."
                className="mb-2 text-sm"
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onReply(comment._id)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => onSubmitReply(comment._id)} disabled={!replyText.trim()}>
                  Reply
                </Button>
              </div>
            </div>
          )}

          {replies.length > 0 && (
            <div className="mt-4 pl-10 space-y-4">
              {replies.map((reply) => (
                <Card key={reply._id}>
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={reply.authorImageUrl || "/placeholder.svg?height=40&width=40"}
                        alt={reply.authorName}
                      />
                      <AvatarFallback>{reply.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{reply.authorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reply.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2">
                    <div className="flex items-center gap-4 mt-2">
                      <Button
                        variant={userLikes?.commentLikes?.includes(reply._id) ? "default" : "ghost"}
                        size="sm"
                        className="flex items-center gap-1 h-auto p-1"
                        onClick={() => onLike(reply._id)}
                        disabled={!isSignedIn}
                      >
                        <ThumbsUp
                          className={`h-3 w-3 ${userLikes?.commentLikes?.includes(reply._id) ? "fill-current" : ""}`}
                        />
                        <span className="text-xs">{reply.likeCount}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

