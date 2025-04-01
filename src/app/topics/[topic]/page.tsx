"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Eye, ThumbsUp } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

export default function TopicPage() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const topicSlug = pathParts[pathParts.length - 1]; // Extract topic from URL

  const formattedTopic = topicSlug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const topics = useQuery(api.topics.list) || [];
  const [topicId, setTopicId] = useState<string | null>(null);

  // Find the topic ID based on the extracted topic slug
  useEffect(() => {
    if (topicSlug) {
      const matchingTopic = topics.find((t) => t.name.toLowerCase().replace(/\s+/g, "-") === topicSlug);
      if (matchingTopic) {
        setTopicId(matchingTopic._id);
      }
    }
  }, [topics, topicSlug]);

  // Fetch threads for this topic
  const threads = useQuery(api.threads.list, topicId ? { topicId: topicId as Id<"topics"> } : "skip") || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{formattedTopic} Discussions</h1>
          <p className="text-muted-foreground">Join the conversation about {formattedTopic} techniques, training, and more.</p>
        </div>
        <Link href={`/topics/${topicSlug}/new`}>
          <Button>New Thread</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {threads.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <h3 className="text-lg font-medium">No threads yet</h3>
              <p className="text-muted-foreground mt-2">Be the first to start a discussion about {formattedTopic}</p>
              {isSignedIn ? (
                <Button className="mt-4" asChild>
                  <Link href={`/topics/${topicSlug}/new`}>Create Thread</Link>
                </Button>
              ) : (
                <Button className="mt-4" asChild>
                  <Link href="/auth/login">Sign In to Create Thread</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          threads.map((thread) => (
            <Link key={thread._id} href={`/topics/${topicSlug}/${thread._id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{thread.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={thread.authorImageUrl || "/placeholder.svg?height=40&width=40"} alt={thread.authorName} />
                        <AvatarFallback>{thread.authorName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{thread.authorName}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(thread.createdAt))} ago</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-muted-foreground">
                    {thread.content.replace(/<[^>]*>/g, "")}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{thread.replyCount} replies</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{thread.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{thread.likes} likes</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
