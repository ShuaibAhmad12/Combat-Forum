"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ThumbsUp, MessageSquare, Flag, Share2, Plus } from "lucide-react";
import ReplyForm from "@/components/reply-form";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useEffect } from "react";
import ModerationControls from "@/components/moderation-controls";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function ThreadPage() {
  const router = useRouter();
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  
  const threadId = pathParts[pathParts.length - 1]; // Extract thread ID from URL
  const topicSlug = pathParts[pathParts.length - 2]; // Extract topic slug

  const topic = topicSlug.replace(/-/g, " ");
  const formattedTopic = topic
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { isSignedIn, user } = useUser();
  const userProfile = useQuery(api.users.getProfile, user?.id ? { userId: user.id } : "skip");
  const isModerator = userProfile?.role === "moderator" || userProfile?.role === "admin";

  const topics = useQuery(api.topics.list) || [];
  const currentTopic = topics.find((t) => t.name.toLowerCase().replace(/\s+/g, "-") === topicSlug.toLowerCase());

  const topicThreads = useQuery(api.threads.list, currentTopic ? { topicId: currentTopic._id } : "skip") || [];
  const foundThread = topicThreads.find((thread) => thread._id === threadId);

  const replies = useQuery(api.replies.list, foundThread ? { threadId: foundThread._id as Id<"threads"> } : "skip") || [];

  const incrementViews = useMutation(api.threads.incrementViews);
  useEffect(() => {
    if (foundThread) {
      incrementViews({ id: foundThread._id as Id<"threads"> });
    }
  }, [foundThread?._id]);

  if (!foundThread) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Thread not found</h2>
        <p className="mt-4 text-muted-foreground">The thread you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-6" asChild>
          <Link href={`/topics/${topicSlug}`}>Back to {formattedTopic}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/topics" className="hover:underline">Topics</Link>
            <span>/</span>
            <Link href={`/topics/${topicSlug}`} className="hover:underline">{formattedTopic}</Link>
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">{foundThread.title}</h1>
        </div>

        {/* ✅ "Create Thread" Button (if signed in) */}
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
          <div dangerouslySetInnerHTML={{ __html: foundThread.content }} className="prose dark:prose-invert max-w-none" />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
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
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(reply.createdAt))} ago</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div dangerouslySetInnerHTML={{ __html: reply.content }} className="prose dark:prose-invert max-w-none" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isSignedIn ? <ReplyForm threadId={foundThread._id as Id<"threads">} /> : (
          <Button asChild>
            <Link href="/sign-in">Sign In to Reply</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
