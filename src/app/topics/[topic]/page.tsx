import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Eye, ThumbsUp } from "lucide-react"

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topic = params.topic.replace(/-/g, " ")
  const formattedTopic = topic
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // This would come from a database in a real application
  const threads = [
    {
      id: 1,
      title: `Best ${formattedTopic} techniques for beginners`,
      author: "MartialArtist42",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "2 hours ago",
      replies: 24,
      views: 156,
      likes: 18,
      excerpt: `I've been practicing ${formattedTopic} for about 3 months now and I'm looking for advice on the most effective techniques to focus on as a beginner...`,
    },
    {
      id: 2,
      title: `${formattedTopic} competition preparation tips`,
      author: "BlackBelt2023",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "Yesterday",
      replies: 31,
      views: 203,
      likes: 27,
      excerpt:
        "I have my first competition coming up in a month. What should I focus on in my training? Any advice on preparation, mindset, or strategy would be appreciated...",
    },
    {
      id: 3,
      title: `Recommended ${formattedTopic} schools in New York`,
      author: "NYCFighter",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "3 days ago",
      replies: 15,
      views: 98,
      likes: 7,
      excerpt: `I recently moved to New York City and I'm looking for recommendations on good ${formattedTopic} schools. Preferably in Manhattan or Brooklyn...`,
    },
    {
      id: 4,
      title: `${formattedTopic} vs Traditional Karate - Differences and Similarities`,
      author: "MartialHistorian",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "1 week ago",
      replies: 42,
      views: 312,
      likes: 35,
      excerpt:
        "I've been studying martial arts history and I'm interested in the evolution of different styles. Can anyone with experience in both disciplines share insights on the key differences and similarities...",
    },
    {
      id: 5,
      title: `Dealing with injuries in ${formattedTopic}`,
      author: "RecoveringFighter",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "1 week ago",
      replies: 28,
      views: 176,
      likes: 22,
      excerpt:
        "I recently sprained my ankle during training. Looking for advice on recovery, rehabilitation exercises, and when it's safe to return to full training...",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{formattedTopic} Discussions</h1>
          <p className="text-muted-foreground">
            Join the conversation about {formattedTopic} techniques, training, and more.
          </p>
        </div>
        <Link href={`/topics/${params.topic}/new`}>
          <Button>New Thread</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {threads.map((thread) => (
          <Link key={thread.id} href={`/topics/${params.topic}/${thread.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{thread.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={thread.authorAvatar} alt={thread.author} />
                      <AvatarFallback>{thread.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{thread.author}</span>
                    <span>•</span>
                    <span>{thread.date}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-muted-foreground">{thread.excerpt}</p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{thread.replies} replies</span>
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
        ))}
      </div>
    </div>
  )
}

