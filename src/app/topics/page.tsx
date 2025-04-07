"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Shield, Users, TrendingUp, Dumbbell, Swords, Award, Flame, Search, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Map topic names to icons
const iconMap: Record<string, React.ReactNode> = {
  "trending-up": <TrendingUp className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  dumbbell: <Dumbbell className="h-6 w-6" />,
  flame: <Flame className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  award: <Award className="h-6 w-6" />,
  swords: <Swords className="h-6 w-6" />,
}

// Map color names to Tailwind classes that work with both light and dark themes
const colorMap: Record<string, string> = {
  red: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50",
  blue: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50",
  green:
    "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 hover:bg-green-100 dark:hover:bg-green-900/50",
  yellow:
    "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50 hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
  purple:
    "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50",
  orange:
    "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/50",
  teal: "border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/50",
  default:
    "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50",
}

export default function TopicsPage() {
  const topics = useQuery(api.topics.list) || []
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter topics based on search query and active tab
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "popular") return matchesSearch && topic.threadCount > 5
    if (activeTab === "recent") {
      return (
        matchesSearch && topic.lastPostAt && new Date(topic.lastPostAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      )
    }
    return matchesSearch
  })

  if (!topics.length) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading topics...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Martial Arts Topics</h1>
        <p className="text-muted-foreground">
          Browse all discussion topics or select a specific martial art to explore threads.
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search topics..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Topics</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No topics found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setActiveTab("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredTopics.map((topic, index) => (
              <Link key={topic._id} href={`/topics/${topic.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <Card
                  className={cn(
                    "border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
                    colorMap[topic.color] || colorMap.default,
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-background shadow-sm">
                        {iconMap[topic.icon] || <Shield className="h-6 w-6" />}
                      </div>
                      <CardTitle className="text-xl">{topic.name}</CardTitle>
                    </div>
                    <CardDescription className="mt-2 line-clamp-2">{topic.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {topic.threadCount} {topic.threadCount === 1 ? "thread" : "threads"}
                      </Badge>
                      {topic.threadCount > 10 && (
                        <Badge variant="outline" className="text-xs">
                          Popular
                        </Badge>
                      )}
                      {topic.lastPostAt &&
                        new Date(topic.lastPostAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) && (
                          <Badge variant="outline" className="text-xs">
                            Active
                          </Badge>
                        )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4">
                    {topic.lastPostAt ? (
                      <p className="text-sm text-muted-foreground flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 mr-2"></span>
                        Last post: {format(new Date(topic.lastPostAt), "MMM d")}
                        <span className="text-xs ml-1 opacity-70">({formatTimeAgo(new Date(topic.lastPostAt))})</span>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></span>
                        No posts yet
                      </p>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return `${Math.floor(diffInSeconds / 604800)}w ago`
}

