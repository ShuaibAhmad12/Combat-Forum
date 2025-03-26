"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, List, ListOrdered, LinkIcon } from "lucide-react"

interface ReplyFormProps {
  threadId: string
}

export default function ReplyForm({ threadId }: ReplyFormProps) {
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the reply to the server
    console.log("Submitting reply:", { threadId, content })
    // Reset form after submission
    setContent("")
  }

  const insertFormatting = (format: string) => {
    // Simple formatting helpers
    switch (format) {
      case "bold":
        setContent((prev) => prev + "**bold text**")
        break
      case "italic":
        setContent((prev) => prev + "*italic text*")
        break
      case "list":
        setContent((prev) => prev + "\n- List item 1\n- List item 2\n- List item 3")
        break
      case "ordered-list":
        setContent((prev) => prev + "\n1. First item\n2. Second item\n3. Third item")
        break
      case "link":
        setContent((prev) => prev + "[link text](https://example.com)")
        break
      default:
        break
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-md">
        <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("bold")}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
            <span className="sr-only">Bold</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("italic")}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
            <span className="sr-only">Italic</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("list")}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Bullet List</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("ordered-list")}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
            <span className="sr-only">Numbered List</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("link")}
            className="h-8 w-8 p-0"
          >
            <LinkIcon className="h-4 w-4" />
            <span className="sr-only">Link</span>
          </Button>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          className="min-h-[150px] border-0 focus-visible:ring-0 resize-y"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim()}>
          Post Reply
        </Button>
      </div>
    </form>
  )
}

