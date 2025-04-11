"use client"

import { useEffect, useRef } from "react"

interface BlogContentPreviewProps {
  content: string
  className?: string
  lineClamp?: number
}

export function BlogContentPreview({ content, className = "", lineClamp = 2 }: BlogContentPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = content
    }
  }, [content])

  return (
    <div
      ref={contentRef}
      className={`prose dark:prose-invert max-w-none ${className}`}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: lineClamp,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    />
  )
}
