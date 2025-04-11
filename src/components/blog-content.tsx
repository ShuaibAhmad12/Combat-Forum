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
      contentRef.current.innerHTML = content
    }
  }, [content])

  return <div ref={contentRef} className={`prose dark:prose-invert max-w-none ${className}`} />
}
