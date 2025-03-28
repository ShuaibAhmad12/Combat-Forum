"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, TrendingUp, Dumbbell, Swords, Award, Flame } from 'lucide-react'
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import {formatDistanceToNow} from "date-fns/formatDistanceToNow"

// Map topic names to icons
const iconMap: Record<string, React.ReactNode> = {
  "trending-up": <TrendingUp className="h-6 w-6" />,
  "shield": <Shield className="h-6 w-6" />,
  "dumbbell": <Dumbbell className="h-6 w-6" />,
  "flame": <Flame className="h-6 w-6" />,
  "users": <Users className="h-6 w-6" />,
  "award": <Award className="h-6 w-6" />,
  "swords": <Swords className="h-6 w-6" />,
}

export default function TopicsPage() {
  const topics = useQuery(api.topics.list) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Martial Arts Topics</h1>
        <p className="text-muted-foreground">
          Browse all discussion topics or select a specific martial art to explore threads.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {topics.map((topic) => (
          <Link key={topic._id} href={`/topics/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}>
            <Card className={`hover:shadow-md transition-shadow ${topic.color}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {iconMap[topic.icon] || <Shield className="h-6 w-6" />}
                  <CardTitle>{topic.name}</CardTitle>
                </div>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">{topic.threadCount} threads</p>
                <p className="text-sm text-muted-foreground">
                  {topic.lastPostAt 
                    ? `Last post: ${formatDistanceToNow(new Date(topic.lastPostAt))} ago` 
                    : "No posts yet"}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}