"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@clerk/clerk-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { Id } from "../../../../../convex/_generated/dataModel"

export default function NewThreadPage({ params }: { params: { topic: string } }) {
  const router = useRouter()
  const { isSignedIn, user } = useUser()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const topics = useQuery(api.topics.list) || []
  const [topicId, setTopicId] = useState<Id<"topics"> | null>(null)
  
  const createThread = useMutation(api.threads.create)
  
  // Find the topic ID based on the URL parameter
  useEffect(() => {
    const matchingTopic = topics.find(t => 
      t.name.toLowerCase().replace(/\s+/g, '-') === params.topic
    )
    if (matchingTopic) {
      setTopicId(matchingTopic._id)
    }
  }, [topics, params.topic])
  
  // Redirect to login if not signed in
  useEffect(() => {
    if (!isSignedIn && !user) {
      router.push(`/auth/login?redirect_url=/topics/${params.topic}/new`)
    }
  }, [isSignedIn, user, router, params.topic])
  
  const topic = params.topic.replace(/-/g, ' ')
  const formattedTopic = topic.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !topicId || !user) return
    
    setIsSubmitting(true)
    try {
      const threadId = await createThread({
        title,
        content,
        topicId,
        authorId: user.id,
        authorName: user.username || user.fullName || "User",
        authorImageUrl: user.imageUrl,
      })
      
      // Redirect to the new thread
      router.push(`/topics/${params.topic}/${threadId}`)
    } catch (error) {
      console.error("Failed to create thread:", error)
      setIsSubmitting(false)
    }
  }

  if (!isSignedIn || !user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/topics" className="hover:underline">Topics</Link>
        <span>/</span>
        <Link href={`/topics/${params.topic}`} className="hover:underline">{formattedTopic}</Link>
        <span>/</span>
        <span>New Thread</span>
      </div>

      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create New Thread</CardTitle>
            <CardDescription>
              Start a new discussion in the {formattedTopic} topic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Thread Title</Label>
              <Input 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your thread" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, questions, or insights..." 
                className="min-h-[200px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input 
                id="tags" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., technique, training, competition (separate with commas)" 
              />
              <p className="text-xs text-muted-foreground">
                Adding relevant tags helps others find your thread
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/topics/${params.topic}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Thread"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}