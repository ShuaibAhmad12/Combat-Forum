"use client"

import { useEffect, useRef } from "react"

interface BlogContentProps {
  content: string
  className?: string
}

export function BlogContent({ content, className = "" }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Set the innerHTML
      contentRef.current.innerHTML = content

      // Process headings to ensure they're properly displayed
      const processHeadings = () => {
        if (!contentRef.current) return

        // Find all heading elements
        const h1Elements = contentRef.current.querySelectorAll("h1")
        const h2Elements = contentRef.current.querySelectorAll("h2")

        // Process h1 elements
        h1Elements.forEach((h1) => {
          h1.setAttribute("data-type", "heading")
          h1.setAttribute("data-level", "1")
        })

        // Process h2 elements
        h2Elements.forEach((h2) => {
          h2.setAttribute("data-type", "heading")
          h2.setAttribute("data-level", "2")
        })

        // Log for debugging
        console.log("Processed headings:", {
          h1Count: h1Elements.length,
          h2Count: h2Elements.length,
        })
      }

      processHeadings()
    }
  }, [content])

  return <div ref={contentRef} className={`prose dark:prose-invert prose-lg max-w-none blog-content ${className}`} />
}
