import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, TrendingUp, Dumbbell, Swords, Award, Flame } from "lucide-react"

export default function TopicsPage() {
  const topics = [
    {
      name: "MMA",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Mixed Martial Arts discussions, UFC events, and fighter analysis",
      threads: 324,
      color: "border-l-4 border-red-500",
    },
    {
      name: "Brazilian Jiu-Jitsu",
      icon: <Shield className="h-6 w-6" />,
      description: "BJJ techniques, competitions, belt progression, and training",
      threads: 256,
      color: "border-l-4 border-blue-500",
    },
    {
      name: "Boxing",
      icon: <Dumbbell className="h-6 w-6" />,
      description: "Boxing techniques, professional bouts, training methods, and equipment",
      threads: 198,
      color: "border-l-4 border-yellow-500",
    },
    {
      name: "Taekwondo",
      icon: <Flame className="h-6 w-6" />,
      description: "Taekwondo forms, competitions, belt advancement, and training",
      threads: 145,
      color: "border-l-4 border-green-500",
    },
    {
      name: "Judo",
      icon: <Users className="h-6 w-6" />,
      description: "Judo throws, competitions, training methods, and philosophy",
      threads: 132,
      color: "border-l-4 border-purple-500",
    },
    {
      name: "Karate",
      icon: <Award className="h-6 w-6" />,
      description: "Various Karate styles, kata, kumite, and dojo training",
      threads: 118,
      color: "border-l-4 border-orange-500",
    },
    {
      name: "Muay Thai",
      icon: <Swords className="h-6 w-6" />,
      description: "Muay Thai techniques, fights, training camps, and equipment",
      threads: 97,
      color: "border-l-4 border-pink-500",
    },
    {
      name: "Wrestling",
      icon: <Users className="h-6 w-6" />,
      description: "Freestyle and Greco-Roman wrestling, techniques, and competitions",
      threads: 89,
      color: "border-l-4 border-indigo-500",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Martial Arts Topics</h1>
        <p className="text-muted-foreground">
          Browse all discussion topics or select a specific martial art to explore threads.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {topics.map((topic, i) => (
          <Link key={i} href={`/topics/${topic.name.toLowerCase().replace(/\s+/g, "-")}`}>
            <Card className={`hover:shadow-md transition-shadow ${topic.color}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {topic.icon}
                  <CardTitle>{topic.name}</CardTitle>
                </div>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">{topic.threads} threads</p>
                <p className="text-sm text-muted-foreground">Last post: 2 hours ago</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

