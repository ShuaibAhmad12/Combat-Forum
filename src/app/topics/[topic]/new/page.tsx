import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewThreadPage({ params }: { params: { topic: string } }) {
  const topic = params.topic.replace(/-/g, " ")
  const formattedTopic = topic
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/topics" className="hover:underline">
          Topics
        </Link>
        <span>/</span>
        <Link href={`/topics/${params.topic}`} className="hover:underline">
          {formattedTopic}
        </Link>
        <span>/</span>
        <span>New Thread</span>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Thread</CardTitle>
          <CardDescription>Start a new discussion in the {formattedTopic} topic</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Thread Title</Label>
            <Input id="title" placeholder="Enter a descriptive title for your thread" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, questions, or insights..."
              className="min-h-[200px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input id="tags" placeholder="e.g., technique, training, competition (separate with commas)" />
            <p className="text-xs text-muted-foreground">Adding relevant tags helps others find your thread</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/topics/${params.topic}`}>Cancel</Link>
          </Button>
          <Button>Create Thread</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

