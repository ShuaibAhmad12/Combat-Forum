"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ThumbsUp, MessageSquare, Flag, Share2, Plus, Check } from "lucide-react"
import ReplyForm from "@/components/reply-form"
import { useUser } from "@clerk/clerk-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { useEffect, useState } from "react"
import ModerationControls from "@/components/moderation-controls"
import type { Id } from "../../../../../convex/_generated/dataModel"
import { useToast } from "../../../../components/ui/use-toast"

export default function ThreadPage() {
  const router = useRouter()
  const pathname = usePathname()
  const pathParts = pathname.split("/").filter(Boolean)
  const { toast } = useToast()

  const threadId = pathParts[pathParts.length - 1] // Extract thread ID from URL
  const topicSlug = pathParts[pathParts.length - 2] // Extract topic slug

  const topic = topicSlug.replace(/-/g, " ")
  const formattedTopic = topic
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const { isSignedIn, user } = useUser()
  const userProfile = useQuery(api.users.getProfile, user?.id ? { userId: user.id } : "skip")
  const isModerator = userProfile?.role === "moderator" || userProfile?.role === "admin"

  const topics = useQuery(api.topics.list) || []
  const currentTopic = topics.find((t) => t.name.toLowerCase().replace(/\s+/g, "-") === topicSlug.toLowerCase())

  const topicThreads = useQuery(api.threads.list, currentTopic ? { topicId: currentTopic._id } : "skip") || []
  const foundThread = topicThreads.find((thread) => thread._id === threadId)

  const replies =
    useQuery(api.replies.list, foundThread ? { threadId: foundThread._id as Id<"threads"> } : "skip") || []

  // Check if the current user has liked this thread
  const hasLiked = useQuery(
    api.threads.hasUserLiked,
    isSignedIn && user?.id && foundThread ? { threadId: foundThread._id as Id<"threads">, userId: user.id } : "skip",
  )

  const [isShared, setIsShared] = useState(false)

  // Mutations
  const incrementViews = useMutation(api.threads.incrementViews)
  const toggleLike = useMutation(api.threads.toggleLike)
  const createNotification = useMutation(api.notifications.createNotification);
  useEffect(() => {
    if (foundThread) {
      const viewedThreads = JSON.parse(sessionStorage.getItem("viewedThreads") || "{}");
  
      if (!viewedThreads[foundThread._id]) {
        incrementViews({ id: foundThread._id as Id<"threads"> });
        viewedThreads[foundThread._id] = true;
        sessionStorage.setItem("viewedThreads", JSON.stringify(viewedThreads));
      }
    }
  }, [foundThread]);
  

  // Handle like button click
  const handleLike = async () => {
    if (!isSignedIn || !user?.id || !foundThread) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like threads",
        variant: "destructive",
      });
      return;
    }
  
    // Toggle like status
    await toggleLike({
      threadId: foundThread._id as Id<"threads">,
      userId: user.id,
    });
  
    // If the user liking the thread is not the author, send a notification
    if (foundThread.authorId !== user.id) {
      await createNotification({
        userId: foundThread.authorId, 
        fromUserId: user.id, 
        fromUserName: user.fullName || "Unknown User", 
        threadId: foundThread._id as Id<"threads">,
        message: `${user.fullName} liked your thread.`,
        type: "like",
      });
    }
  };

  // Handle share button click
  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setIsShared(true)
      toast({
        title: "Link copied!",
        description: "Thread link has been copied to clipboard",
      })
      setTimeout(() => {
        setIsShared(false)
      }, 2000)
    })
  }

  if (!foundThread) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Thread not found</h2>
        <p className="mt-4 text-muted-foreground">The thread you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-6" asChild>
          <Link href={`/topics/${topicSlug}`}>Back to {formattedTopic}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/topics" className="hover:underline">
              Topics
            </Link>
            <span>/</span>
            <Link href={`/topics/${topicSlug}`} className="hover:underline">
              {formattedTopic}
            </Link>
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">{foundThread.title}</h1>
        </div>

        {/* "Create Thread" Button (if signed in) */}
        {isSignedIn && (
          <Button onClick={() => router.push(`/topics/${topicSlug}/new-thread`)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Thread
          </Button>
        )}
      </div>

      {/* Original Post */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={foundThread.authorImageUrl || "/placeholder.svg"} alt={foundThread.authorName} />
            <AvatarFallback>{foundThread.authorName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{foundThread.authorName}</p>
            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(foundThread.createdAt))} ago</p>
          </div>
        </CardHeader>
        <CardContent>
          <div
            dangerouslySetInnerHTML={{ __html: foundThread.content }}
            className="prose dark:prose-invert max-w-none"
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center gap-4">
            <Button
              variant={hasLiked ? "secondary" : "ghost"}
              size="sm"
              className="flex items-center gap-1"
              onClick={handleLike}
            >
              <ThumbsUp className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
              <span>{foundThread.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => document.getElementById("reply-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Reply</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isShared ? "secondary" : "ghost"}
              size="sm"
              className="flex items-center gap-1"
              onClick={handleShare}
            >
              {isShared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              <span>{isShared ? "Copied" : "Share"}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Flag className="h-4 w-4" />
              <span>Report</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Moderation Controls */}
      {isModerator && <ModerationControls threadId={foundThread._id} isModerator={isModerator} />}

      {/* Replies Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Replies ({replies.length})</h2>
        {replies.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No replies yet. Be the first to reply!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => (
              <Card key={reply._id}>
                <CardHeader className="flex flex-row items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={reply.authorImageUrl || "/placeholder.svg"} alt={reply.authorName} />
                    <AvatarFallback>{reply.authorName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{reply.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.createdAt))} ago
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    dangerouslySetInnerHTML={{ __html: reply.content }}
                    className="prose dark:prose-invert max-w-none"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div id="reply-form" className="mt-6">
          {isSignedIn ? (
            <ReplyForm threadId={foundThread._id as Id<"threads">} />
          ) : (
            <Button asChild>
              <Link href="/sign-in">Sign In to Reply</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

