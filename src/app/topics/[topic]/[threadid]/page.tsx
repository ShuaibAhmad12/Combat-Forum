import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, MessageSquare, Flag, Share2 } from "lucide-react"
import ReplyForm from "@/components/reply-form"
interface ThreadPageProps {
  params: {
    topic: string;
    threadId: string;
  };
}
export default function ThreadPage({ params }: ThreadPageProps) {
  const topic = params.topic.replace(/-/g, " ")
  const formattedTopic = topic
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // This would come from a database in a real application
  const thread = {
    id: params.threadId,
    title: `Best ${formattedTopic} techniques for beginners`,
    author: "MartialArtist42",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    authorJoined: "January 2023",
    authorPosts: 87,
    date: "2 hours ago",
    content: `
      <p>I've been practicing ${formattedTopic} for about 3 months now and I'm looking for advice on the most effective techniques to focus on as a beginner.</p>
      
      <p>My instructor has been teaching us a variety of moves, but I want to know which ones I should prioritize in my personal practice time. I'm particularly interested in techniques that:</p>
      
      <ul>
        <li>Build a solid foundation for more advanced moves</li>
        <li>Are practical for self-defense situations</li>
        <li>Help develop proper form and body mechanics</li>
      </ul>
      
      <p>Any advice from more experienced practitioners would be greatly appreciated!</p>
    `,
    likes: 18,
    replies: [
      {
        id: 1,
        author: "BlackBelt2023",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        authorJoined: "March 2020",
        authorPosts: 342,
        date: "1 hour ago",
        content: `
          <p>Welcome to the world of ${formattedTopic}! As someone who's been practicing for over 10 years, I'd recommend focusing on these fundamentals:</p>
          
          <ol>
            <li><strong>Proper stance and balance</strong> - This is the foundation of everything in ${formattedTopic}. Without good balance, even the best techniques will fail.</li>
            <li><strong>Basic footwork</strong> - Learning how to move efficiently is crucial before adding complex techniques.</li>
            <li><strong>Core strengthening exercises</strong> - A strong core will improve all your techniques and help prevent injuries.</li>
          </ol>
          
          <p>Don't rush to learn flashy moves. Master the basics first, and everything else will come more naturally.</p>
        `,
        likes: 12,
      },
      {
        id: 2,
        author: "CoachMike",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        authorJoined: "June 2018",
        authorPosts: 1243,
        date: "45 minutes ago",
        content: `
          <p>I've been teaching ${formattedTopic} for 15 years, and I always tell my beginners to focus on consistency over complexity.</p>
          
          <p>Practice these fundamental techniques daily:</p>
          
          <ul>
            <li>Basic blocks - They're not glamorous, but they'll save you in real situations</li>
            <li>Proper breathing techniques - Often overlooked but critical for power generation</li>
            <li>Simple strikes - Master straight punches before moving to hooks and uppercuts</li>
          </ul>
          
          <p>Also, don't neglect flexibility training. It will prevent injuries and improve your range of motion for techniques.</p>
          
          <p>Feel free to DM me if you have specific questions about your training!</p>
        `,
        likes: 8,
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/topics" className="hover:underline">
            Topics
          </Link>
          <span>/</span>
          <Link href={`/topics/${params.topic}`} className="hover:underline">
            {formattedTopic}
          </Link>
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">{thread.title}</h1>
      </div>

      <div className="space-y-6">
        {/* Original post */}
        <Card>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={thread.authorAvatar} alt={thread.author} />
              <AvatarFallback>{thread.author.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{thread.author}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Joined {thread.authorJoined}</span>
                    <span>•</span>
                    <span>{thread.authorPosts} posts</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{thread.date}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: thread.content }} className="prose dark:prose-invert max-w-none" />
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{thread.likes}</span>
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

        {/* Replies */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Replies ({thread.replies.length})</h2>
          <div className="space-y-4">
            {thread.replies.map((reply) => (
              <Card key={reply.id}>
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={reply.authorAvatar} alt={reply.author} />
                    <AvatarFallback>{reply.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{reply.author}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Joined {reply.authorJoined}</span>
                          <span>•</span>
                          <span>{reply.authorPosts} posts</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{reply.date}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    dangerouslySetInnerHTML={{ __html: reply.content }}
                    className="prose dark:prose-invert max-w-none"
                  />
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
        </div>

        <Separator />

        {/* Reply form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Post a Reply</h2>
          <ReplyForm threadId={params.threadId} />
        </div>
      </div>
    </div>
  )
}

