"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, MessageSquare, Flag, Share2 } from 'lucide-react'
import ReplyForm from "@/components/reply-form"
import { useUser } from "@clerk/clerk-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import {formatDistanceToNow} from "date-fns/formatDistanceToNow"
import { useEffect } from "react"
import ModerationControls from "@/components/moderation-controls"
import { Id } from "../../../../../convex/_generated/dataModel"
import { usePathname } from 'next/navigation'
export default function ThreadPage({ params }: { params: { topic: string; threadid: string } }) {
  const threadId = params.threadid; // Get thread ID directly from params
  const topic = params.topic.replace(/-/g, ' ');
  const pathname = usePathname()
  // const threadId = pathname.split('/').pop()
  console.log("ThreadID from pathname:", threadId)
  const { isSignedIn, user } = useUser()
  const userProfile = useQuery(api.users.getProfile, 
    user?.id ? { userId: user.id } : "skip"
  )
  const isModerator = userProfile?.role === "moderator" || userProfile?.role === "admin"
  
  // const topic = params.topic.replace(/-/g, ' ')
  const formattedTopic = topic.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  
  // Get all topics
  const topics = useQuery(api.topics.list) || []
  // console.log("Topics:", topics);
  const currentTopic = topics.find(t => 
    t.name.toLowerCase().replace(/\s+/g, '-') === params.topic.toLowerCase()
  );
  // console.log("Formatted topic from params:", params.topic);
  // console.log("Topics Slugs:", topics.map(t => t.name.toLowerCase().replace(/\s+/g, '-')));

  
  // Log currentTopic for debugging
  // console.log("Current Topic:", currentTopic);
  
  // Get all threads for this topic
  const topicThreads = useQuery(
    api.threads.list, 
    currentTopic ? { topicId: currentTopic._id } : "skip"
  ) || [];

  const threadsArray = Object.values(topicThreads);
  // console.log("Converted Threads Array:", threadsArray);

  console.log("Raw topicThreads:", topicThreads);
// console.log("Type of topicThreads:", typeof topicThreads);
// console.log("Is topicThreads an Array?", Array.isArray(topicThreads));
  // Log topicThreads for debugging
  // console.log("Topic Threads:", topicThreads);
  // console.log("Type of topicThreads:", typeof topicThreads);
  // console.log("Is topicThreads an Array?", Array.isArray(topicThreads));
  // Find the thread by ID
  const topicThreadsArray = topicThreads ? Object.values(topicThreads) : [];
  // const thread = topicThreadsArray.find(t => t._id === params.threadId);
  
  // Log thread for debugging
  const foundThread = topicThreads.find(thread => thread._id === threadId);
  console.log("Found Thread:", foundThread);

  // Fetch replies if we have a thread
  const replies = useQuery(
    api.replies.list, 
    foundThread ? { threadId: foundThread._id as Id<"threads"> } : "skip"
  ) || []
  
  // Log replies for debugging
  // console.log("Replies:", replies);
  
  // Increment view count
  const incrementViews = useMutation(api.threads.incrementViews)
  
  useEffect(() => {
    if (foundThread) {
      incrementViews({ id: foundThread._id as Id<"threads"> });
    }
  }, [foundThread?._id]);

  // Show loading state while fetching data
  if (topics.length === 0 || (currentTopic && topicThreads.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Loading thread...</h2>
        </div>
      </div>
    )
  }
  
  // Show error state if thread not found
  if (!foundThread) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Thread not found</h2>
          <p className="mt-4 text-muted-foreground">
            The thread you're looking for doesn't exist or has been removed.
          </p>
          <Button className="mt-6" asChild>
            <Link href={`/topics/${params.topic}`}>Back to {formattedTopic}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/topics" className="hover:underline">Topics</Link>
          <span>/</span>
          <Link href={`/topics/${params.topic}`} className="hover:underline">{formattedTopic}</Link>
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">{foundThread.title}</h1>
      </div>

      <div className="space-y-6">
        {/* Original post */}
        <Card>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={foundThread.authorImageUrl || "/placeholder.svg?height=40&width=40"} alt={foundThread.authorName} />
              <AvatarFallback>{foundThread.authorName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{foundThread.authorName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(foundThread.createdAt))} ago</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: foundThread.content }} className="prose dark:prose-invert max-w-none" />
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{foundThread.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Reply</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Flag className="h-4 w-4" />
                <span>Report</span>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Moderation controls - only for moderators */}
        {isModerator && (
          <ModerationControls threadId={foundThread._id} isModerator={isModerator} />
        )}

        {/* Replies */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Replies ({replies.length})</h2>
          {replies.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-muted-foreground">No replies yet. Be the first to reply!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <Card key={reply._id}>
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={reply.authorImageUrl || "/placeholder.svg?height=40&width=40"} alt={reply.authorName} />
                      <AvatarFallback>{reply.authorName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{reply.authorName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatDistanceToNow(new Date(reply.createdAt))} ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div dangerouslySetInnerHTML={{ __html: reply.content }} className="prose dark:prose-invert max-w-none" />
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{reply.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>Reply</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Flag className="h-4 w-4" />
                        <span>Report</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {isSignedIn ? (
  <div className="mt-6">
    <h2 className="text-xl font-semibold mb-4">Post a Reply</h2>
    <ReplyForm threadId={foundThread._id as Id<"threads">} />
  </div>
) : (
  <Card className="mt-6">
    <CardContent className="py-6">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Sign in to join the conversation</p>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
)}
        </div>
      </div>
    </div>
  )
}

